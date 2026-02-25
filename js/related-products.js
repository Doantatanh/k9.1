function loadRelatedProducts(products, currentProduct) {
  const relatedDiv = document.getElementById("related-products");
  if (!relatedDiv || !currentProduct || !products) return;

  const config = window.API_CONFIG;

  // Lọc bỏ sản phẩm hiện tại
  let related = products.filter(
    (p) => String(p.coreProductId) !== String(currentProduct.coreProductId),
  );

  shuffle(related);
  related = related.slice(0, 3);

  // Render
  relatedDiv.innerHTML = related
    .map((p) => {
      const productId = p.coreProductId;
      const name = p.productName || "";
      const image = config
        ? config.getImgUrl(p.avatar)
        : p.avatar
          ? `http://macaron.a.csoftlife.com${p.avatar}`
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
}

// Hàm đảo ngẫu nhiên
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}
