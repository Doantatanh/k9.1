async function loadBanhSinhNhat() {
  try {
    const config = window.API_CONFIG;
    const apiUrl =
      "http://macaron.a.csoftlife.com/api/v1/CoreProduct/list?categoryId=3&domainId=1&pageIndex=1&pageSize=20";

    const response = await axios.get(apiUrl);
    const result = response.data;

    if (!result.success) {
      console.error("API trả về lỗi hoặc không thành công");
      return;
    }

    const products = result.data || [];

    // Render danh sách sản phẩm
    const list = document.getElementById("product-list");
    if (!list) return;
    list.innerHTML = "";

    if (products.length === 0) {
      list.innerHTML = `
        <div class="col-12 text-center py-5">
            <h3 style="color: #666;">Hiện tại chưa có sản phẩm nào trong danh mục này.</h3>
            <p>Vui lòng quay lại sau hoặc tham khảo các danh mục khác!</p>
        </div>
      `;
      return;
    }

    products.forEach((p) => {
      const productId = p.coreProductId;
      const name = p.productName || "";
      const image = p.avatar
        ? config
          ? config.getImgUrl(p.avatar)
          : `http://macaron.a.csoftlife.com/data/upload/${p.avatar}`
        : "../images/product/avatar/20201107180549.jpg";
      const price = p.basePrice || 0;

      const detailLink = `product-detail.html?id=${productId}`;

      list.innerHTML += `
                <div class="shop-item col-lg-4 col-md-6 col-sm-12">
                    <div class="inner-box">
                        <div class="image-box">
                            <figure class="image">
                                <a href="${detailLink}">
                                    <img src="${image}" alt="${name}">
                                </a>
                            </figure>
                        </div>
                        <div class="lower-content">
                            <h4 class="name">
                                <a href="${detailLink}">
                                    ${name}
                                </a>
                            </h4>
                            <div class="price">${price.toLocaleString()} VNĐ</div>
                        </div>
                    </div>
                </div>
            `;
    });
  } catch (err) {
    console.error("Lỗi load Bánh Sinh Nhật từ API:", err);
  }
}

// Gọi hàm khi trang đã tải xong
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadBanhSinhNhat);
} else {
  loadBanhSinhNhat();
}
