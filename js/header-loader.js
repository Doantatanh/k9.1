const CONFIGG = {
  menuDir: window.location.pathname.includes("/macaron/")
    ? "../JSON/menu.json"
    : "/JSON/menu.json",
};

async function loadDynamicMenu() {
  try {
    const res = await fetch(CONFIGG.menuDir);
    const menuList = await res.json();

    // Danh sách tất cả các UL menu nơi cần render
    const menuTargets = [
      "#root > ul", // Header desktop
      ".sticky-header li#root > ul", // Sticky header
      ".mobile-menu li#root > ul", // Mobile menu
    ];

    menuTargets.forEach((selector) => {
      const container = document.querySelector(selector);

      if (container) {
        container.innerHTML = menuList
          .map(
            (item) => `
              <li>
                <a href="${item.href}" data-lang="${item.lang}">
                  ${item.name}
                </a>
              </li>
            `,
          )
          .join("");
      }
    });
  } catch (err) {
    console.error("Lỗi load menu:", err);
  }
}
