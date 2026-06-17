import { createContext, useContext, useReducer } from 'react';
import { appReducer } from './store';
import { INIT_PRODUCTS, INIT_ORDERS, INIT_USERS } from './data';

export const AppCtx = createContext(null);
export const useApp = () => useContext(AppCtx);

const INIT_STATE = {
  currentUser: null,
  view: 'shop',
  adminView: 'dashboard',
  authView: null,
  products: INIT_PRODUCTS,
  orders: INIT_ORDERS,
  users: INIT_USERS,
  cart: [],
  wishlist: [],
  checkoutStep: 0,
  selectedProduct: null,
  searchQ: '',
  selectedCat: 'all',
  sortBy: 'popular',
};

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, INIT_STATE);
  return <AppCtx.Provider value={{ state, dispatch }}>{children}</AppCtx.Provider>;
}
