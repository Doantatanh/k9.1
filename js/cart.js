// ============================
// RENDER GIỎ HÀNG HEADER
// ============================
function renderCartItemHTML(item) {
  const name = item.flavor ? `${item.name} - vị ${item.flavor}` : item.name;
  return `
    <li class="cart-item">
      <img src="${item.image}" alt="${name}" class="thumb" />
      <span class="item-name">${name}</span>
      <span class="item-quantity"><span class="item-amount">${item.price.toLocaleString()}</span> (VNĐ)</span>
    </li>
  `;
}

function renderMiniCart(cartItems, total) {
  // 1. Quét tất cả các cụm giỏ hàng có trên trang (không phân biệt Mobile/Desktop)
  const allCarts = document.querySelectorAll(".shopping-cart");

  allCarts.forEach((cartEl) => {
    // 2. Xác định các thành phần con bên trong mỗi cụm
    const ul = cartEl.querySelector(".shopping-cart-items");
    let emptyMsg = cartEl.querySelector(".cart-empty-message");

    // Nếu trong HTML chưa có sẵn thẻ báo trống, ta tự tạo để tránh lỗi null
    if (!emptyMsg) {
      emptyMsg = document.createElement("div");
      emptyMsg.className = "cart-empty-message";
      emptyMsg.style.width = "150px";
      if (ul) ul.insertAdjacentElement("afterend", emptyMsg);
    }

    // Tìm hoặc tạo Cart Footer (chứa tổng tiền & nút thanh toán)
    let footer = cartEl.querySelector(".cart-footer");
    if (!footer) {
      footer = document.createElement("div");
      footer.className = "cart-footer";
      emptyMsg.insertAdjacentElement("afterend", footer);
    }

    // 3. Xóa trắng danh sách cũ để vẽ lại từ đầu
    if (ul) ul.innerHTML = "";

    // 4. KIỂM TRA GIỎ HÀNG
    if (!cartItems || cartItems.length === 0) {
      // TRƯỜNG HỢP RỖNG
      emptyMsg.style.display = "block";
      emptyMsg.textContent = "Chưa có sản phẩm nào"; // Hoặc dùng đa ngôn ngữ
      footer.style.display = "none";
    } else {
      // TRƯỜNG HỢP CÓ HÀNG
      emptyMsg.style.display = "none";
      footer.style.display = "block";

      // Đổ dữ liệu sản phẩm vào thẻ UL
      let itemsHTML = "";
      cartItems.forEach((item) => {
        itemsHTML += renderCartItemHTML(item);
      });
      if (ul) ul.innerHTML = itemsHTML;

      // Cập nhật nội dung Footer (Tổng tiền & Nút)
      footer.innerHTML = `
        <div class="shopping-cart-total">
            <strong data-lang="subtotal_v1">Tổng tiền:</strong>
            <span class="cart-total-amount">${total.toLocaleString()}</span> (VNĐ)
        </div>
        <div class="cart-buttons" style="display: flex; gap: 5px; margin-top: 10px;">
        <a href="/macaron/gio-hang.html" class="theme-btn" data-lang="page-title.cart">Giỏ hàng</a>
        <a href="/macaron/thanh-toan.html" class="theme-btn" data-lang="cart-summary.title">Thanh toán</a>
        </div>
      `;
    }
  });
}

// ============================
// RENDER CART UI FULL
// ============================
function renderCartUI() {
  const state = CartStore.getState();
  const cartItems = CartSelectors.getCartItems(state);
  const total = CartSelectors.getCartTotal(state);
  const totalCount = CartSelectors.getCartItemCount(state);

  renderMiniCart(cartItems, total);

  const countEls = document.querySelectorAll(
    ".main-header .cart-btn .count, .sticky-header .cart-btn .count, .mobile-header .cart-btn .count, .cart-count"
  );
  countEls.forEach((el) => (el.textContent = totalCount));
}

// ============================
// CHỈ SUBSCRIBE 1 LẦN
// ============================
let cartInitialized = false;
let storeSubscribed = false;

function initCart() {
  if (cartInitialized) return;
  cartInitialized = true;
  renderCartUI();
  if (!storeSubscribed) {
    CartStore.subscribe(renderCartUI);
    storeSubscribed = true;
  }
}

// ============================
// CHỈ KHỞI TẠO SAU KHI HEADER LOAD XONG
// ============================
// Trước khi initCart, đảm bảo CartStore đã nạp dữ liệu persist từ localStorage
function ensureStoreLoadedThenInit() {
  if (
    window.CartStore &&
    typeof window.CartStore.loadFromLocalStorage === "function" &&
    !window.CartStore.loadedFromStorage
  ) {
    window.CartStore.loadFromLocalStorage();
  }
  initCart();
}

// Nếu header đã load trước đó thì init ngay (với việc nạp storage trước),
// nếu header được nhúng trực tiếp trong HTML thì init ngay, còn không lắng nghe sự kiện header:loaded
if (window.headerLoaded) {
  ensureStoreLoadedThenInit();
} else if (document.querySelectorAll(".shopping-cart").length) {
  // header có thể đã được nhúng trực tiếp trong HTML
  ensureStoreLoadedThenInit();
} else {
  document.addEventListener("header:loaded", ensureStoreLoadedThenInit, {
    once: true,
  });
}
