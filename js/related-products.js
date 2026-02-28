async function loadRelatedProducts(currentProduct) {
  const relatedDiv = document.getElementById("related-products");
  if (!relatedDiv) return;

  const config = window.API_CONFIG;
  try {
    // Lấy danh sách sản phẩm ngẫu nhiên (ví dụ 20 sản phẩm đầu tiên của domain)
    // Không truyền categoryId để lấy đa dạng các loại
    const apiUrl = config
      ? `${config.getUrl("PRODUCT_LIST")}?domainId=1&pageIndex=1&pageSize=20`
      : "http://macaron.a.csoftlife.com/api/v1/CoreProduct/list?domainId=1&pageIndex=1&pageSize=20";

    const response = await axios.get(apiUrl);
    const result = response.data;
    const products = result.data || (Array.isArray(result) ? result : []);

    // Lọc bỏ sản phẩm hiện tại đang xem
    let related = products.filter(
      (p) =>
        !currentProduct ||
        String(p.coreProductId) !== String(currentProduct.coreProductId),
    );

    // Đảo ngẫu nhiên và lấy 3 cái
    shuffle(related);
    related = related.slice(0, 3);

    // Render HTML
    relatedDiv.innerHTML = related
      .map((p) => {
        const productId = p.coreProductId;
        const name = p.productName || "";
        const image = config
          ? config.getImgUrl(p.avatar)
          : p.avatar
            ? `http://macaron.a.csoftlife.com/data/upload/${p.avatar}`
            : "../images/resource/products/1.jpg";
        const price = p.basePrice || 0;
        const detailLink = `product-detail.html?id=${productId}`;

        return `
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
                            <a href="${detailLink}">${name}</a>
                        </h4>
                        <div class="rating">
                            <span class="fa fa-star"></span>
                            <span class="fa fa-star"></span>
                            <span class="fa fa-star"></span>
                            <span class="fa fa-star"></span>
                            <span class="fa fa-star"></span>
                        </div>
                        <div class="price">
                          <span>${price.toLocaleString()} VNĐ</span>
                        </div>
                    </div>
                </div>
            </div>
            `;
      })
      .join("");
  } catch (err) {
    console.error("Lỗi load sản phẩm liên quan:", err);
  }
}

// Hàm đảo ngẫu nhiên
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}
