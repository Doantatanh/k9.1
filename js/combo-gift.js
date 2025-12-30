async function loadComboQuaTang() {
  try {
    const res = await fetch("../JSON/products-category.json");
    const data = await res.json();

    // 🔍 Tìm đúng category
    const category = data.categories.find(
      (c) => c.category === "Combo Quà Tặng"
    );

    if (!category) {
      console.error("Không tìm thấy category 'Combo Quà Tặng'");
      return;
    }

    // Set tiêu đề
    // document.getElementById("category-title").textContent = category.category;

    // Render danh sách sản phẩm
    const list = document.getElementById("product-list");
    list.innerHTML = "";

    category.products.forEach((p) => {
      const detailLink = `product-detail.html?id=${p.productId}`;
      list.innerHTML += `
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
  } catch (err) {
    console.error("Lỗi load category JSON:", err);
  }
}

// Gọi hàm
loadComboQuaTang();
