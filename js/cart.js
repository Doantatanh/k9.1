import store from './redux/store.js';
import { addToCart, removeFromCart } from './redux/cartSlice.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. DOM Elements
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    const cartCountTitle = document.getElementById('cart-count-title');
    const cartBadge = document.querySelector('.cart-badge');
    const emptyCartMsg = document.querySelector('.empty-cart-message');

    // 2. Hàm định dạng tiền tệ VND
    const formatVND = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            currencyDisplay: 'code' // Hiển thị mã "VND" thay vì ký hiệu "₫"
        }).format(amount);
    };

    // 3. Hàm cập nhật Giao diện (UI) từ State của Redux
    const updateCartUI = () => {
        const { items, totalAmount } = store.getState().cart;
        const totalItems = items.length;

        // Cập nhật số lượng hiển thị
        if (cartCountTitle) cartCountTitle.innerText = totalItems;
        if (cartBadge) cartBadge.innerText = totalItems;

        // Cập nhật tổng tiền
        if (cartTotalAmount) cartTotalAmount.innerText = formatVND(totalAmount);

        // Kiểm tra giỏ hàng trống và render items
        if (totalItems === 0) {
            if (emptyCartMsg) emptyCartMsg.style.display = 'block';
            cartItemsContainer.querySelectorAll('.cart-item-row').forEach(el => el.remove());
        } else {
            if (emptyCartMsg) emptyCartMsg.style.display = 'none';
            // Xóa danh sách cũ
            cartItemsContainer.querySelectorAll('.cart-item-row').forEach(el => el.remove());

            // Render từng item từ Redux State
            items.forEach(item => {
                const itemHTML = `
                    <div class="cart-item-row d-flex align-items-center gap-3 mb-4 animate-item" data-id="${item.id}">
                        <div class="item-img" style="width: 70px; height: 70px; border-radius: 12px; overflow: hidden; background: #f0f0f0;">
                            <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null;this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAiIGhlaWdodD0iNzAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjcwIiBoZWlnaHQ9IjcwIiBmaWxsPSIjZmVmZWZlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjYmJiIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMCI+SU1HIEVSUk9SPC90ZXh0Pjwvc3ZnPg=='">
                        </div>
                        <div class="item-info flex-grow-1">
                            <h6 class="mb-0 fw-bold" style="font-size: 0.95rem;">${item.title}</h6>
                            <p class="text-muted small mb-0">${item.billingText}</p>
                            <span class="fw-bold text-primary">${formatVND(item.price)}</span>
                        </div>
                        <button class="btn-remove-item border-0 bg-transparent text-muted" data-id="${item.id}">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                `;
                cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
            });

            // Gắn sự kiện xóa bằng Redux Dispatch
            document.querySelectorAll('.btn-remove-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    store.dispatch(removeFromCart(id));
                });
            });
        }
    };

    // 4. Đăng ký nhận thông báo thay đổi từ Store (Subscribe)
    store.subscribe(updateCartUI);

    // 5. Khởi tạo UI lần đầu
    updateCartUI();

    // 6. Xử lý sự kiện thêm vào giỏ hàng
    const handleAddToCart = (courseCard) => {
        const id = courseCard.getAttribute('data-id');
        const title = courseCard.getAttribute('data-name');
        const image = courseCard.getAttribute('data-img');

        const billingInput = document.querySelector('input[name="billing"]:checked');
        const cycle = billingInput ? billingInput.value : 'monthly';

        let price = 0;
        let billingText = '';

        if (cycle === 'monthly') {
            price = parseInt(courseCard.getAttribute('data-price-monthly'));
            billingText = 'Gói hàng tháng';
        } else if (cycle === 'halfyear') {
            price = parseInt(courseCard.getAttribute('data-price-halfyear'));
            billingText = 'Gói 6 tháng';
        } else {
            price = parseInt(courseCard.getAttribute('data-price-yearly'));
            billingText = 'Gói 1 năm';
        }

        // Dispatch action thêm mới hoặc cập nhật gói
        store.dispatch(addToCart({
            id, title, image, billingCycle: cycle, billingText, price, quantity: 1
        }));

        // Hiển thị Sidebar phản hồi
        const cartSidebar = document.getElementById('cartSidebar');
        if (cartSidebar) {
            const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(cartSidebar);
            bsOffcanvas.show();
        }
    };

    // 7. Lắng nghe sự kiện click "Đăng ký ngay"
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('js-add-to-cart')) {
            const card = e.target.closest('.pricing-card');
            if (card) {
                handleAddToCart(card);
            }
        }
    });
});
