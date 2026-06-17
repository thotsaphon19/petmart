import { useState } from 'react';
import { useApp } from '../context';

export default function Navbar() {
  const { state, dispatch } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = state.cart.reduce((s, i) => s + i.qty, 0);
  const isAdmin = state.currentUser?.role === 'admin';

  const nav = (view) => { dispatch({ type: 'SET_VIEW', view }); setMobileOpen(false); };

  return (
    <>
      <nav style={{
        background: 'linear-gradient(135deg, #ff6b35 0%, #e55a26 100%)',
        padding: '0 1.25rem', position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', gap: 4, height: 64,
        boxShadow: '0 2px 20px rgba(255,107,53,.35)'
      }}>
        <button onClick={() => nav('shop')} style={{ background: 'rgba(255,255,255,.15)', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 18, cursor: 'pointer', color: '#fff', marginRight: 8, flexShrink: 0, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6, backdropFilter: 'blur(4px)', transition: 'background .2s' }}
          onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,.25)'}
          onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,.15)'}>
          🐾 PetMart
        </button>

        {!isAdmin && (
          <div className="hide-mobile" style={{ display: 'flex', gap: 2 }}>
            {['shop','wishlist'].map((v, i) => (
              <button key={v} onClick={() => nav(v)} style={{
                background: state.view === v ? 'rgba(255,255,255,.25)' : 'none',
                border: 'none', fontSize: 14, cursor: 'pointer',
                color: '#fff', fontWeight: state.view === v ? 700 : 400,
                padding: '6px 14px', borderRadius: 8, transition: 'background .2s'
              }}
                onMouseEnter={e => { if (state.view !== v) e.currentTarget.style.background='rgba(255,255,255,.1)'; }}
                onMouseLeave={e => { if (state.view !== v) e.currentTarget.style.background='none'; }}>
                {v === 'shop' ? '🏠 หน้าแรก' : `❤️ โปรด (${state.wishlist.length})`}
              </button>
            ))}
          </div>
        )}

        <div style={{ flex: 1 }} />

        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {state.currentUser ? (
            <>
              {isAdmin
                ? <button onClick={() => nav('admin')} style={{ background: 'rgba(255,255,255,.2)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>⚙️ หลังบ้าน</button>
                : <button onClick={() => nav('orders')} style={{ background: 'rgba(255,255,255,.15)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: 'pointer' }}>📦 คำสั่งซื้อ</button>
              }
              <button onClick={() => nav('account')} style={{ background: 'rgba(255,255,255,.15)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 13, cursor: 'pointer' }}>👤 {state.currentUser.name.split(' ')[0]}</button>
              <button onClick={() => dispatch({ type: 'LOGOUT' })} style={{ background: 'none', border: '1px solid rgba(255,255,255,.4)', color: 'rgba(255,255,255,.8)', borderRadius: 8, padding: '5px 10px', fontSize: 12, cursor: 'pointer' }}>ออก</button>
            </>
          ) : (
            <>
              <button onClick={() => dispatch({ type: 'SET_AUTH_VIEW', view: 'login' })} style={{ background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.4)', color: '#fff', fontSize: 13, padding: '6px 16px', borderRadius: 10, cursor: 'pointer', fontWeight: 600 }}>เข้าสู่ระบบ</button>
              <button onClick={() => dispatch({ type: 'SET_AUTH_VIEW', view: 'register' })} style={{ background: '#fff', color: '#e55a26', fontSize: 13, padding: '6px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700 }}>สมัครสมาชิก</button>
            </>
          )}
          {!isAdmin && (
            <button onClick={() => nav('cart')} style={{ background: '#fff', color: '#e55a26', border: 'none', borderRadius: 10, padding: '7px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 8px rgba(0,0,0,.15)' }}>
              🛒 {cartCount > 0 && <span style={{ background: '#ef4444', color: '#fff', borderRadius: 999, fontSize: 11, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>{cartCount}</span>}
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {!isAdmin && (
            <button onClick={() => nav('cart')} className="mobile-menu-btn" style={{ background: '#fff', color: '#e55a26', border: 'none', borderRadius: 10, padding: '6px 10px', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 }}>
              🛒 {cartCount > 0 && <span style={{ background: '#ef4444', color: '#fff', borderRadius: 999, fontSize: 11, padding: '0 5px' }}>{cartCount}</span>}
            </button>
          )}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="mobile-menu-btn" style={{ background: 'rgba(255,255,255,.2)', border: 'none', borderRadius: 10, padding: '6px 10px', fontSize: 18, cursor: 'pointer', color: '#fff' }}>
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div style={{ position: 'fixed', top: 64, left: 0, right: 0, background: '#fff', borderBottom: '1px solid #f0f0f0', zIndex: 99, padding: '1rem', display: 'flex', flexDirection: 'column', gap: 4, boxShadow: '0 8px 32px rgba(0,0,0,.15)' }}>
          {!isAdmin && (
            <>
              <button onClick={() => nav('shop')} style={{ background: 'none', border: 'none', textAlign: 'left', padding: '10px 12px', fontSize: 15, cursor: 'pointer', color: '#374151', borderRadius: 8 }}>🏠 หน้าแรก</button>
              <button onClick={() => nav('wishlist')} style={{ background: 'none', border: 'none', textAlign: 'left', padding: '10px 12px', fontSize: 15, cursor: 'pointer', color: '#374151', borderRadius: 8 }}>❤️ สินค้าโปรด ({state.wishlist.length})</button>
            </>
          )}
          {state.currentUser ? (
            <>
              {isAdmin && <button onClick={() => nav('admin')} style={{ background: 'none', border: 'none', textAlign: 'left', padding: '10px 12px', fontSize: 15, cursor: 'pointer', color: '#e55a26', borderRadius: 8 }}>⚙️ Admin Panel</button>}
              {!isAdmin && <button onClick={() => nav('orders')} style={{ background: 'none', border: 'none', textAlign: 'left', padding: '10px 12px', fontSize: 15, cursor: 'pointer', color: '#374151', borderRadius: 8 }}>📦 คำสั่งซื้อ</button>}
              <button onClick={() => nav('account')} style={{ background: 'none', border: 'none', textAlign: 'left', padding: '10px 12px', fontSize: 15, cursor: 'pointer', color: '#374151', borderRadius: 8 }}>👤 {state.currentUser.name}</button>
              <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '4px 0' }} />
              <button onClick={() => { dispatch({ type: 'LOGOUT' }); setMobileOpen(false); }} style={{ background: 'none', border: 'none', textAlign: 'left', padding: '10px 12px', fontSize: 15, cursor: 'pointer', color: '#dc2626', borderRadius: 8 }}>🚪 ออกจากระบบ</button>
            </>
          ) : (
            <>
              <button onClick={() => { dispatch({ type: 'SET_AUTH_VIEW', view: 'login' }); setMobileOpen(false); }} style={{ background: '#fff3ef', border: '1px solid #ffd0bc', color: '#e55a26', padding: '10px 12px', fontSize: 15, cursor: 'pointer', borderRadius: 10, fontWeight: 600 }}>เข้าสู่ระบบ</button>
              <button onClick={() => { dispatch({ type: 'SET_AUTH_VIEW', view: 'register' }); setMobileOpen(false); }} style={{ background: 'linear-gradient(135deg,#ff6b35,#e55a26)', color: '#fff', border: 'none', padding: '10px 12px', fontSize: 15, cursor: 'pointer', borderRadius: 10, fontWeight: 700 }}>สมัครสมาชิก</button>
            </>
          )}
        </div>
      )}
    </>
  );
}
