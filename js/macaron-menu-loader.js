async function loadMacaronMenu() {
  try {
    const apiUrl = "http://macaron.a.csoftlife.com/api/v1/CoreCategory";

    const response = await axios.get(apiUrl);
    const data = response.data;

    const menu = document.getElementById("macaron-element");
    if (!menu) return;

    menu.innerHTML = "";

    // Xử lý dữ liệu trả về từ API (hỗ trợ cả format cũ và format mảng trực tiếp)
    // Xử lý dữ liệu trả về từ API
    const menuItems = data.data || (Array.isArray(data) ? data : []);

    menuItems.forEach((item) => {
      // Mapping theo các trường mới của API CoreCategory
      const title = item.categoryName || "";
      const image =
        item.avatar || "../images/product/avatar/20201107181352.jpg";
      const link = item.categoryAlias ? `${item.categoryAlias}.html` : "#";

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

// Gọi hàm load menu khi trang đã tải xong
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadMacaronMenu);
} else {
  loadMacaronMenu();
}
