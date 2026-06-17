import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { appReducer } from './store';
import { INIT_PRODUCTS, INIT_ORDERS, INIT_USERS } from './data';
import {
  getProducts, getOrders, getUsers,
  seedDatabase,
} from './firestoreService';

export const AppCtx = createContext(null);
export const useApp = () => useContext(AppCtx);

const INIT_STATE = {
  currentUser:   null,
  view:          'shop',
  adminView:     'dashboard',
  authView:      null,
  products:      [],       // โหลดจาก Firestore
  orders:        [],       // โหลดจาก Firestore
  users:         [],       // โหลดจาก Firestore
  cart:          [],
  wishlist:      [],
  checkoutStep:  0,
  selectedProduct: null,
  searchQ:       '',
  selectedCat:   'all',
  sortBy:        'popular',
  dbReady:       false,    // true เมื่อ Firestore โหลดเสร็จ
};

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, INIT_STATE);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        // 1. seed ข้อมูลตั้งต้นถ้ายังว่างอยู่
        await seedDatabase(INIT_PRODUCTS, INIT_ORDERS, INIT_USERS);

        // 2. ดึงข้อมูลจาก Firestore
        const [products, orders, users] = await Promise.all([
          getProducts(),
          getOrders(),
          getUsers(),
        ]);

        dispatch({ type: 'SET_DB_DATA', products, orders, users });
      } catch (err) {
        console.error('Firestore init error:', err);
        // fallback → ใช้ข้อมูลใน data.js แทน
        dispatch({
          type: 'SET_DB_DATA',
          products: INIT_PRODUCTS,
          orders:   INIT_ORDERS,
          users:    INIT_USERS,
        });
        setDbError(err.message);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: '#fff9f6', gap: 16,
      }}>
        <div style={{ fontSize: 56 }}>🐾</div>
        <p style={{ fontSize: 18, fontWeight: 700, color: '#ff6b35' }}>PetMart กำลังโหลด...</p>
        <p style={{ fontSize: 13, color: '#94a3b8' }}>กำลังเชื่อมต่อ Firebase Firestore</p>
        <div style={{
          width: 200, height: 6, background: '#f0f0f0', borderRadius: 99, overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', borderRadius: 99, background: '#ff6b35',
            animation: 'loading-bar 1.2s ease-in-out infinite',
            width: '60%',
          }} />
        </div>
        <style>{`@keyframes loading-bar {
          0%   { transform: translateX(-100%); }
          50%  { transform: translateX(100%); }
          100% { transform: translateX(200%); }
        }`}</style>
      </div>
    );
  }

  return (
    <AppCtx.Provider value={{ state, dispatch, dbError }}>
      {dbError && (
        <div style={{
          background: '#fef3cd', borderBottom: '2px solid #f59e0b',
          padding: '8px 16px', fontSize: 13, color: '#92400e', textAlign: 'center',
        }}>
          ⚠️ ไม่สามารถเชื่อมต่อ Firebase ได้ — กำลังใช้ข้อมูลสำรอง ({dbError})
        </div>
      )}
      {children}
    </AppCtx.Provider>
  );
}
