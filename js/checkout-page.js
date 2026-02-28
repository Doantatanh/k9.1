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
                <td class="product-name">${displayName}</td>

                <td class="product-quantity">${item.quantity}</td>

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
  const getVal = (id) => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
  };

  return {
    fullName: getVal("txtFullName"),
    address: getVal("txtAddress"),
    phone: getVal("txtPhone"),
    timeGet: getVal("txtTimeGet"),
    comment: getVal("txtComment"),
    paymentMethod: document.querySelector("input[name='paymentgroup']:checked")
      ? document.querySelector("input[name='paymentgroup']:checked").value
      : null,
  };
}

function loadCheckoutInfo() {
  const saved = JSON.parse(localStorage.getItem("checkoutInfo"));
  if (!saved) return;

  const fields = {
    txtFullName: "fullName",
    txtAddress: "address",
    txtPhone: "phone",
    txtTimeGet: "timeGet",
    txtComment: "comment",
  };

  for (const [id, key] of Object.entries(fields)) {
    const el = document.getElementById(id);
    if (el) el.value = saved[key] || "";
  }

  // Phương thức thanh toán
  if (saved.paymentMethod) {
    const radio = document.querySelector(
      `input[name='paymentgroup'][value='${saved.paymentMethod}']`,
    );
    if (radio) radio.checked = true;
  }
}

function generateOrderNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomStr = "";
  for (let i = 0; i < 6; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `${year}-${month}-${day}-${randomStr}`;
}

const orderNumberEl = document.getElementById("txtOrderNumber");
if (orderNumberEl) {
  orderNumberEl.textContent = generateOrderNumber();
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

    // Kiểm tra phương thức thanh toán
    if (!info.paymentMethod) {
      swal(t("missingInfoTitle"), t("missingPayment"), "error");
      return;
    }

    // Lưu thông tin
    localStorage.setItem("checkoutInfo", JSON.stringify(info));

    window.location.href = "xac-nhan-don-hang.html";
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
