function loadRelatedProducts(data, currentProduct) {
  const relatedDiv = document.getElementById("related-products");
  if (!relatedDiv || !currentProduct) return;

  // Tìm category chứa sản phẩm hiện tại
  const category = data.categories.find((cat) =>
    cat.products.some(
      (p) => String(p.productId) === String(currentProduct.productId)
    )
  );

  let related = [];

  if (category) {
    related = category.products.filter(
      (p) => String(p.productId) !== String(currentProduct.productId)
    );
  }

  // Nếu category chỉ có 1 sản phẩm → lấy ngẫu nhiên toàn bộ sản phẩm
  if (related.length < 3) {
    related = data.categories
      .flatMap((cat) => cat.products)
      .filter((p) => String(p.productId) !== String(currentProduct.productId));
  }

  shuffle(related);
  related = related.slice(0, 3);

  // Render
  relatedDiv.innerHTML = related
    .map(
      (p) => `
            <div class="shop-item col-lg-4 col-md-6 col-sm-12">
                <div class="inner-box">
                    <div class="image-box">

                        <figure class="image"><a href="product-detail.html?id=${
                          p.productId
                        }">
                                <img src="${p.image}" alt="${p.name}">
                        </figure>

                    </div>
                    <div class="lower-content">
                        <h4 class="name">

                            <a href="product-detail.html?id=${p.productId}">${
        p.name
      }</a>

                        </h4>
                        <div class="rating">
                            <span class="fa fa-star"></span>
                            <span class="fa fa-star"></span>
                            <span class="fa fa-star"></span>
                            <span class="fa fa-star"></span>
                            <span class="fa fa-star"></span>
                        </div>
                        <div class="price"><span id="product_other1_rptListData_lblPrice_0">${p.basePrice.toLocaleString()}

                                (VNĐ)</span></div>
                    </div>
                </div>
            </div>

            `
    )
    .join("");
}

// Hàm đảo ngẫu nhiên
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}
