import { useApp } from '../context';
import { fmt, StatusBadge } from '../utils';

export default function OrdersPage() {
  const { state, dispatch } = useApp();
  const myOrders = state.orders.filter(o => o.userId === state.currentUser?.id);

  if (myOrders.length === 0) return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem', maxWidth: 600, margin: '0 auto' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>📦</div>
      <h2 style={{ marginBottom: 8 }}>ยังไม่มีคำสั่งซื้อ</h2>
      <button onClick={() => dispatch({ type: 'SET_VIEW', view: 'shop' })} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 28px', fontSize: 14, cursor: 'pointer' }}>เลือกซื้อสินค้า</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '0.75rem' }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: '1rem' }}>📦 คำสั่งซื้อของฉัน</h1>
      {myOrders.map(o => {
        const steps = ['pending', 'processing', 'shipped', 'delivered'];
        const si = steps.indexOf(o.status);
        return (
          <div key={o.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '1rem', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{o.id}</span>
                <span style={{ color: '#6b7280', fontSize: 12, marginLeft: 10 }}>{o.date}</span>
              </div>
              <StatusBadge status={o.status} />
            </div>
            {o.status !== 'cancelled' && (
              <div style={{ display: 'flex', marginBottom: 10, overflowX: 'auto' }}>
                {['รอ', 'เตรียม', 'จัดส่ง', 'ส่งถึง'].map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 60 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                      <div style={{ width: 20, height: 20, borderRadius: 999, background: i <= si ? '#2563eb' : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, marginBottom: 4 }}>✓</div>
                      <p style={{ fontSize: 10, color: i <= si ? '#2563eb' : '#9ca3af', textAlign: 'center', whiteSpace: 'nowrap' }}>{s}</p>
                    </div>
                    {i < 3 && <div style={{ width: 16, height: 1, background: i < si ? '#2563eb' : '#e5e7eb', flexShrink: 0, marginBottom: 14 }} />}
                  </div>
                ))}
              </div>
            )}
            {o.items.map(item => {
              const prod = state.products.find(pr => pr.id === item.pid);
              return (
                <div key={item.pid} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '4px 0', fontSize: 13 }}>
                  <span>{prod?.img || '📦'}</span>
                  <span style={{ flex: 1 }}>{prod?.name || 'สินค้า'}</span>
                  <span style={{ color: '#6b7280' }}>x{item.qty}</span>
                  <span style={{ fontWeight: 500 }}>{fmt(item.price * item.qty)}</span>
                </div>
              );
            })}
            <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, flexWrap: 'wrap', gap: 4 }}>
              <span style={{ color: '#6b7280', fontSize: 12 }}>📍 {o.addr}</span>
              <span style={{ fontWeight: 700, color: '#2563eb' }}>รวม {fmt(o.total)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
