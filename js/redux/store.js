import { configureStore } from 'https://cdn.jsdelivr.net/npm/@reduxjs/toolkit/+esm';
import cartReducer from './cartSlice.js';

const store = configureStore({
    reducer: {
        cart: cartReducer,
    },
});

// Middleware tự chế (Subscriber) để đồng bộ với localStorage mỗi khi state thay đổi
store.subscribe(() => {
    const state = store.getState();
    localStorage.setItem('luminia_cart', JSON.stringify(state.cart.items));
});

export default store;
