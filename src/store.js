export function appReducer(state, action) {
  switch (action.type) {
    case 'LOGIN': return { ...state, currentUser: action.user, authView: null };
    case 'LOGOUT': return { ...state, currentUser: null, cart: [], view: 'shop', adminView: 'dashboard' };
    case 'SET_VIEW': return { ...state, view: action.view, selectedProduct: null };
    case 'SET_ADMIN_VIEW': return { ...state, adminView: action.view };
    case 'SET_AUTH_VIEW': return { ...state, authView: action.view };
    case 'SELECT_PRODUCT': return { ...state, selectedProduct: action.product, view: 'product' };
    case 'ADD_TO_CART': {
      const exist = state.cart.find(i => i.pid === action.item.pid);
      if (exist) return { ...state, cart: state.cart.map(i => i.pid === action.item.pid ? { ...i, qty: i.qty + action.item.qty } : i) };
      return { ...state, cart: [...state.cart, action.item] };
    }
    case 'REMOVE_FROM_CART': return { ...state, cart: state.cart.filter(i => i.pid !== action.pid) };
    case 'UPDATE_QTY': return { ...state, cart: state.cart.map(i => i.pid === action.pid ? { ...i, qty: action.qty } : i) };
    case 'CLEAR_CART': return { ...state, cart: [] };
    case 'PLACE_ORDER': {
      const newOrder = {
        ...action.order,
        id: `ORD-${String(state.orders.length + 1).padStart(3, '0')}`,
        userId: state.currentUser.id,
        date: new Date().toISOString().slice(0, 10),
        status: 'pending',
      };
      return { ...state, orders: [newOrder, ...state.orders], cart: [], view: 'orders', checkoutStep: 0 };
    }
    case 'UPDATE_ORDER_STATUS': return { ...state, orders: state.orders.map(o => o.id === action.id ? { ...o, status: action.status } : o) };
    case 'ADD_PRODUCT': return { ...state, products: [...state.products, { ...action.product, id: Math.max(...state.products.map(p => p.id)) + 1, sold: 0, rating: 4.0, reviews: 0 }] };
    case 'UPDATE_PRODUCT': return { ...state, products: state.products.map(p => p.id === action.product.id ? action.product : p) };
    case 'DELETE_PRODUCT': return { ...state, products: state.products.filter(p => p.id !== action.id) };
    case 'UPDATE_USER': return { ...state, users: state.users.map(u => u.id === action.user.id ? action.user : u) };
    case 'SET_CHECKOUT_STEP': return { ...state, checkoutStep: action.step };
    case 'SET_SEARCH': return { ...state, searchQ: action.q };
    case 'SET_CAT': return { ...state, selectedCat: action.cat };
    case 'SET_SORT': return { ...state, sortBy: action.sort };
    case 'TOGGLE_WISHLIST': {
      const has = state.wishlist.includes(action.pid);
      return { ...state, wishlist: has ? state.wishlist.filter(id => id !== action.pid) : [...state.wishlist, action.pid] };
    }
    case 'ADD_REVIEW': {
      const ps = state.products.map(p => {
        if (p.id !== action.pid) return p;
        const newRating = ((p.rating * p.reviews) + action.rating) / (p.reviews + 1);
        return { ...p, reviews: p.reviews + 1, rating: Math.round(newRating * 10) / 10 };
      });
      return { ...state, products: ps };
    }
    case 'REGISTER': {
      const newU = { ...action.user, id: state.users.length + 1, role: 'customer', joined: new Date().toISOString().slice(0, 10), active: true };
      return { ...state, users: [...state.users, newU], currentUser: newU, authView: null };
    }
    default: return state;
  }
}
