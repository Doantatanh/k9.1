// ===============================
// 1. ACTION TYPES
// ===============================
const CART_ACTIONS = {
  ADD_ITEM: "ADD_ITEM",
  REMOVE_ITEM: "REMOVE_ITEM",
  UPDATE_QUANTITY: "UPDATE_QUANTITY",
  CLEAR_CART: "CLEAR_CART",
  LOAD_CART: "LOAD_CART",
};

// ===============================
// 2. ACTION CREATORS
// ===============================
const CartActions = {
  addToCart: (cartItem) => ({
    type: CART_ACTIONS.ADD_ITEM,
    payload: {
      ...cartItem,
      uniqueId: cartItem.variantId
        ? `${cartItem.productId}_${cartItem.variantId}`
        : String(cartItem.productId),
    },
  }),

  loadCart: (cartItems) => ({
    type: CART_ACTIONS.LOAD_CART,
    payload: cartItems,
  }),

  updateQuantity: (productId, quantity) => ({
    type: CART_ACTIONS.UPDATE_QUANTITY,
    payload: { id: productId, quantity: parseInt(quantity) },
  }),

  removeFromCart: (productId) => ({
    type: CART_ACTIONS.REMOVE_ITEM,
    payload: { id: productId },
  }),

  clearCart: () => ({
    type: CART_ACTIONS.CLEAR_CART,
  }),
};

// ===============================
// 3. REDUCER
// ===============================
function cartReducer(state = [], action) {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const uniqueId = action.payload.uniqueId;
      const existingItem = state.find(
        (item) => (item.uniqueId || item.id) === uniqueId
      );

      if (existingItem) {
        return state.map((item) =>
          (item.uniqueId || item.id) === uniqueId
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      }

      return [...state, action.payload];
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { id, quantity } = action.payload;
      return state.map((item) =>
        String(item.uniqueId || item.id) === String(id)
          ? { ...item, quantity }
          : item
      );
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      const targetId = String(action.payload.id);

      return state.filter((item) => {
        const itemId = String(item.uniqueId || item.id);
        return itemId !== targetId;
      });
    }

    case CART_ACTIONS.LOAD_CART:
      return action.payload || [];

    case CART_ACTIONS.CLEAR_CART:
      return [];

    default:
      return state;
  }
}

// ===============================
// 4. STORE
// ===============================
class ReduxStore {
  constructor(reducer, initialState = []) {
    this.reducer = reducer;
    this.state = initialState;
    this.listeners = [];

    this.loadFromLocalStorage();
  }

  getState() {
    return this.state;
  }

  dispatch(action) {
    this.state = this.reducer(this.state, action);
    this.saveToLocalStorage();

    this.listeners.forEach((l) => l());
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  saveToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(this.state));
  }

  loadFromLocalStorage() {
    const saved = localStorage.getItem("cart");
    if (saved) {
      const items = JSON.parse(saved);
      this.state = this.reducer(this.state, CartActions.loadCart(items));
    }
  }
}

// ===============================
// 5. PUBLIC STORE
// ===============================
window.CartStore = new ReduxStore(cartReducer, []);
window.CartActions = CartActions;

window.CartSelectors = {
  getCartItems: (state) => state,
  getCartItemCount: (state) => state.reduce((c, i) => c + i.quantity, 0),
  getCartTotal: (state) => state.reduce((t, i) => t + i.price * i.quantity, 0),
};

// ===============================
// 6. SYNC UI (update header cart count)
// ===============================
(function syncCartCount() {
  function updateCount() {
    const els = document.querySelectorAll(".count");
    const state = window.CartStore.getState();
    const count = window.CartSelectors.getCartItemCount(state) || 0;
    if (!els.length) return;
    els.forEach((el) => (el.textContent = count));
  }

  // Update now if DOM ready, otherwise update on DOMContentLoaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateCount);
  } else {
    updateCount();
  }

  // Subscribe to store changes
  window.CartStore.subscribe(updateCount);

  // When storage changes in other tabs, try to resync the store
  window.addEventListener("storage", (e) => {
    if (e.key === "cart") {
      try {
        const items = e.newValue ? JSON.parse(e.newValue) : [];
        window.CartStore.dispatch(CartActions.loadCart(items));
      } catch (err) {
        updateCount();
      }
    }
  });

  // When page is restored from bfcache or becomes visible again
  window.addEventListener("pageshow", updateCount);
  window.addEventListener("focus", updateCount);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") updateCount();
  });

  // If header elements are added later (mobile header creation), observe DOM for .count nodes
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.addedNodes && m.addedNodes.length) {
        for (const node of m.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          if (node.matches && node.matches(".count")) return updateCount();
          if (node.querySelector && node.querySelector(".count"))
            return updateCount();
        }
      }
    }
  });

  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }
})();
