async function loadFooterInfo() {
  try {
    const config = window.API_CONFIG;
    const apiUrl = config
      ? config.getUrl("FOOTER")
      : "http://macaron.a.csoftlife.com/api/v1/PartnerStore";
    const response = await axios.get(apiUrl);
    const result = response.data;

    if (!result.success || !result.data || result.data.length === 0) {
      console.error("API trả về lỗi hoặc không có dữ liệu cửa hàng");
      return;
    }

    const store = result.data[0];

    // Cập nhật Số điện thoại
    const phoneEl = document.getElementById("footer-phone");
    if (phoneEl) {
      phoneEl.innerHTML = `Điện thoại : <a href="tel:${store.phoneNumber}" style="color: white;">${store.phoneNumber}</a>`;
    }

    // Cập nhật Địa chỉ
    const addressEl = document.getElementById("footer-address");
    if (addressEl) {
      addressEl.textContent = store.address || "";
    }

    // Cập nhật Social Links
    const fbEl = document.getElementById("footer-facebook");
    if (fbEl && store.urlFacebook) fbEl.href = store.urlFacebook;

    const ytEl = document.getElementById("footer-youtube");
    if (ytEl && store.urlYoutube) ytEl.href = store.urlYoutube;

    const igEl = document.getElementById("footer-instagram");
    if (igEl && store.urlInstagram) igEl.href = store.urlInstagram;

    // Cập nhật Copyright & Store Name
    const copyrightEl = document.getElementById("footer-copyright");
    if (copyrightEl) {
      const year = new Date().getFullYear();
      copyrightEl.textContent = `© ${year} ${store.storeName}. All Rights Reserved`;
    }
  } catch (err) {
    console.error("Lỗi load thông tin footer từ API:", err);
  }
}

// Hàm khởi tạo - Đợi footer.html load xong rồi mới chạy
function initFooterLoader() {
  // Vì footer thường được load động qua fetch, chúng ta cần đợi element #footer có nội dung
  const checkFooterExist = setInterval(() => {
    const footerElement = document.querySelector(".main-footer");
    if (footerElement) {
      clearInterval(checkFooterExist);
      loadFooterInfo();
    }
  }, 100);

  // Timeout sau 5s để tránh loop vô tận nếu không tìm thấy footer
  setTimeout(() => clearInterval(checkFooterExist), 5000);
}

// Chạy init
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFooterLoader);
} else {
  initFooterLoader();
}
