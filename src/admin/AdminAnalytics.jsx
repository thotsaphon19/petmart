import { useApp } from '../context';
import { fmt } from '../utils';
import { CATEGORIES } from '../data';

export default function AdminAnalytics() {
  const { state } = useApp();
  const byStatus = {};
  state.orders.forEach(o => { byStatus[o.status] = (byStatus[o.status] || 0) + 1; });
  const byCat = {};
  state.products.forEach(p => { byCat[p.cat] = (byCat[p.cat] || 0) + p.sold; });
  const maxSold = Math.max(...Object.values(byCat));
  const maxRev = Math.max(...state.products.map(p => p.price * p.sold));
  const STATUS_COLORS = { pending: '#f59e0b', processing: '#3b82f6', shipped: '#8b5cf6', delivered: '#10b981', cancelled: '#ef4444' };
  const CAT_COLORS = { dog: '#2563eb', cat: '#ec4899', bird: '#f59e0b', fish: '#06b6d4', smallpet: '#8b5cf6' };
  const STATUS_LABELS = { pending: 'รอดำเนินการ', processing: 'กำลังเตรียม', shipped: 'จัดส่งแล้ว', delivered: 'ส่งถึงแล้ว', cancelled: 'ยกเลิก' };

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: '1.25rem' }}>📈 วิเคราะห์ข้อมูล</h1>
      <div className="grid-2" style={{ marginBottom: '1rem' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: '1.25rem', border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: '1rem' }}>สถานะคำสั่งซื้อ</h3>
          {Object.entries(byStatus).map(([s, n]) => {
            const pct = Math.round((n / state.orders.length) * 100);
            return (
              <div key={s} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                  <span>{STATUS_LABELS[s]}</span>
                  <span style={{ fontWeight: 600 }}>{n} ({pct}%)</span>
                </div>
                <div style={{ height: 7, background: '#e5e7eb', borderRadius: 999 }}>
                  <div style={{ height: '100%', background: STATUS_COLORS[s] || '#6b7280', borderRadius: 999, width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: '1.25rem', border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: '1rem' }}>ยอดขายตามหมวด</h3>
          {Object.entries(byCat).map(([cat, sold]) => {
            const pct = Math.round((sold / maxSold) * 100);
            return (
              <div key={cat} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                  <span>{CATEGORIES[cat]}</span><span style={{ fontWeight: 600 }}>{sold} ชิ้น</span>
                </div>
                <div style={{ height: 7, background: '#e5e7eb', borderRadius: 999 }}>
                  <div style={{ height: '100%', background: CAT_COLORS[cat] || '#6b7280', borderRadius: 999, width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, padding: '1.25rem', border: '1px solid #e5e7eb' }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: '1rem' }}>สินค้าสร้างรายได้สูงสุด</h3>
        <div style={{ display: 'grid', gap: 10 }}>
          {[...state.products].sort((a, b) => (b.price * b.sold) - (a.price * a.sold)).slice(0, 5).map((p, i) => {
            const rev = p.price * p.sold;
            const pct = Math.round((rev / maxRev) * 100);
            return (
              <div key={p.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', minWidth: 18 }}>#{i+1}</span>
                <span style={{ fontSize: 16 }}>{p.img}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, fontSize: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>{p.name}</span>
                    <span style={{ fontWeight: 700, color: '#059669' }}>{fmt(rev)}</span>
                  </div>
                  <div style={{ height: 6, background: '#e5e7eb', borderRadius: 999 }}>
                    <div style={{ height: '100%', background: 'linear-gradient(90deg,#2563eb,#7c3aed)', borderRadius: 999, width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
