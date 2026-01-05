// ================================
// RENDER GIỎ HÀNG TRANG THANH TOÁN
// ================================
function renderCheckoutPage() {
  const cartItems = CartStore.getState();
  const tbody = document.querySelector(".order-box tbody");
  const totalEl = document.querySelector(".order-total .amount");

  if (!tbody) return;

  // Nếu giỏ hàng trống → về trang chủ
  if (cartItems.length === 0) {
    window.location.href = "../index.html";
    return;
  }

  // Render danh sách sản phẩm
  tbody.innerHTML = cartItems
    .map((item) => {
      const itemId = item.uniqueId || item.id;
      const displayName = item.flavor
        ? `${item.name} - vị ${item.flavor}`
        : item.name;
      const subtotal = item.price * item.quantity;

      return `
            <tr class="cart-item">
                <td class="product-name">
                    ${displayName}        
                    <strong class="product-quantity">× ${item.quantity}</strong>
                </td>

                <td class="product-total">
                    <span class="woocommerce-Price-amount amount">${subtotal.toLocaleString()}</span>
                </td>
            </tr>

        `;
    })
    .join("");

  // Cập nhật tổng tiền
  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  if (totalEl) totalEl.innerText = total.toLocaleString() + " VNĐ";
}

function getCheckoutInfo() {
  return {
    fullName: document.getElementById("txtFullName").value.trim(),
    address: document.getElementById("txtAddress").value.trim(),
    phone: document.getElementById("txtPhone").value.trim(),
    timeGet: document.getElementById("txtTimeGet").value.trim(),
    comment: document.getElementById("txtComment").value.trim(),
    paymentMethod: document.querySelector("input[name='paymentgroup']:checked")
      ? document.querySelector("input[name='paymentgroup']:checked").value
      : null,
  };
}

function loadCheckoutInfo() {
  const saved = JSON.parse(localStorage.getItem("checkoutInfo"));
  if (!saved) return;

  document.getElementById("txtFullName").value = saved.fullName || "";
  document.getElementById("txtAddress").value = saved.address || "";
  document.getElementById("txtPhone").value = saved.phone || "";
  document.getElementById("txtTimeGet").value = saved.timeGet || "";
  document.getElementById("txtComment").value = saved.comment || "";

  // Phương thức thanh toán
  if (saved.paymentMethod) {
    const radio = document.querySelector(
      `input[name='paymentgroup'][value='${saved.paymentMethod}']`
    );
    if (radio) radio.checked = true;
  }
}

const paymentConfirmationBtn = document.getElementById("btComplete");

const messages = {
  vi: {
    missingInfoTitle: "Thiếu thông tin",
    missingInfoText: "Vui lòng nhập đầy đủ!",
    invalidPhoneTitle: "Sai định dạng",
    invalidPhoneText: "Số điện thoại không hợp lệ!",
    missingPayment: "Vui lòng chọn phương thức thanh toán!",
    successTitle: "Thành công",
    successText: "Thông tin hợp lệ! Đang chuyển trang...",
  },

  en: {
    missingInfoTitle: "Missing information",
    missingInfoText: "Please fill in all required fields!",
    invalidPhoneTitle: "Invalid format",
    invalidPhoneText: "Invalid phone number!",
    missingPayment: "Please select a payment method!",
    successTitle: "Success",
    successText: "Information is valid. Redirecting...",
  },
};

function t(key) {
  const lang = localStorage.getItem("selectedLang") || "vi";
  return messages[lang]?.[key] || key;
}

if (paymentConfirmationBtn) {
  paymentConfirmationBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const info = getCheckoutInfo();

    if (!info.fullName || !info.address || !info.phone || !info.timeGet) {
      swal(t("missingInfoTitle"), t("missingInfoText"), "error");

      return;
    }

    if (!/^(0|\+84)[0-9]{9}$/.test(info.phone)) {
      swal(t("invalidPhoneTitle"), t("invalidPhoneText"), "error");
      return;
    }

    // Kiểm tra phương thức thanh toán
    if (!info.paymentMethod) {
      swal(t("missingInfoTitle"), t("missingPayment"), "error");
      return;
    }

    // Lưu thông tin
    localStorage.setItem("checkoutInfo", JSON.stringify(info));

    swal(t("successTitle"), t("successText"), "success").then(() => {
      window.location.href = "xac-nhan-don-hang.html";
    });
  });
}

// ================================
// INIT
// ================================
document.addEventListener("DOMContentLoaded", () => {
  renderCheckoutPage();
  loadCheckoutInfo();
  CartStore.subscribe(renderCheckoutPage);
});
