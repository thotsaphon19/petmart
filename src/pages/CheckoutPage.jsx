import { useState } from 'react';
import { useApp } from '../context';
import { fmt } from '../utils';

export default function CheckoutPage() {
  const { state, dispatch } = useApp();
  const [addr, setAddr] = useState({ name: state.currentUser?.name || '', phone: '', address: '', district: '', province: 'กรุงเทพฯ', zip: '' });
  const [payment, setPayment] = useState('credit_card');
  const [card, setCard] = useState({ no: '', exp: '', cvv: '', name: '' });
  const step = state.checkoutStep;
  const total = state.cart.reduce((s, i) => s + i.price * i.qty, 0);
  const ship = total >= 500 ? 0 : 50;
  const grand = total + ship;
  const STEPS = ['📍 ที่อยู่', '💳 ชำระเงิน', '✅ ยืนยัน'];

  const iStyle = { width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, background: '#f9fafb', outline: 'none' };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '0.75rem' }}>
      {/* Steps */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', background: '#fff', borderRadius: 12, padding: '0.875rem 1rem', border: '1px solid #e5e7eb' }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{ width: 28, height: 28, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, background: i <= step ? '#2563eb' : '#f3f4f6', color: i <= step ? '#fff' : '#9ca3af', flexShrink: 0 }}>{i + 1}</div>
            <span style={{ fontSize: 'clamp(11px,2.5vw,13px)', fontWeight: i === step ? 600 : 400, color: i === step ? '#2563eb' : i < step ? '#374151' : '#9ca3af', marginLeft: 6, flex: 1 }}>{s}</span>
            {i < 2 && <div style={{ width: 12, height: 1, background: '#e5e7eb', flexShrink: 0 }} />}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div style={{ background: '#fff', borderRadius: 12, padding: '1.25rem', border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: '1rem' }}>ที่อยู่จัดส่ง</h2>
          <div className="grid-2" style={{ gap: 12 }}>
            {[['ชื่อ-นามสกุล', 'name', 'ชื่อผู้รับ'], ['เบอร์โทร', 'phone', '0812345678']].map(([l, k, ph]) => (
              <div key={k}>
                <label style={{ fontSize: 13, color: '#6b7280', display: 'block', marginBottom: 4 }}>{l}</label>
                <input value={addr[k]} onChange={e => setAddr({ ...addr, [k]: e.target.value })} placeholder={ph} style={iStyle} />
              </div>
            ))}
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ fontSize: 13, color: '#6b7280', display: 'block', marginBottom: 4 }}>ที่อยู่</label>
              <input value={addr.address} onChange={e => setAddr({ ...addr, address: e.target.value })} placeholder="บ้านเลขที่ ถนน" style={iStyle} />
            </div>
            {[['แขวง/ตำบล', 'district', 'แขวง'], ['จังหวัด', 'province', 'จังหวัด'], ['รหัสไปรษณีย์', 'zip', '10110']].map(([l, k, ph]) => (
              <div key={k}>
                <label style={{ fontSize: 13, color: '#6b7280', display: 'block', marginBottom: 4 }}>{l}</label>
                <input value={addr[k]} onChange={e => setAddr({ ...addr, [k]: e.target.value })} placeholder={ph} style={iStyle} />
              </div>
            ))}
          </div>
          <button onClick={() => dispatch({ type: 'SET_CHECKOUT_STEP', step: 1 })} style={{ marginTop: '1.25rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 32px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>ต่อไป →</button>
        </div>
      )}

      {step === 1 && (
        <div style={{ background: '#fff', borderRadius: 12, padding: '1.25rem', border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: '1rem' }}>วิธีชำระเงิน</h2>
          <div className="grid-3" style={{ gap: 10, marginBottom: '1.25rem' }}>
            {[['credit_card', '💳', 'บัตรเครดิต/เดบิต'], ['promptpay', '📲', 'พร้อมเพย์'], ['bank_transfer', '🏦', 'โอนธนาคาร']].map(([k, ic, l]) => (
              <button key={k} onClick={() => setPayment(k)} style={{ padding: '14px 8px', border: '2px solid', borderColor: payment === k ? '#2563eb' : '#e5e7eb', borderRadius: 10, background: payment === k ? '#eff6ff' : '#fff', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ fontSize: 24 }}>{ic}</div>
                <div style={{ fontSize: 12, fontWeight: 500, marginTop: 4, color: payment === k ? '#2563eb' : '#374151' }}>{l}</div>
              </button>
            ))}
          </div>
          {payment === 'credit_card' && (
            <div>
              <div style={{ marginBottom: 10 }}><label style={{ fontSize: 13, color: '#6b7280', display: 'block', marginBottom: 4 }}>หมายเลขบัตร</label><input value={card.no} onChange={e => setCard({ ...card, no: e.target.value })} placeholder="1234 5678 9012 3456" style={iStyle} /></div>
              <div className="grid-3" style={{ gap: 10 }}>
                <div><label style={{ fontSize: 13, color: '#6b7280', display: 'block', marginBottom: 4 }}>วันหมดอายุ</label><input value={card.exp} onChange={e => setCard({ ...card, exp: e.target.value })} placeholder="MM/YY" style={iStyle} /></div>
                <div><label style={{ fontSize: 13, color: '#6b7280', display: 'block', marginBottom: 4 }}>CVV</label><input value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value })} placeholder="123" style={iStyle} /></div>
                <div><label style={{ fontSize: 13, color: '#6b7280', display: 'block', marginBottom: 4 }}>ชื่อบนบัตร</label><input value={card.name} onChange={e => setCard({ ...card, name: e.target.value })} placeholder="SOMCHAI J" style={iStyle} /></div>
              </div>
            </div>
          )}
          {payment === 'promptpay' && (
            <div style={{ textAlign: 'center', padding: '1.5rem', background: '#f0fdf4', borderRadius: 10 }}>
              <div style={{ fontSize: 56 }}>📲</div>
              <p style={{ fontWeight: 600, marginTop: 8 }}>พร้อมเพย์: 062-345-6789</p>
              <p style={{ fontSize: 13, color: '#6b7280' }}>โอนเงินจำนวน {fmt(grand)} แล้วกด "ยืนยัน"</p>
            </div>
          )}
          {payment === 'bank_transfer' && (
            <div style={{ padding: '1rem', background: '#eff6ff', borderRadius: 10 }}>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>ธนาคารกสิกรไทย (KBank)</p>
              <p style={{ fontSize: 14 }}>เลขบัญชี: 123-4-56789-0</p>
              <p style={{ fontSize: 14 }}>ชื่อบัญชี: บริษัท PetMart จำกัด</p>
              <p style={{ fontSize: 14, color: '#2563eb', fontWeight: 600, marginTop: 4 }}>ยอดที่ต้องโอน: {fmt(grand)}</p>
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, marginTop: '1.25rem' }}>
            <button onClick={() => dispatch({ type: 'SET_CHECKOUT_STEP', step: 0 })} style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: 10, padding: '10px 20px', fontSize: 14, cursor: 'pointer' }}>← กลับ</button>
            <button onClick={() => dispatch({ type: 'SET_CHECKOUT_STEP', step: 2 })} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>ถัดไป →</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ background: '#fff', borderRadius: 12, padding: '1.25rem', border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: '1rem' }}>ยืนยันคำสั่งซื้อ</h2>
          <div style={{ marginBottom: 16 }}>
            {state.cart.map(i => (
              <div key={i.pid} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ width: 44, height: 44, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, overflow: 'hidden', background: '#f9fafb' }}>
                  {i.img && (i.img.startsWith('http') || i.img.startsWith('/'))
                    ? <img src={i.img} alt={i.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: 28 }}>{i.img}</span>
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}><p style={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.name}</p><p style={{ fontSize: 12, color: '#6b7280' }}>x{i.qty}</p></div>
                <span style={{ fontWeight: 600, fontSize: 14, flexShrink: 0 }}>{fmt(i.price * i.qty)}</span>
              </div>
            ))}
          </div>
          <div style={{ background: '#f9fafb', borderRadius: 8, padding: '1rem', marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 14 }}><span>ค่าสินค้า</span><span>{fmt(total)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 14 }}><span>ค่าจัดส่ง</span><span style={{ color: ship === 0 ? '#059669' : 'inherit' }}>{ship === 0 ? 'ฟรี' : fmt(ship)}</span></div>
            <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 17 }}><span>รวม</span><span style={{ color: '#2563eb' }}>{fmt(grand)}</span></div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={() => dispatch({ type: 'SET_CHECKOUT_STEP', step: 1 })} style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: 10, padding: '10px 20px', fontSize: 14, cursor: 'pointer' }}>← กลับ</button>
            <button onClick={() => dispatch({ type: 'PLACE_ORDER', order: { items: state.cart, total: grand, addr: `${addr.address} ${addr.district} ${addr.province} ${addr.zip}`, payment } })}
              style={{ flex: 1, minWidth: 160, background: '#059669', color: '#fff', border: 'none', borderRadius: 10, padding: '12px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
              ✅ ยืนยันสั่งซื้อ {fmt(grand)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
