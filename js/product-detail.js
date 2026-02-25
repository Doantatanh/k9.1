window.currentProduct = null;
// Lấy cấu hình từ global, nếu không có thì fallback sang thông tin mặc định
const config = window.API_CONFIG || {
  BASE_URL: "http://macaron.a.csoftlife.com",
  getUrl: (key) =>
    "http://macaron.a.csoftlife.com/api/v1/CoreProduct" +
    (key === "PRODUCT_DETAIL" ? "/detail" : "/list"),
  getImgUrl: (path) => (path ? `http://macaron.a.csoftlife.com${path}` : ""),
};

/* ========================
   Helpers
======================== */

function getProductIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id") || params.get("productId");
}

function formatPrice(price) {
  return (price || 0).toLocaleString("vi-VN") + " VNĐ";
}

/* ========================
   Render functions
======================== */

function renderBasicInfo(product) {
  const imgEl = document.getElementById("detail-image");
  const nameEl = document.getElementById("detail-name");
  const priceEl = document.getElementById("detail-price");

  if (imgEl) {
    imgEl.src = product.avatar
      ? config.getImgUrl(product.avatar)
      : "../images/resource/products/1.jpg";
    imgEl.alt = product.productName || "";
  }

  if (nameEl) nameEl.textContent = product.productName || "";

  // Ưu tiên variant giá đầu tiên nếu có, không thì lấy basePrice
  const price = product.variants?.[0]?.basePrice || product.basePrice || 0;
  if (priceEl) priceEl.textContent = formatPrice(price);
}

function renderDescription(product) {
  document.querySelectorAll(".detail-description").forEach((el) => {
    el.innerHTML =
      product.description || product.generalNote || "Đang cập nhật...";
  });
}

function renderVariants(product) {
  // Clear variant container if any
  const existingSelect = document.getElementById("variantSelect");
  if (existingSelect) {
    const parentContainer = existingSelect.closest(".item-option");
    if (parentContainer) parentContainer.remove();
  }

  if (!product.variants || product.variants.length === 0) return;

  const infoCol = document.querySelector(".info-column");
  if (!infoCol) return;

  const optionsHTML = product.variants
    .map((v) => {
      const label =
        v.attributes && v.attributes.length > 0
          ? v.attributes.map((attr) => attr.attributeValue).join(" - ")
          : v.variantName || `Phân loại ${v.coreProductVariantId}`;

      const vPrice = v.price || v.basePrice || product.basePrice || 0;
      return `
      <option 
        value="${v.coreProductVariantId}" 
        data-price="${vPrice}">
        ${label}
      </option>`;
    })
    .join("");

  infoCol.insertAdjacentHTML(
    "beforeend",
    `
    <div class="item-option" style="margin-top:20px">
      <label style="font-weight:bold">Lựa chọn:</label>
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
      const priceEl = document.getElementById("detail-price");
      if (priceEl) priceEl.textContent = formatPrice(price);
    });
}

function renderBreadcrumb(product) {
  const breadcrumb = document.querySelector(".page-breadcrumb .a2");
  if (breadcrumb) breadcrumb.textContent = product.productName || "";
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
    const apiUrl = `${config.getUrl("PRODUCT_DETAIL")}/${productId}`;
    const response = await axios.get(apiUrl);
    const result = response.data;

    if (!result.success || !result.data) {
      console.error("Không tìm thấy sản phẩm từ API");
      return;
    }

    const product = result.data;
    window.currentProduct = product;

    // Load Related Products (nếu có hàm này từ related-products.js)
    if (typeof loadRelatedProducts === "function") {
      try {
        const catId =
          product.categories && product.categories.length > 0
            ? product.categories[0].coreCategoryId
            : 1;
        const resList = await axios.get(
          `${config.getUrl("PRODUCT_LIST")}?categoryId=${catId}&pageIndex=1&pageSize=4`,
        );
        if (resList.data.success) {
          loadRelatedProducts(resList.data.data, product);
        }
      } catch (e) {
        console.warn("Không thể load liên quan:", e);
      }
    }

    renderBasicInfo(product);
    renderDescription(product);
    renderVariants(product);
    renderBreadcrumb(product);

    const hiddenId = document.getElementById("HProductId");
    if (hiddenId) hiddenId.value = product.coreProductId;
  } catch (err) {
    console.error("Lỗi loadProductDetail:", err);
  }
}

function showCartToast(message, type = "success") {
  if (typeof notyf !== "undefined") {
    if (type === "success") notyf.success(message);
    else notyf.error(message);
  } else {
    const toast = $("#cartToast");
    if (toast.length) {
      const header = toast.find(".toast-header");
      header
        .removeClass("bg-success bg-danger bg-warning bg-info")
        .addClass(`bg-${type}`);
      $("#cartToastBody").text(message);
      toast.toast("show");
    }
  }
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
    isAddingToCart = false;
    if (btn) btn.disabled = false;
    return;
  }

  // Lấy Variant đang chọn
  let selectedVariant = null;
  const variantSelect = document.getElementById("variantSelect");

  if (variantSelect && window.currentProduct.variants?.length > 0) {
    const vId = variantSelect.value;
    selectedVariant = window.currentProduct.variants.find(
      (v) => String(v.coreProductVariantId) === String(vId),
    );
  }

  const productId = window.currentProduct.coreProductId;
  const variantId = selectedVariant ? selectedVariant.coreProductVariantId : 0;
  const price = selectedVariant
    ? (vPrice = selectedVariant.basePrice || window.currentProduct.basePrice)
    : window.currentProduct.basePrice;

  const cartItem = {
    productId,
    variantId,
    uniqueId: `${productId}_${variantId}`,
    name: window.currentProduct.productName,
    image: window.currentProduct.avatar
      ? config.getImgUrl(window.currentProduct.avatar)
      : "../images/resource/products/1.jpg",
    price: price,
    quantity: quantity,
    flavor: selectedVariant
      ? selectedVariant.attributes && selectedVariant.attributes.length > 0
        ? selectedVariant.attributes
            .map((attr) => attr.attributeValue)
            .join(" - ")
        : selectedVariant.variantName || ""
      : "",
  };

  // Dispatch to Redux Store
  if (typeof CartStore !== "undefined") {
    CartStore.dispatch(CartActions.addToCart(cartItem));
    showCartToast(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`, "success");
  } else {
    console.error("CartStore not found");
    swal("Lỗi", "Không thể thêm vào giỏ hàng (CartStore missing)", "error");
  }

  setTimeout(() => {
    isAddingToCart = false;
    if (btn) btn.disabled = false;
  }, 1000);
}

/* ========================
   Init
======================== */

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadProductDetail);
} else {
  loadProductDetail();
}
