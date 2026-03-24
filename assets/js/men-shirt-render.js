/**=====================
    Men's Shirt Render JS (ES6+)
    Using shared utilities from product-common.js
==========================**/
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('men-shirt-row');
    const jsonPath = '../assets/data/products.json';
    const targetCategory = "Áo sơ mi nam";

    let allProducts = [];

    const loadProducts = async () => {
        try {
            const response = await fetch(jsonPath);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            allProducts = await response.json();

            // Lọc các sản phẩm có category chứa targetCategory
            const baseProducts = allProducts.filter(p =>
                Array.isArray(p.category) ? p.category.includes(targetCategory) : p.category === targetCategory
            );

            // Khởi tạo bộ lọc ban đầu
            applyFilters(baseProducts);
            bindFilterEvents(baseProducts);
        } catch (error) {
            console.error("Lỗi khi tải JSON sản phẩm:", error);
        }
    };

    const bindFilterEvents = (baseProducts) => {
        // Lắng nghe tất cả checkbox trong sidebar
        const checkboxes = document.querySelectorAll('.category-list input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.addEventListener('change', () => applyFilters(baseProducts));
        });

        // Lắng nghe ô tìm kiếm
        const searchInput = document.getElementById('search');
        if (searchInput) {
            searchInput.addEventListener('input', () => applyFilters(baseProducts));
        }

        // Lắng nghe nút Xóa tất cả
        const clearBtn = document.getElementById('clear-filters');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                checkboxes.forEach(cb => cb.checked = false);
                if (searchInput) searchInput.value = '';
                // Check các nút 'Tất cả'
                ['sh-all', 'sz-all', 'form-all', 'all-condition', 'price-all', 'discount-all'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.checked = true;
                });
                applyFilters(baseProducts);
            });
        }

        // Lắng nghe dropdown sắp xếp
        const sortItems = document.querySelectorAll('.top-filter-menu .dropdown-menu .dropdown-item');
        sortItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const sortType = item.id; // pop, low, high, off
                const sortText = item.innerText;

                // Cập nhật UI dropdown
                const btn = document.getElementById('dropdownMenuButton1');
                if (btn) btn.querySelector('span').innerText = sortText;

                // Lưu sortType vào biến local để applyFilters chung
                container.dataset.currentSort = sortType;
                applyFilters(baseProducts, sortType);
            });
        });
    };

    const applyFilters = (baseProducts, sortType = null) => {
        let filtered = [...baseProducts];
        const sType = sortType || container.dataset.currentSort || 'pop';

        const checkboxes = Array.from(document.querySelectorAll('.category-list input[type="checkbox"]:checked'));
        const searchQuery = document.getElementById('search')?.value.toLowerCase().trim();

        // Hiển thị/Ẩn nút Xóa tất cả
        const hasActiveFilters = checkboxes.length > 0 || searchQuery;
        const clearBtn = document.getElementById('clear-filters');
        if (clearBtn) clearBtn.style.display = hasActiveFilters ? 'inline-block' : 'none';

        // 0. Lọc theo Tìm kiếm (Search)
        if (searchQuery) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchQuery) ||
                (p.subCategory && p.subCategory.some(sc => sc.toLowerCase().includes(searchQuery)))
            );
        }

        // 0.1 Lọc theo Loại áo (Sub-category - Shirt Type)
        const activeTypeFilters = Array.from(document.querySelectorAll('.category-list input[id^="sh-"]:checked'))
            .map(cb => cb.nextElementSibling.innerText.trim());
        if (activeTypeFilters.length > 0 && !document.getElementById('sh-all').checked) {
            filtered = filtered.filter(p => p.subCategory && p.subCategory.some(sc => activeTypeFilters.includes(sc)));
        }

        // 0.2 Lọc theo Form áo
        const activeFormFilters = Array.from(document.querySelectorAll('.category-list input[id^="form-"]:checked'))
            .map(cb => cb.nextElementSibling.innerText.trim());
        if (activeFormFilters.length > 0 && !document.getElementById('form-all').checked) {
            filtered = filtered.filter(p => p.form && p.form.some(f => activeFormFilters.includes(f)));
        }

        // 1. Lọc theo Giá (Price Range)
        const activePriceFilters = Array.from(document.querySelectorAll('.category-list input[id^="price-"]:checked')).map(cb => cb.id);
        if (activePriceFilters.length > 0 && !activePriceFilters.includes('price-all')) {
            filtered = filtered.filter(p => {
                return activePriceFilters.some(id => {
                    if (id === 'price-1') return p.price < 1000000;
                    if (id === 'price-2') return p.price >= 1000000 && p.price < 2000000;
                    if (id === 'price-3') return p.price >= 2000000 && p.price < 3000000;
                    if (id === 'price-4') return p.price >= 3000000 && p.price < 4000000;
                    if (id === 'price-5') return p.price >= 4000000 && p.price < 5000000;
                    if (id === 'price-6') return p.price >= 5000000;
                    return false;
                });
            });
        }

        // 2. Lọc theo Kích thước (Size)
        const activeSizeFilters = Array.from(document.querySelectorAll('.category-list input[id^="sz-"]:checked')).map(cb => cb.id.replace('sz-', '').toUpperCase());
        if (activeSizeFilters.length > 0) {
            filtered = filtered.filter(p => p.size && p.size.some(s => activeSizeFilters.includes(s.toUpperCase())));
        }

        // 3. Lọc theo Màu sắc (Color)
        const activeColorFilters = Array.from(document.querySelectorAll('.category-list input[id^="color-"]:checked')).map(cb => cb.id.replace('color-', ''));
        if (activeColorFilters.length > 0 && !activeColorFilters.includes('all')) {
            filtered = filtered.filter(p => p.color && p.color.some(c => activeColorFilters.includes(c.toLowerCase())));
        }

        // 4. Lọc theo Tình trạng (Condition)
        const activeCondFilters = Array.from(document.querySelectorAll('.category-list input[id^="cond-"]:checked')).map(cb => cb.id);
        if (activeCondFilters.length > 0 && !activeCondFilters.includes('all-condition')) {
            filtered = filtered.filter(p => {
                return activeCondFilters.some(id => {
                    if (id === 'cond-10') return p.condition === 10;
                    if (id === 'cond-95') return p.condition === 9.5;
                    if (id === 'cond-9') return p.condition === 9;
                    if (id === 'cond-8') return p.condition === 8;
                    if (id === 'cond-7') return p.condition === 7;
                    if (id === 'cond-6') return p.condition === 6;
                    if (id === 'cond-under-6') return p.condition < 6;
                    return false;
                });
            });
        }

        // 5. Lọc theo Giảm giá (Discount)
        const activeDiscFilters = Array.from(document.querySelectorAll('.category-list input[id^="discount-"]:checked')).map(cb => cb.id);
        if (activeDiscFilters.length > 0 && !activeDiscFilters.includes('discount-all')) {
            filtered = filtered.filter(p => {
                const discount = p.originalPrice ? ((p.originalPrice - p.price) / p.originalPrice * 100) : 0;
                return activeDiscFilters.some(id => {
                    if (id === 'discount-none') return discount === 0;
                    if (id === 'discount-5-10') return discount >= 5 && discount <= 10;
                    if (id === 'discount-10-15') return discount > 10 && discount <= 15;
                    if (id === 'discount-15-20') return discount > 15 && discount <= 20;
                    if (id === 'discount-over-20') return discount > 20;
                    return false;
                });
            });
        }

        // 6. Sắp xếp (Sort)
        if (sType === 'low') filtered.sort((a, b) => a.price - b.price);
        if (sType === 'high') filtered.sort((a, b) => b.price - a.price);
        if (sType === 'off') {
            filtered.sort((a, b) => {
                const discA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
                const discB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
                return discB - discA;
            });
        }
        // 'pop' - Giữ nguyên thứ tự JSON hoặc logic phổ biến (ở đây là mặc định)

        renderProducts(filtered, container);
    };

    const generateProductHTML = (product, index, containerId) => {
        const delay = (index * 0.05).toFixed(2);
        let discountHTML = '';
        if (product.originalPrice && product.originalPrice > product.price) {
            const percent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
            discountHTML = `
                <div class="label-flex">
                    <div class="discount">
                        <label>${percent}%</label>
                    </div>
                </div>`;
        }

        const categoryText = Array.isArray(product.category) ? product.category.join(', ') : product.category;

        return `
            <div class="col wow fadeInUp" data-wow-delay="${delay}s">
                <div class="product-box-4 h-100">
                    ${discountHTML}
                    <div class="product-image">
                        <a href="product-left-thumbnail.html">
                            <img src="${product.image}" class="img-fluid" alt="${product.name}">
                        </a>

                        <ul class="option">
                            <li data-bs-toggle="tooltip" data-bs-placement="top" title="Xem nhanh">
                                <a href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#view">
                                    <i class="fa-regular fa-eye"></i>
                                </a>
                            </li>

                            <li data-bs-toggle="tooltip" data-bs-placement="top" title="Yêu thích">
                                <a href="javascript:void(0)" class="notifi-wishlist wishlist-btn" data-id="${product.id}">
                                    <i class="fa-regular fa-heart"></i>
                                </a>
                            </li>

                            <li data-bs-toggle="tooltip" data-bs-placement="top" title="So sánh">
                                <a href="compare.html">
                                    <i class="fa-solid fa-right-left"></i>
                                </a>
                            </li>
                        </ul>

                        <a href="javascript:void(0)" class="add-to-cart-btn btn-cart-dynamic" data-id="${product.id}">
                            <i class="fa-solid fa-cart-plus"></i> Thêm vào giỏ hàng
                        </a>
                    </div>

                    <div class="product-footer">
                        <div class="product-detail">
                            <span class="span-name-tag">${categoryText}</span>
                            <a href="product-detail.html">
                                <h5 class="name">${product.name}</h5>
                            </a>

                            <h5 class="price theme-color">
                                <strong>${window.formatCurrency(product.price)}</strong>
                                ${product.originalPrice ? `<del>${window.formatCurrency(product.originalPrice)}</del>` : ''}
                            </h5>
                        </div>
                    </div>
                </div>
            </div>`;
    };

    const renderProducts = (products, container) => {
        if (!container) return;

        if (products.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5 no-product-found">
                    <i class="fa-solid fa-box-open fa-3x mb-3 text-muted"></i>
                    <p>Không có sản phẩm nào trong mục này.</p>
                </div>`;
            return;
        }

        container.innerHTML = products.map((product, index) =>
            generateProductHTML(product, index, container.id)
        ).join('');

        if (typeof WOW !== 'undefined') new WOW().init();
        if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
            document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));
        }

        if (window.cartStore) {
            const wishlistItems = window.cartStore.getState().wishlist.items;
            window.updateWishlistIcons(wishlistItems.map(item => item.id));
        }
    };

    const handleProductAction = (e) => {
        const cartBtn = e.target.closest('.btn-cart-dynamic');
        const wishlistBtn = e.target.closest('.wishlist-btn');

        if (cartBtn) {
            e.preventDefault();
            const id = parseInt(cartBtn.dataset.id);
            const product = allProducts.find(p => p.id === id);
            if (product && window.dispatchAddToCart) {
                window.dispatchAddToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image
                });
                window.showToast(`Đã thêm "${product.name}" vào giỏ hàng!`);
            }
            return;
        }

        if (wishlistBtn) {
            e.preventDefault();
            const id = parseInt(wishlistBtn.dataset.id);
            const product = allProducts.find(p => p.id === id);
            if (product && window.dispatchToggleWishlist) {
                const isAdding = !window.cartStore.getState().wishlist.items.some(item => item.id === product.id);
                window.dispatchToggleWishlist(product);
                window.showToast(isAdding ? "Đã thêm vào yêu thích!" : "Đã xóa khỏi yêu thích!");
            }
            return;
        }
    };

    if (container) container.addEventListener('click', handleProductAction);

    loadProducts();
});
