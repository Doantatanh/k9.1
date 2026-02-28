async function loadContact() {
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

    // 1. Phần giới thiệu
    const contactAbout = document.getElementById("contact-about");
    if (contactAbout) {
      contactAbout.innerHTML = `
        <div class="sec-title text-center">
          <div class="divider">
            <img src="../images/icons/divider_1.png" alt="">
          </div>
          <h2>Chúng tôi</h2>
          <div class="text">${store.generalNote}</div>
        </div>
      `;
    }

    // 2. Giờ mở cửa
    const openingHours = document.getElementById("opening-hours");
    if (openingHours) {
      const weekdayText = "Thứ 2 - Thứ 6";
      const weekendText = "Thứ 7 - Chủ nhật";

      openingHours.innerHTML = `
            <div class="inner-column">
              <div class="title">
                <div class="icon">
                  <img src="../images/icons/icon-devider-gray.png" alt="">
                </div>
                <h4>Giờ mở cửa</h4>
              </div>

              <ul class="contact-info">
                <li>${weekdayText}<br>${store.openTimeWeekday || "9:00"} - ${store.closeTimeWeekday || "21:00"}</li>
                <li>${weekendText}<br>${store.openTimeWeekend || "9:00"} - ${store.closeTimeWeekend || "21:00"}</li>
              </ul>
            </div>
        `;
    }

    // 3. Thông tin liên hệ
    const contactInfo = document.getElementById("contact-info");
    if (contactInfo) {
      contactInfo.innerHTML = `
            <div class="inner-column">
              <div class="title">
                <div class="icon">
                  <img src="../images/icons/icon-devider-gray.png" alt="">
                </div>
                <h4>Liên hệ</h4>
              </div>

              <ul class="contact-info">
                <li>${store.address || ""}</li>
                <li><a href="tel:${store.phoneNumber}">${store.phoneNumber || ""}</a></li>
                <li><a href="mailto:${store.email}">${store.email || ""}</a></li>
              </ul>
            </div>
        `;
    }
  } catch (err) {
    console.error("Lỗi load contact:", err);
  }
}

loadContact();
