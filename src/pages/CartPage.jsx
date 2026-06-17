import { useApp } from '../context';
import { fmt } from '../utils';

export default function CartPage() {
  const { state, dispatch } = useApp();
  const total = state.cart.reduce((s, i) => s + i.price * i.qty, 0);
  const ship = total >= 500 ? 0 : 50;

  if (state.cart.length === 0) return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem', maxWidth: 600, margin: '0 auto' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
      <h2 style={{ marginBottom: 8 }}>ตะกร้าสินค้าว่างเปล่า</h2>
      <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>เริ่มเลือกซื้อสินค้าที่คุณชื่นชอบ</p>
      <button onClick={() => dispatch({ type: 'SET_VIEW', view: 'shop' })} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 28px', fontSize: 14, cursor: 'pointer' }}>เลือกซื้อสินค้า</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '0.75rem' }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: '1rem' }}>🛒 ตะกร้าสินค้า ({state.cart.length})</h1>
      <div className="cart-layout">
        <div>
          {state.cart.map(item => (
            <div key={item.pid} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.img && (item.img.startsWith('http') || item.img.startsWith('/'))
                    ? <img src={item.img} alt={item.name} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }} />
                    : <span style={{ fontSize: 44 }}>{item.img}</span>
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 500, fontSize: 14, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                  <p style={{ color: '#2563eb', fontWeight: 600, fontSize: 15 }}>{fmt(item.price)}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: 8 }}>
                  <button onClick={() => { if (item.qty <= 1) dispatch({ type: 'REMOVE_FROM_CART', pid: item.pid }); else dispatch({ type: 'UPDATE_QTY', pid: item.pid, qty: item.qty - 1 }); }} style={{ padding: '6px 12px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 16 }}>−</button>
                  <span style={{ padding: '6px 12px', borderLeft: '1px solid #e5e7eb', borderRight: '1px solid #e5e7eb', fontSize: 14, fontWeight: 500 }}>{item.qty}</span>
                  <button onClick={() => dispatch({ type: 'UPDATE_QTY', pid: item.pid, qty: item.qty + 1 })} style={{ padding: '6px 12px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 16 }}>+</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{fmt(item.price * item.qty)}</span>
                  <button onClick={() => dispatch({ type: 'REMOVE_FROM_CART', pid: item.pid })} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 20 }}>🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '1.25rem', position: 'sticky', top: 70 }}>
            <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>สรุปคำสั่งซื้อ</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}><span>ราคาสินค้า</span><span>{fmt(total)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}><span>ค่าจัดส่ง</span><span style={{ color: ship === 0 ? '#059669' : 'inherit' }}>{ship === 0 ? 'ฟรี' : fmt(ship)}</span></div>
            {ship === 0 && <p style={{ fontSize: 12, color: '#059669', marginBottom: 8 }}>✅ ซื้อครบ 500 ฿ จัดส่งฟรี!</p>}
            {ship > 0 && <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>ซื้ออีก {fmt(500 - total)} เพื่อรับส่งฟรี</p>}
            <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 17, marginBottom: '1rem' }}><span>รวมทั้งหมด</span><span style={{ color: '#2563eb' }}>{fmt(total + ship)}</span></div>
            <button onClick={() => { if (!state.currentUser) { dispatch({ type: 'SET_AUTH_VIEW', view: 'login' }); return; } dispatch({ type: 'SET_VIEW', view: 'checkout' }); dispatch({ type: 'SET_CHECKOUT_STEP', step: 0 }); }}
              style={{ width: '100%', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontSize: 15, fontWeight: 600, cursor: 'pointer', marginBottom: 8 }}>ชำระเงิน →</button>
            <button onClick={() => dispatch({ type: 'SET_VIEW', view: 'shop' })} style={{ width: '100%', background: 'none', border: '1px solid #e5e7eb', borderRadius: 10, padding: '10px', fontSize: 14, cursor: 'pointer' }}>เลือกซื้อเพิ่ม</button>
          </div>
        </div>
      </div>
    </div>
  );
}
