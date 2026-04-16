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
        return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
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

    // 3.1. Hàm cập nhật giao diện Checkout
    let appliedDiscount = 0;
    const checkoutItemsList = document.getElementById('checkout-items-list');
    const checkoutSubtotal = document.getElementById('checkout-subtotal');
    const checkoutDiscount = document.getElementById('checkout-discount');
    const checkoutTotal = document.getElementById('checkout-total');
    const voucherInput = document.getElementById('voucher-input');
    const applyVoucherBtn = document.getElementById('apply-voucher-btn');
    const voucherMessage = document.getElementById('voucher-message');

    const updateCheckoutUI = () => {
        if (!checkoutItemsList) return;

        const { items, totalAmount } = store.getState().cart;
        
        // Render danh sách khóa học
        checkoutItemsList.innerHTML = '';
        items.forEach(item => {
            const itemHTML = `
                <div class="d-flex align-items-center gap-3 mb-3 animate-item">
                    <div class="course-img rounded-3 bg-primary text-white d-flex align-items-center justify-content-center"
                        style="width: 60px; height: 60px; flex-shrink: 0; overflow: hidden;">
                        <img src="${item.image}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div class="course-info flex-grow-1">
                        <h6 class="fw-bold mb-0 small">${item.title}</h6>
                        <span class="text-muted x-small">${item.billingText}</span>
                    </div>
                    <div class="course-price fw-bold text-dark">${formatVND(item.price)}</div>
                </div>
            `;
            checkoutItemsList.insertAdjacentHTML('beforeend', itemHTML);
        });

        // Cập nhật giá tiền
        const finalTotal = totalAmount - appliedDiscount;
        if (checkoutSubtotal) checkoutSubtotal.innerText = formatVND(totalAmount);
        if (checkoutDiscount) checkoutDiscount.innerText = `- ${formatVND(appliedDiscount)}`;
        if (checkoutTotal) checkoutTotal.innerText = formatVND(finalTotal > 0 ? finalTotal : 0);
    };

    // Xử lý Voucher
    if (applyVoucherBtn) {
        applyVoucherBtn.addEventListener('click', () => {
            const code = voucherInput.value.trim().toUpperCase();
            if (code === 'LUMINIA2024') {
                appliedDiscount = 100000;
                if (voucherMessage) {
                    voucherMessage.classList.remove('d-none');
                    voucherMessage.innerHTML = `<i class="fa-solid fa-circle-check me-1"></i> Đã áp dụng mã LUMINIA2024 (-100k)`;
                }
                updateCheckoutUI();
            } else {
                alert('Mã giảm giá không hợp lệ!');
            }
        });
    }

    // Xử lý nút Tiếp tục thanh toán (Chuyển trang & Lưu đơn hàng)
    const checkoutSubmitBtn = document.getElementById('checkout-submit-btn');
    if (checkoutSubmitBtn) {
        checkoutSubmitBtn.addEventListener('click', () => {
            const { items, totalAmount } = store.getState().cart;
            
            if (items.length === 0) {
                alert('Giỏ hàng của bạn đang trống!');
                return;
            }

            // Tạo mã đơn hàng ngẫu nhiên
            const orderId = 'LMN' + Math.floor(100000 + Math.random() * 900000);
            const finalTotal = totalAmount - appliedDiscount;
            
            // Lấy phương thức thanh toán đã chọn
            const paymentMethod = document.querySelector('input[name="payment"]:checked')?.id || 'pay-bank';

            // Lưu vào localStorage
            const orderData = {
                orderId: orderId,
                total: finalTotal,
                items: items,
                paymentMethod: paymentMethod // 'pay-bank' hoặc 'pay-momo'
            };
            localStorage.setItem('lastOrder', JSON.stringify(orderData));

            // Chuyển hướng
            window.location.href = 'confirm.html';
        });
    }

    // 4. Đăng ký nhận thông báo thay đổi từ Store (Subscribe)
    store.subscribe(() => {
        updateCartUI();
        updateCheckoutUI();
    });

    // 5. Khởi tạo UI lần đầu
    updateCartUI();
    updateCheckoutUI();

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
