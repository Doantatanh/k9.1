/* ========================
   Prevent non-numeric input
======================== */
document.addEventListener("input", function (e) {
  if (e.target.classList.contains("qty")) {
    e.target.value = e.target.value.replace(/[eE+-]/g, "");
  }
});

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
    Swal.fire("Lỗi", "Chưa có thông tin thanh toán!", "error");
    return;
  }

  if (cartItems.length === 0) {
    Swal.fire("Lỗi", "Giỏ hàng trống!", "error");
    return;
  }

  // Chuyển cấu trúc dữ liệu theo yêu cầu API
  const orderPayload = {
    fullName: checkoutInfo.fullName,
    phone: checkoutInfo.phone,
    email: checkoutInfo.email || "",
    address: checkoutInfo.address,
    generalNote: checkoutInfo.comment || "",
    corePaymentMethodId: parseInt(checkoutInfo.paymentMethod) || 1,
    coreShipUnitId: 1, // Mặc định 1
    deliveryTime: checkoutInfo.timeGet || "",
    orderNote: checkoutInfo.comment || "",
    orderItems: cartItems.map((item) => ({
      variantId: item.variantId || 0,
      qty: item.quantity,
    })),
    createdBy: 1,
    domainId: 1,
  };

  // Vẫn in log để bạn theo dõi thông tin gửi đi
  console.log("=== DỮ LIỆU ĐẶT HÀNG (PAYLOAD) ===");
  console.log(orderPayload);
  console.log("==================================");

  // Hiển thị loading
  Swal.fire({
    title: "Đang gửi đơn hàng...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const config = window.API_CONFIG;
    const apiUrl = config
      ? config.getUrl("ORDER")
      : "http://macaron.a.csoftlife.com/api/v1/CoreOrder";

    const response = await axios.post(apiUrl, orderPayload);
    const result = response.data;

    if (result.success) {
      // Thành công: Xoá giỏ hàng và thông tin tạm
      CartStore.dispatch(CartActions.clearCart());
      localStorage.removeItem("checkoutInfo");

      // Lấy mã đơn hàng từ response (nếu có trường coreOrderId)
      const orderId = result.data?.coreOrderId || "";

      Swal.fire({
        title: "Thành công!",
        text: "Đơn hàng của bạn đã được gửi thành công.",
        icon: "success",
        confirmButtonText: "Đóng",
      }).then(() => {
        // Chuyển hướng sang trang hoàn tất
        window.location.href = `../macaron/hoan-thanh-don-hang.html?id=${orderId}`;
      });
    } else {
      Swal.fire("Lỗi", result.message || "Không thể gửi đơn hàng", "error");
    }
  } catch (err) {
    console.error("Lỗi gửi đơn hàng:", err);
    Swal.fire(
      "Lỗi",
      "Đã có lỗi xảy ra khi kết nối tới máy chủ. Vui lòng thử lại!",
      "error",
    );
  }
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
      Swal.fire({
        title: "Xác nhận đơn hàng",
        text: "Bạn có chắc chắn muốn đặt hàng?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Đặt hàng",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          submitOrder();
        }
      });
    });
  }
});
