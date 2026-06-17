import { useApp } from '../context';
import { fmt } from '../utils';

export default function AccountPage() {
  const { state, dispatch } = useApp();
  const u = state.currentUser;
  const myOrders = state.orders.filter(o => o.userId === u.id);
  const spent = myOrders.reduce((s, o) => s + o.total, 0);

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '0.75rem' }}>
      <div style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)', borderRadius: 16, padding: '1.5rem', color: '#fff', marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ width: 64, height: 64, borderRadius: 999, background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, flexShrink: 0 }}>{u.name[0]}</div>
        <div>
          <h1 style={{ fontSize: 'clamp(18px,4vw,22px)', fontWeight: 700 }}>{u.name}</h1>
          <p style={{ opacity: .85, fontSize: 14 }}>{u.email}</p>
          <p style={{ fontSize: 12, opacity: .7, marginTop: 4 }}>สมาชิกตั้งแต่ {u.joined}</p>
        </div>
      </div>
      <div className="grid-3" style={{ marginBottom: '1rem' }}>
        {[['📦', 'คำสั่งซื้อ', myOrders.length + ' รายการ'], ['💰', 'ยอดซื้อรวม', fmt(spent)], ['❤️', 'สินค้าโปรด', state.wishlist.length + ' ชิ้น']].map(([ic, l, v]) => (
          <div key={l} style={{ background: '#fff', borderRadius: 12, padding: '1rem', border: '1px solid #e5e7eb', textAlign: 'center' }}>
            <div style={{ fontSize: 28 }}>{ic}</div>
            <p style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{l}</p>
            <p style={{ fontWeight: 700, fontSize: 15, marginTop: 2 }}>{v}</p>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button onClick={() => dispatch({ type: 'SET_VIEW', view: 'orders' })} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 14, cursor: 'pointer' }}>📦 ดูคำสั่งซื้อ</button>
        <button onClick={() => dispatch({ type: 'SET_VIEW', view: 'wishlist' })} style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: 10, padding: '10px 20px', fontSize: 14, cursor: 'pointer' }}>❤️ สินค้าโปรด</button>
        <button onClick={() => dispatch({ type: 'LOGOUT' })} style={{ background: 'none', border: '1px solid #dc2626', color: '#dc2626', borderRadius: 10, padding: '10px 20px', fontSize: 14, cursor: 'pointer' }}>ออกจากระบบ</button>
      </div>
    </div>
  );
}
