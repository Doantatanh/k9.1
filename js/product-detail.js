window.currentProduct = null;

/* ========================
   Helpers
======================== */

function getProductIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id") || params.get("productId");
}

function formatPrice(price) {
  return price.toLocaleString("vi-VN") + " VNĐ";
}

/* ========================
   Render functions
======================== */

function renderBasicInfo(product) {
  const imgEl = document.querySelector(".basic-details .image-column img");
  const nameEl = document.querySelector(".basic-details h4");
  const priceEl = document.querySelector(".basic-details .item-price");

  if (imgEl) {
    imgEl.src = product.image;
    imgEl.alt = product.name;
  }

  nameEl.textContent = product.name;

  const price = product.variants?.[0]?.price || product.basePrice || 0;

  priceEl.textContent = formatPrice(price);
}

function renderDescription(product) {
  document
    .querySelectorAll(".detail-description")
    .forEach((el) => (el.innerHTML = product.description));
}

function renderVariants(product) {
  if (!product.variants || product.variants.length <= 1) return;

  const infoCol = document.querySelector(".info-column");

  const optionsHTML = product.variants
    .map((v) => {
      const label = v.attributes?.label || v.variantId;
      return `
      <option 
        value="${v.variantId}" 
        data-price="${v.price}">
        ${label}
      </option>`;
    })
    .join("");

  infoCol.insertAdjacentHTML(
    "beforeend",
    `
    <div class="item-option" style="margin-top:20px">
      <label style="font-weight:bold">Hương vị / Lựa chọn:</label>
      <select id="variantSelect" class="form-control" style="max-width:300px">
        ${optionsHTML}
      </select>
    </div>
  `,
  );

  document
    .getElementById("variantSelect")
    .addEventListener("change", function () {
      const price = Number(this.selectedOptions[0].dataset.price);
      document.querySelector(".basic-details .item-price").textContent =
        formatPrice(price);
    });
}

function renderBreadcrumb(product) {
  const breadcrumb = document.querySelector(".page-breadcrumb .a2");
  if (breadcrumb) breadcrumb.textContent = product.name;
}

/* ========================
   Main
======================== */

async function loadProductDetail() {
  const productId = getProductIdFromURL();

  if (!productId) {
    console.warn("Không tìm thấy ID trên URL");
    return;
  }

  try {
    const res = await fetch("../JSON/products-detail.json");
    const products = await res.json();

    const product = products.find(
      (p) => String(p.productId) === String(productId),
    );

    if (!product) {
      console.error("Không tìm thấy sản phẩm");
      return;
    }

    window.currentProduct = product;

    // 👉 LOAD RELATED PRODUCTS
    const resCat = await fetch("../JSON/products-category.json");
    const dataCat = await resCat.json();

    loadRelatedProducts(dataCat, window.currentProduct);

    renderBasicInfo(product);
    renderDescription(product);
    renderVariants(product);
    renderBreadcrumb(product);

    const hiddenId = document.getElementById("HProductId");
    if (hiddenId) hiddenId.value = product.productId;
  } catch (err) {
    console.error("Lỗi loadProductDetail:", err);
  }
}

function showCartToast(message, type = "success") {
  const toast = $("#cartToast");
  const header = toast.find(".toast-header");

  header.removeClass("bg-success bg-danger bg-warning bg-info");
  header.addClass(`bg-${type}`);

  $("#cartToastBody").text(message);

  toast.toast("show");
}

/* ========================
   Add to cart handler
======================== */
let isAddingToCart = false;

function AddToCart() {
  const qtyInput = document.getElementById("txtQuantity");
  const quantity = qtyInput ? parseInt(qtyInput.value) : 1;

  if (isNaN(quantity) || quantity < 1) {
    swal("Lỗi", "Số lượng phải lớn hơn 0!", "error");
    return;
  }

  if (isAddingToCart) return;
  isAddingToCart = true;

  const btn = document.getElementById("btAdd");
  if (btn) btn.disabled = true;

  if (!window.currentProduct) {
    swal("Lỗi", "Chưa tải được dữ liệu sản phẩm!", "error");
    return;
  }

  // 👉 LẤY VARIANT ĐANG CHỌN
  let selectedVariant = window.currentProduct.variants[0];

  const variantSelect = document.getElementById("variantSelect");
  if (variantSelect) {
    const variantId = variantSelect.value;
    selectedVariant = window.currentProduct.variants.find(
      (v) => v.variantId === variantId,
    );
  }

  const productId = window.currentProduct.productId;
  const variantId = selectedVariant.variantId;
  // 👉 ITEM GỬI SANG CART
  const cartItem = {
    productId,
    variantId,
    uniqueId: `${productId}_${variantId}`,
    name: window.currentProduct.name,
    image: window.currentProduct.image,
    price: selectedVariant.price,
    quantity: quantity,
    flavor: selectedVariant.attributes?.label || "",
  };

  CartStore.dispatch(CartActions.addToCart(cartItem));

  showCartToast(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`, "success");

  setTimeout(() => resetAddToCart(btn), 1000);
}

/* ========================
   Reset add to cart handler
======================== */
function resetAddToCart(btn) {
  isAddingToCart = false;
  if (btn) btn.disabled = false;
}

/* ========================
   Init
======================== */

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadProductDetail);
} else {
  loadProductDetail();
}
