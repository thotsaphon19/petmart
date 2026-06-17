import { useApp } from '../context';
import { fmt, StatusBadge } from '../utils';

function StatCard({ ic, label, value, sub, color }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '1rem', borderLeft: `4px solid ${color || '#2563eb'}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: 12, color: '#6b7280' }}>{label}</p>
          <p style={{ fontSize: 'clamp(20px,4vw,26px)', fontWeight: 700, marginTop: 4 }}>{value}</p>
          {sub && <p style={{ fontSize: 12, color: '#059669', marginTop: 2 }}>{sub}</p>}
        </div>
        <div style={{ fontSize: 28 }}>{ic}</div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { state } = useApp();
  const totalRev = state.orders.reduce((s, o) => s + (o.status !== 'cancelled' ? o.total : 0), 0);
  const totalCust = state.users.filter(u => u.role === 'customer').length;
  const pendingOrders = state.orders.filter(o => o.status === 'pending').length;
  const lowStock = state.products.filter(p => p.stock < 10).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: 8 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>📊 ภาพรวมระบบ</h1>
        <span style={{ fontSize: 12, color: '#6b7280' }}>{new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
      <div className="grid-4" style={{ marginBottom: '1.25rem' }}>
        <StatCard ic="💰" label="รายได้รวม" value={fmt(totalRev)} sub="↑ 12% จากเดือนก่อน" color="#059669" />
        <StatCard ic="📦" label="คำสั่งซื้อ" value={state.orders.length} sub={`รอดำเนินการ ${pendingOrders}`} color="#2563eb" />
        <StatCard ic="👥" label="ลูกค้า" value={totalCust} color="#7c3aed" />
        <StatCard ic="⚠️" label="สินค้าใกล้หมด" value={`${lowStock}`} color="#d97706" />
      </div>
      <div className="grid-2">
        <div style={{ background: '#fff', borderRadius: 12, padding: '1.25rem', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: '1rem' }}>คำสั่งซื้อล่าสุด</h3>
          {state.orders.slice(0, 5).map(o => (
            <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f3f4f6', gap: 8 }}>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.id}</p>
                <p style={{ fontSize: 11, color: '#6b7280' }}>{o.date}</p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <StatusBadge status={o.status} /><br />
                <span style={{ fontSize: 12, fontWeight: 600 }}>{fmt(o.total)}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: '1.25rem', border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: '1rem' }}>สินค้าขายดี</h3>
          {state.products.sort((a, b) => b.sold - a.sold).slice(0, 5).map((p, i) => (
            <div key={p.id} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #f3f4f6' }}>
              <span style={{ fontSize: 11, color: '#9ca3af', minWidth: 18, fontWeight: 600 }}>#{i+1}</span>
              <span style={{ fontSize: 18 }}>{p.img}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                <p style={{ fontSize: 11, color: '#6b7280' }}>ขายแล้ว {p.sold}</p>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#2563eb', flexShrink: 0 }}>{fmt(p.price)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
