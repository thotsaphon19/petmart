import { useApp } from '../context';
import { fmt, Stars } from '../utils';

export default function ProductCard({ p }) {
  const { state, dispatch } = useApp();
  const inWish = state.wishlist.includes(p.id);

  return (
    <div className="product-card"
      onClick={() => dispatch({ type: 'SELECT_PRODUCT', product: p })}>
      
      {/* Image area */}
      <div className="product-card-image">
        {p.imageUrl
          ? <img src={p.imageUrl} alt={p.name} />
          : <span className="product-card-emoji">{p.img}</span>
        }
        
        {/* Wishlist */}
        <button className="wish-btn"
          onClick={e => { e.stopPropagation(); dispatch({ type: 'TOGGLE_WISHLIST', pid: p.id }); }}>
          {inWish ? '❤️' : '🤍'}
        </button>
        
        {/* Badges */}
        {p.stock === 0
          ? <span className="badge-out">หมดแล้ว</span>
          : p.stock < 10
          ? <span className="badge-low">⚡ เหลือน้อย</span>
          : null
        }
      </div>

      {/* Body */}
      <div className="product-card-body">
        <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#1a1a2e' }}>{p.name}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
          <Stars r={p.rating} size={12} />
          <span style={{ fontSize: 11, color: '#94a3b8' }}>({p.reviews})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="price-tag" style={{ fontSize: 16 }}>{fmt(p.price)}</span>
          <button className="btn-cart"
            onClick={e => { e.stopPropagation(); if (p.stock === 0) return; dispatch({ type: 'ADD_TO_CART', item: { pid: p.id, name: p.name, price: p.price, img: p.imageUrl || p.img, qty: 1 } }); }}
            disabled={p.stock === 0}>
            {p.stock === 0 ? 'หมด' : '+ ตะกร้า'}
          </button>
        </div>
      </div>
    </div>
  );
}
