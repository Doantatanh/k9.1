/* =========================================
   CẤU HÌNH CHUNG
   ========================================= */
const CONFIG = {
  defaultLang: "vi",
  langDir: window.location.pathname.includes("/macaron/")
    ? "../lang/"
    : "lang/",
};

const notyf = new Notyf({
  duration: 2500,
  position: { x: "center", y: "top" },
});

// Danh sách message theo ngôn ngữ
const notifyMessages = {
  vi: "Đã thay đổi ngôn ngữ sang Tiếng Việt",
  en: "Language has been changed to English",
};

/* =========================================
   1. HÀM XỬ LÝ LOGIC NGÔN NGỮ
   ========================================= */

// Hàm lấy giá trị từ JSON lồng nhau (VD: "header.menu" -> ra chữ "Menu")
function getNestedValue(obj, path) {
  return path.split(".").reduce((o, p) => (o ? o[p] : null), obj);
}

// Hàm tải và hiển thị ngôn ngữ
function loadLanguage(lang) {
  // 1. Fetch file JSON tương ứng
  fetch(`${CONFIG.langDir}${lang}.json`)
    .then((response) => {
      if (!response.ok)
        throw new Error(`Không tìm thấy file ngôn ngữ: ${lang}`);
      return response.json();
    })
    .then((data) => {
      // 2. Điền dữ liệu vào trang web
      const elements = document.querySelectorAll("[data-lang]");

      elements.forEach((el) => {
        const key = el.getAttribute("data-lang");
        const translation = getNestedValue(data, key);

        if (translation) {
          if (
            el.tagName === "INPUT" &&
            (el.type === "submit" || el.type === "button")
          ) {
            el.value = translation;

            // 2. Input/Textarea thường: gán vào placeholder
          } else if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
            el.placeholder = translation;

            // 3. Các thẻ khác: gán text
          } else if (
            el.tagName === "A" &&
            el.classList.contains("theme-btn") &&
            el.querySelectorAll("span").length === 2
          ) {
            const spans = el.querySelectorAll("span");
            el.innerHTML = `${spans[0].outerHTML}${translation}${spans[1].outerHTML}`;
          } else {
            el.innerHTML = translation;
          }
        }
      });

      // 3. Cập nhật giao diện (Cờ, Active menu...)
      updateUI(lang);

      // 4. Lưu vào bộ nhớ trình duyệt
      localStorage.setItem("selectedLang", lang);
    })
    .catch((error) => console.error("Lỗi tải ngôn ngữ:", error));
}

// Hàm cập nhật icon cờ và trạng thái active
function updateUI(lang) {
  const isEn = lang === "en";
  const flagSrc = isEn
    ? "../images/icons/uk_flag.svg"
    : "../images/icons/vi_flag.svg";
  const flagAlt = isEn ? "English" : "Vietnamese";

  // Cập nhật cả icon Desktop và Mobile
  ["flag-desktop", "flag-mobile"].forEach((id) => {
    const img = document.getElementById(id);
    if (img) {
      img.src = flagSrc;
      img.alt = flagAlt;
    }
  });

  // Đóng tất cả menu chọn ngôn ngữ đang mở
  document
    .querySelectorAll(".popover")
    .forEach((p) => p.classList.remove("show"));
}

/* =========================================
   2. HÀM XỬ LÝ SỰ KIỆN MENU (Toggle)
   ========================================= */

// Hàm đổi ngôn ngữ (Gắn vào onclick ở HTML)
function changeLang(lang) {
  loadLanguage(lang);
  notyf.success(notifyMessages[lang]);
}

// Hàm bật tắt menu chọn ngôn ngữ
function toggleLangMenu(menuId, event) {
  if (event) event.stopPropagation();

  // Đóng các menu khác
  document.querySelectorAll(".popover").forEach((p) => {
    if (p.id !== menuId) p.classList.remove("show");
  });

  // Toggle menu hiện tại
  const menu = document.getElementById(menuId);
  if (menu) menu.classList.toggle("show");
}

// Đóng menu khi click ra ngoài
window.addEventListener("click", function (event) {
  if (!event.target.closest(".icon-button")) {
    document
      .querySelectorAll(".popover")
      .forEach((p) => p.classList.remove("show"));
  }
});

//lvtien add
function activeMenu() {
  var path = location.pathname.replace(/\/+$/, "");
  if (path === "/" || path === "") {
    $("#navbarSupportedContent ul li#root").addClass("current");
    return;
  }
  var segments = path.split("/");
  var last = segments.pop() || segments.pop();
  var id = last.split(".")[0];
  var $li = $("#navbarSupportedContent ul li#" + id);
  if ($li.length) {
    $li.addClass("current");
  } else {
    $("#navbarSupportedContent ul li#root").addClass("current");
  }
}

/* =========================================
   3. KHỞI TẠO (MAIN FLOW)
   ========================================= */

document.addEventListener("DOMContentLoaded", async function () {
  // 1) Xác định đường dẫn header
  const headerPath = window.location.pathname.includes("/macaron/")
    ? "../header.html"
    : "header.html";

  try {
    // 2) Fetch header
    const response = await fetch(headerPath);
    const html = await response.text();

    // 3) Đưa vào DOM
    const headerContainer = document.getElementById("header");
    if (headerContainer) headerContainer.innerHTML = html;

    // 4) Lấy ngôn ngữ từ localStorage
    const savedLang =
      localStorage.getItem("selectedLang") || CONFIG.defaultLang;

    // 5) Load ngôn ngữ
    loadDynamicMenu();
    loadLanguage(savedLang);
    activeMenu();

    // 6) Gắn sự kiện dropdown sau khi header được render

    // 7) Cập nhật giỏ hàng sau khi header được load
    if (typeof renderCartUI === "function") {
      renderCartUI();
    }
    document.dispatchEvent(new Event("header:loaded"));
  } catch (err) {
    console.error("Lỗi fetch header:", err);
  }
});
