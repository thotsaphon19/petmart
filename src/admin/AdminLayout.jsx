import { useState } from 'react';
import { useApp } from '../context';
import AdminDashboard from './AdminDashboard';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminCustomers from './AdminCustomers';
import AdminAnalytics from './AdminAnalytics';

const MENU = [
  ['dashboard', '📊', 'ภาพรวม'],
  ['products', '📦', 'สินค้า'],
  ['orders', '🧾', 'คำสั่งซื้อ'],
  ['customers', '👥', 'ลูกค้า'],
  ['analytics', '📈', 'วิเคราะห์'],
];

export default function AdminLayout() {
  const { state, dispatch } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const av = state.adminView;

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)', position: 'relative' }}>
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 199, top: 64 }} />}

      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`} style={{ boxShadow: '2px 0 12px rgba(0,0,0,.06)' }}>
        <div style={{ padding: '0.75rem 1.25rem 1rem', borderBottom: '1px solid #f0f0f0', marginBottom: '0.5rem' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1.5 }}>Admin Panel</p>
        </div>
        {MENU.map(([k, ic, l]) => (
          <button key={k}
            onClick={() => { dispatch({ type: 'SET_ADMIN_VIEW', view: k }); setSidebarOpen(false); }}
            className={`admin-nav-item ${av === k ? 'active' : ''}`}>
            <span style={{ fontSize: 16 }}>{ic}</span>{l}
          </button>
        ))}
      </aside>

      <main style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', overflowX: 'hidden', background: '#fafafa' }}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="mobile-menu-btn"
          style={{ marginBottom: '1rem', background: '#fff', border: '2px solid #f0f0f0', borderRadius: 10, padding: '8px 16px', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, color: '#64748b', fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
          ☰ {MENU.find(([k]) => k === av)?.[2] || 'เมนู'}
        </button>
        {av === 'dashboard' && <AdminDashboard />}
        {av === 'products' && <AdminProducts />}
        {av === 'orders' && <AdminOrders />}
        {av === 'customers' && <AdminCustomers />}
        {av === 'analytics' && <AdminAnalytics />}
      </main>
    </div>
  );
}
