async function loadContact() {
  try {
    const res = await fetch("../JSON/contact.json");
    const data = await res.json();
    const c = data.contact;

    // 1. Phần giới thiệu
    document.getElementById("contact-about").innerHTML = `
        <div class="sec-title text-center">
          <div class="divider">
            <img src="../images/icons/divider_1.png" alt="">
          </div>
          <h2>Chúng tôi</h2>
          <div class="text">${c.aboutText}</div>
        </div>

        `;

    // 2. Giờ mở cửa
    let hoursHTML = "";
    c.openingHours.forEach((h) => {
      hoursHTML += `
                <li>${h.days}<br>${h.hours}</li>
            `;
    });

    document.getElementById("opening-hours").innerHTML = `
            <div class="inner-column">
              <div class="title">
                <div class="icon">
                  <img src="../images/icons/icon-devider-gray.png" alt="">
                </div>
                <h4>Giờ mở cửa</h4>
              </div>

              <ul class="contact-info">
                ${hoursHTML}
              </ul>
            </div>

        `;

    // 3. Thông tin liên hệ
    document.getElementById("contact-info").innerHTML = `
            <div class="inner-column">
              <div class="title">
                <div class="icon">
                  <img src="../images/icons/icon-devider-gray.png" alt="">
                </div>
                <h4>Liên hệ</h4>
              </div>

              <ul class="contact-info">
                <li>${c.address}</li>
                <li><a href="tel:${c.phone}">${c.phone}</a></li>
                <li><a href="mailto:${c.email}">${c.email}</a></li>
              </ul>
            </div>
        `;
  } catch (err) {
    console.error("Lỗi load contact:", err);
  }
}

loadContact();
