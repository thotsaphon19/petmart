import {
  addProduct as fsAddProduct,
  updateProduct as fsUpdateProduct,
  deleteProduct as fsDeleteProduct,
  placeOrder as fsPlaceOrder,
  updateOrderStatus as fsUpdateOrderStatus,
  updateUser as fsUpdateUser,
} from './firestoreService';

export function appReducer(state, action) {
  switch (action.type) {

    // ── โหลดข้อมูลจาก Firestore ────────────────────────────────────────────
    case 'SET_DB_DATA':
      return {
        ...state,
        products: action.products,
        orders:   action.orders,
        users:    action.users,
        dbReady:  true,
      };

    // ── Auth ────────────────────────────────────────────────────────────────
    case 'LOGIN':
      return { ...state, currentUser: action.user, authView: null };
    case 'LOGOUT':
      return { ...state, currentUser: null, cart: [], view: 'shop', adminView: 'dashboard' };
    case 'REGISTER': {
      const newU = {
        ...action.user,
        id:     state.users.length + 1,
        role:   'customer',
        joined: new Date().toISOString().slice(0, 10),
        active: true,
      };
      // บันทึก Firestore (async fire-and-forget)
      import('./firestoreService').then(({ createUser }) => createUser(newU));
      return { ...state, users: [...state.users, newU], currentUser: newU, authView: null };
    }

    // ── Navigation ───────────────────────────────────────────────────────────
    case 'SET_VIEW':       return { ...state, view: action.view, selectedProduct: null };
    case 'SET_ADMIN_VIEW': return { ...state, adminView: action.view };
    case 'SET_AUTH_VIEW':  return { ...state, authView: action.view };
    case 'SELECT_PRODUCT': return { ...state, selectedProduct: action.product, view: 'product' };

    // ── Cart ─────────────────────────────────────────────────────────────────
    case 'ADD_TO_CART': {
      const exist = state.cart.find(i => i.pid === action.item.pid);
      if (exist)
        return { ...state, cart: state.cart.map(i => i.pid === action.item.pid ? { ...i, qty: i.qty + action.item.qty } : i) };
      return { ...state, cart: [...state.cart, action.item] };
    }
    case 'REMOVE_FROM_CART': return { ...state, cart: state.cart.filter(i => i.pid !== action.pid) };
    case 'UPDATE_QTY':       return { ...state, cart: state.cart.map(i => i.pid === action.pid ? { ...i, qty: action.qty } : i) };
    case 'CLEAR_CART':       return { ...state, cart: [] };

    // ── Orders ───────────────────────────────────────────────────────────────
    case 'PLACE_ORDER': {
      const newOrder = {
        ...action.order,
        id:     `ORD-${String(Date.now()).slice(-6)}`,
        userId: state.currentUser.id,
        date:   new Date().toISOString().slice(0, 10),
        status: 'pending',
      };
      // บันทึก Firestore
      fsPlaceOrder(newOrder);
      return { ...state, orders: [newOrder, ...state.orders], cart: [], view: 'orders', checkoutStep: 0 };
    }
    case 'UPDATE_ORDER_STATUS': {
      fsUpdateOrderStatus(action.id, action.status);
      return { ...state, orders: state.orders.map(o => o.id === action.id ? { ...o, status: action.status } : o) };
    }

    // ── Products (Admin) ──────────────────────────────────────────────────────
    case 'ADD_PRODUCT': {
      const newP = {
        ...action.product,
        id:      Math.max(0, ...state.products.map(p => p.id)) + 1,
        sold:    0,
        rating:  4.0,
        reviews: 0,
      };
      fsAddProduct(newP);
      return { ...state, products: [...state.products, newP] };
    }
    case 'UPDATE_PRODUCT': {
      fsUpdateProduct(action.product);
      return { ...state, products: state.products.map(p => p.id === action.product.id ? action.product : p) };
    }
    case 'DELETE_PRODUCT': {
      fsDeleteProduct(action.id);
      return { ...state, products: state.products.filter(p => p.id !== action.id) };
    }

    // ── Users (Admin) ─────────────────────────────────────────────────────────
    case 'UPDATE_USER': {
      fsUpdateUser(action.user);
      return { ...state, users: state.users.map(u => u.id === action.user.id ? action.user : u) };
    }

    // ── Misc ──────────────────────────────────────────────────────────────────
    case 'SET_CHECKOUT_STEP': return { ...state, checkoutStep: action.step };
    case 'SET_SEARCH':        return { ...state, searchQ: action.q };
    case 'SET_CAT':           return { ...state, selectedCat: action.cat };
    case 'SET_SORT':          return { ...state, sortBy: action.sort };
    case 'TOGGLE_WISHLIST': {
      const has = state.wishlist.includes(action.pid);
      return { ...state, wishlist: has ? state.wishlist.filter(id => id !== action.pid) : [...state.wishlist, action.pid] };
    }
    case 'ADD_REVIEW': {
      const ps = state.products.map(p => {
        if (p.id !== action.pid) return p;
        const newRating = ((p.rating * p.reviews) + action.rating) / (p.reviews + 1);
        const updated = { ...p, reviews: p.reviews + 1, rating: Math.round(newRating * 10) / 10 };
        fsUpdateProduct(updated);
        return updated;
      });
      return { ...state, products: ps };
    }

    default: return state;
  }
}
