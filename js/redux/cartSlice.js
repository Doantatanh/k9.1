import { createSlice } from 'https://cdn.jsdelivr.net/npm/@reduxjs/toolkit/+esm';

// Lấy dữ liệu ban đầu từ localStorage nếu có
const savedCart = JSON.parse(localStorage.getItem('luminia_cart')) || [];

const initialState = {
    items: savedCart,
    totalAmount: savedCart.reduce((sum, item) => sum + item.price, 0),
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const newItem = action.payload;
            const existingIndex = state.items.findIndex(item => item.id === newItem.id);
            
            if (existingIndex !== -1) {
                // Nếu đã có khóa học này, cập nhật lại gói (billing) và giá (price) mới
                state.items[existingIndex] = {
                    ...state.items[existingIndex],
                    ...newItem
                };
            } else {
                // Nếu chưa có, thêm mới vào giỏ hàng
                state.items.push(newItem);
            }
            
            // Tính toán lại tổng tiền
            state.totalAmount = state.items.reduce((sum, item) => sum + item.price, 0);
        },
        removeFromCart: (state, action) => {
            const id = action.payload;
            state.items = state.items.filter(item => item.id !== id);
            state.totalAmount = state.items.reduce((sum, item) => sum + item.price, 0);
        },
        clearCart: (state) => {
            state.items = [];
            state.totalAmount = 0;
        }
    }
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
