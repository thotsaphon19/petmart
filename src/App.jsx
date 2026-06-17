import { useApp } from './context';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import WishlistPage from './pages/WishlistPage';
import AccountPage from './pages/AccountPage';
import AdminLayout from './admin/AdminLayout';

function RouterView() {
  const { state, dispatch } = useApp();
  const { view, currentUser } = state;
  const isAdmin = currentUser?.role === 'admin';

  if (isAdmin) return <AdminLayout />;

  if (view === 'product' && state.selectedProduct) return <ProductDetailPage />;
  if (view === 'cart') return <CartPage />;
  if (view === 'checkout') return currentUser ? <CheckoutPage /> : (dispatch({ type: 'SET_AUTH_VIEW', view: 'login' }), <ShopPage />);
  if (view === 'orders') return currentUser ? <OrdersPage /> : (dispatch({ type: 'SET_AUTH_VIEW', view: 'login' }), <ShopPage />);
  if (view === 'wishlist') return <WishlistPage />;
  if (view === 'account') return currentUser ? <AccountPage /> : (dispatch({ type: 'SET_AUTH_VIEW', view: 'login' }), <ShopPage />);
  return <ShopPage />;
}

export default function App() {
  const { state } = useApp();
  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      <Navbar />
      <main>
        <RouterView />
      </main>
      {state.authView && <AuthModal />}
    </div>
  );
}
