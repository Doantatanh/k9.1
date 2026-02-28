async function loadSetDacBiet() {
  try {
    const config = window.API_CONFIG;
    // API URL dành cho trang chủ
    const apiUrl = config
      ? config.getUrl("CATEGORY")
      : "http://macaron.a.csoftlife.com/api/v1/CoreCategory";

    const response = await axios.get(apiUrl);
    const data = response.data;

    const menu = document.getElementById("set-dac-biet-element");
    if (!menu) return;

    menu.innerHTML = "";

    // Xử lý dữ liệu trả về từ API
    const rawItems = data.data || (Array.isArray(data) ? data : []);

    // Lấy các danh mục con của "Set bánh dịp đặc biệt" (parentId = 14)
    const menuItems = rawItems.filter((item) => item.parentId === 14);

    menuItems.forEach((item) => {
      // Mapping theo các trường mới của API CoreCategory
      const title = item.categoryName || "";
      const image =
        config.getImgUrl(item.avatar) ||
        "images/product/avatar/20201107181352.jpg";

      const link = item.coreCategoryId
        ? `set.html?categoryId=${item.coreCategoryId}`
        : "#";

      menu.innerHTML += `
                          <div class="shop-item col-lg-4 col-md-6 col-sm-12">
                              <div class="inner-box">
                                  <div class="image-box">
                                      <figure class="image">
                                          <a href="${link}">
                                              <img src="${image}"
                                                  alt="${title}">
                                          </a>
                                          &nbsp;
                                      </figure>

                                  </div>
                                  <div class="lower-content">
                                      <h4 class="name">
                                          <a href="${link}">${title}</a>
                                      </h4>
                                  </div>
                              </div>
                          </div>
`;
    });
  } catch (err) {
    console.error("Lỗi load menu từ API:", err);
  }
}

// Gọi hàm
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadSetDacBiet);
} else {
  loadSetDacBiet();
}