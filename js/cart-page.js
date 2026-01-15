// ================================
// RENDER GIỎ HÀNG TRANG gio-hang.html
// ================================
function renderCartPage() {
  const cartItems = CartStore.getState();
  const tbody = document.querySelector(".cart-table tbody");
  const totalEl = document.querySelector(".total-price");

  if (!tbody) return;

  // Nếu giỏ hàng rỗng → chuyển về trang chủ
  if (cartItems.length === 0) {
    window.location.href = "../index.html";
    return;
  }

  // Render danh sách sản phẩm
  tbody.innerHTML = cartItems
    .map((item, index) => {
      const subtotal = item.price * item.quantity;
      const itemId = item.uniqueId || item.id;
      const displayName = item.flavor
        ? `${item.name} - vị ${item.flavor}`
        : item.name;

      return `
      <tr class="cart-item">
        <td class="product-thumbnail">
          <a>
             <img src="${item.image}" alt="${displayName}">
          </a>
        </td>

        <td class="product-name">
          <a href="#">${displayName}</a>
        </td>
                                                
        <td class="product-price">
          <span> ${item.price.toLocaleString()}</span>
        </td>
                                                
        <td class="product-quantity">
          <div class="quantity">
            <button 
              class="qty-btn minus" 
              data-id="${itemId}"
              ${item.quantity === 1 ? "disabled" : ""}
            >
              -
            </button>


            <input
              type="number"
              min="1"
              value="${item.quantity}"
              class="qty"
              data-id="${itemId}"
            >


            <button class="qty-btn plus" data-id="${itemId}">+</button>
          </div>
        </td>


        <td class="product-subtotal">
          <span class="amount">
            <span>${subtotal.toLocaleString()}</span>
          </span>
        </td>

        <td class="product-remove">
            <button class="remove-item" data-id="${itemId}">
                <span class="fa fa-times"></span>
            </button>
        </td>
      </tr>
    `;
    })
    .join("");

  // Cập nhật tổng tiền
  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  if (totalEl) totalEl.innerText = total.toLocaleString() + " (VNĐ)";

  attachCartPageEvents();
}

// ================================
// EVENT: Update quantity + Remove item
// ================================
function attachCartPageEvents() {
  document.querySelectorAll(".qty-btn.plus").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;

      CartStore.dispatch(CartActions.changeQuantity(id, 1));
    });
  });

  document.querySelectorAll(".qty-btn.minus").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;

      CartStore.dispatch(CartActions.changeQuantity(id, -1));
    });
  });

  document.querySelectorAll(".qty").forEach((input) => {
    input.addEventListener("change", (e) => {
      const id = e.target.dataset.id;
      let value = parseInt(e.target.value);

      // Nếu nhập sai → reset về 1
      if (isNaN(value) || value < 1) {
        value = 1;
      }

      CartStore.dispatch(CartActions.updateQuantity(id, value));
    });
  });

  // Remove item
  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      const id = btn.dataset.id;

      CartStore.dispatch(CartActions.removeFromCart(id));
    });
  });
}

// ================================
// SAVE CHECKOUT INFO
// ================================
function getSavedCheckoutInfo() {
  const data = localStorage.getItem("checkoutInfo");
  return data ? JSON.parse(data) : null;
}

// ================================
// SUBMIT ORDER (API)
// ================================
async function submitOrder() {
  const cartItems = CartStore.getState();
  const checkoutInfo = getSavedCheckoutInfo();

  if (!checkoutInfo) {
    swal("Lỗi", "Chưa có thông tin thanh toán!", "error");
    return;
  }

  if (cartItems.length === 0) {
    swal("Lỗi", "Giỏ hàng trống!", "error");
    return;
  }

  const orderPayload = {
    customer: {
      fullName: checkoutInfo.fullName,
      phone: checkoutInfo.phone,
      address: checkoutInfo.address,
      timeGet: checkoutInfo.timeGet,
      note: checkoutInfo.comment,
    },
    paymentMethod:
      String(checkoutInfo.paymentMethod) === "1" ? "COD" : "PAY_AT_STORE",
    items: cartItems.map((i) => ({
      productId: i.productId,
      variantId: i.variantId,
      flavor: i.flavor,
      quantity: i.quantity,
      price: i.price,
    })),
    total: cartItems.reduce((s, i) => s + i.price * i.quantity, 0),
  };

  console.log("----- MÔ PHỎNG GỬI API -----");
  console.log("Dữ liệu sẽ gửi đi:", orderPayload);
  console.log("----------------------------");

  // =====================
  // GỬI API (MỞ COMMENT KHI CÓ BACKEND)
  // =====================
  /*
  await fetch("https://api.yourdomain.com/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderPayload),
  });
  */

  // Thành công
  // CartStore.dispatch(CartActions.clearCart());
  // localStorage.removeItem("checkoutInfo");

  // Tạm thời comment chuyển trang để xem log
  // window.location.href = "../macaron/hoan-thanh-don-hang.html";
}

// ================================
// INIT
// ================================
document.addEventListener("DOMContentLoaded", () => {
  renderCartPage();
  CartStore.subscribe(renderCartPage);

  // NÚT CHUYỂN SANG TRANG THANH TOÁN
  const paymentBtn = document.getElementById("btMovePayment");
  if (paymentBtn) {
    paymentBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "../macaron/thanh-toan.html";
    });
  }

  const btBack = document.getElementById("btBack");
  if (btBack) {
    btBack.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "../macaron/thanh-toan.html";
    });
  }

  const btComplete = document.getElementById("btCompleteCart");
  if (btComplete) {
    btComplete.addEventListener("click", (e) => {
      e.preventDefault();
      submitOrder();
    });
  }
});
