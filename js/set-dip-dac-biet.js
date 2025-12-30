async function loadSetProducts() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("type"); // ví dụ: set-tet

  // Đọc file chứa toàn bộ sản phẩm & danh mục
  const res = await fetch("../JSON/products-category.json");
  const data = await res.json();

  // Tìm đúng category theo slug
  const category = data.categories.find((c) => c.slug === slug);

  // Render sản phẩm
  let html = "";
  category.products.forEach((p) => {
    const detailLink = `product-detail.html?id=${p.productId}`;
    html += `
      <div class="shop-item col-lg-4 col-md-6 col-sm-12">
                    <div class="inner-box">
                        <div class="image-box">
                            <figure class="image">
                                <a href="${detailLink}">
                                    <img src="${p.image}" alt="${p.name}">
                                </a>
                            </figure>
                        </div>
                        <div class="lower-content">
                            <h4 class="name">
                                <a href="${detailLink}">
                                    ${p.name}
                                </a>
                            </h4>
                            <div class="price">${p.basePrice.toLocaleString()} VNĐ</div>
                        </div>
                    </div>
                </div>
    `;
  });

  document.getElementById("product-list-set").innerHTML = html;
}

loadSetProducts();
