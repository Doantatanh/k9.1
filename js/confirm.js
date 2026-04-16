document.addEventListener("DOMContentLoaded", () => {
  // 1. Hàm định dạng tiền tệ VND
  const formatVND = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " VND";
  };

  // 2. Lấy dữ liệu đơn hàng từ localStorage
  const orderDataRaw = localStorage.getItem("lastOrder");
  if (!orderDataRaw) {
    // Nếu không có đơn hàng, chuyển về trang chủ
    // window.location.href = 'index.html';
    return;
  }

  const orderData = JSON.parse(orderDataRaw);
  const { orderId, total, paymentMethod } = orderData;

  // 3. Cập nhật các phần tử giao diện chung
  const orderIdDisplay = document.getElementById("order-id-display");
  if (orderIdDisplay) orderIdDisplay.innerText = `#${orderId}`;

  // Cập nhật tất cả các vị trí hiển thị tổng tiền và nội dung chuyển khoản
  document
    .querySelectorAll(".confirm-total-all")
    .forEach((el) => (el.innerText = formatVND(total)));
  document
    .querySelectorAll(".confirm-bank-memo-all")
    .forEach((el) => (el.innerText = orderId));

  // 4. Xử lý hiển thị Section theo phương thức thanh toán
  const bankSection = document.getElementById("bank-transfer-section");
  const momoSection = document.getElementById("momo-transfer-section");

  if (paymentMethod === "pay-momo") {
    if (momoSection) momoSection.classList.remove("d-none");
    if (bankSection) bankSection.classList.add("d-none");
  } else {
    if (bankSection) bankSection.classList.remove("d-none");
    if (momoSection) momoSection.classList.add("d-none");

    // Tạo URL QR VietQR nếu là chuyển khoản bank
    const qrCodeImg = document.getElementById("qr-code-img");
    if (qrCodeImg) {
      const bankId = "vcb";
      const accountNo = "123456789";
      const template = "compact2";
      const accountName = encodeURIComponent("CONG TY LUMINIA IT");
      const description = encodeURIComponent(`${orderId} THANH TOAN HOC PHI`);
      qrCodeImg.src = `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.jpg?amount=${total}&addInfo=${description}&accountName=${accountName}`;
    }
  }

  console.log("Order confirmed with:", paymentMethod);
});
