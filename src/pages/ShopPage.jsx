import { useState } from 'react';
import { useApp } from '../context';
import { CATEGORIES } from '../data';
import ProductCard from '../components/ProductCard';

const CAT_EMOJIS = { all:'🐾', dog:'🐕', cat:'🐈', bird:'🦜', fish:'🐠', smallpet:'🐹' };

export default function ShopPage() {
  const { state, dispatch } = useApp();
  const [priceMin, setMin] = useState(0);
  const [priceMax, setMax] = useState(100000);
  const [showFilters, setShowFilters] = useState(false);

  let prods = state.products.filter(p => {
    if (state.selectedCat !== 'all' && p.cat !== state.selectedCat) return false;
    if (state.searchQ && !p.name.toLowerCase().includes(state.searchQ.toLowerCase()) && !p.desc.toLowerCase().includes(state.searchQ.toLowerCase())) return false;
    if (p.price < priceMin || p.price > priceMax) return false;
    return true;
  });
  if (state.sortBy === 'popular') prods.sort((a, b) => b.sold - a.sold);
  else if (state.sortBy === 'price_asc') prods.sort((a, b) => a.price - b.price);
  else if (state.sortBy === 'price_desc') prods.sort((a, b) => b.price - a.price);
  else if (state.sortBy === 'rating') prods.sort((a, b) => b.rating - a.rating);
  else if (state.sortBy === 'newest') prods.sort((a, b) => b.id - a.id);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1rem' }}>
      {/* Hero Banner */}
      <div className="hero-banner" style={{ marginBottom: '1.25rem' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 40 }}>🐾</span>
            <div>
              <h1 style={{ fontSize: 'clamp(20px,5vw,32px)', fontWeight: 800, lineHeight: 1.2 }}>ยินดีต้อนรับสู่ PetMart</h1>
              <p style={{ opacity: .85, fontSize: 'clamp(13px,3vw,15px)', marginTop: 2 }}>อาหารและของใช้สัตว์เลี้ยงครบทุกชนิด ราคาดี จัดส่งทั่วไทย 🚚</p>
            </div>
          </div>
          <div style={{ position: 'relative', maxWidth: 480 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
            <input
              value={state.searchQ}
              onChange={e => dispatch({ type: 'SET_SEARCH', q: e.target.value })}
              placeholder="ค้นหาสินค้า อาหาร ของเล่น..."
              style={{ width: '100%', padding: '11px 16px 11px 44px', borderRadius: 12, border: 'none', fontSize: 14, outline: 'none', boxShadow: '0 4px 16px rgba(0,0,0,.15)', fontFamily: 'inherit' }}
            />
          </div>
        </div>
        {/* Decorative pets */}
        <div style={{ position: 'absolute', right: '1.5rem', bottom: '-4px', fontSize: 72, opacity: .12, userSelect: 'none', display: 'flex', gap: 8 }}>
          🐕 🐈
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ overflowX: 'auto', paddingBottom: 4, marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: 8, minWidth: 'max-content' }}>
          {Object.entries(CATEGORIES).map(([k, v]) => (
            <button key={k} className={`cat-tab ${state.selectedCat === k ? 'active' : ''}`}
              onClick={() => dispatch({ type: 'SET_CAT', cat: k })}>
              {CAT_EMOJIS[k]} {v}
            </button>
          ))}
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        <button onClick={() => setShowFilters(!showFilters)}
          style={{ background: '#fff', border: '2px solid #f0f0f0', borderRadius: 10, padding: '7px 14px', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, color: '#64748b', fontFamily: 'inherit' }}>
          🎛️ ตัวกรอง {showFilters ? '▲' : '▼'}
        </button>
        <select value={state.sortBy} onChange={e => dispatch({ type: 'SET_SORT', sort: e.target.value })}
          style={{ padding: '7px 12px', borderRadius: 10, border: '2px solid #f0f0f0', fontSize: 13, background: '#fff', fontFamily: 'inherit', fontWeight: 600, color: '#64748b', outline: 'none', cursor: 'pointer' }}>
          <option value="popular">🔥 ยอดนิยม</option>
          <option value="newest">✨ ใหม่ล่าสุด</option>
          <option value="price_asc">💰 ราคาน้อย → มาก</option>
          <option value="price_desc">💎 ราคามาก → น้อย</option>
          <option value="rating">⭐ คะแนนสูงสุด</option>
        </select>
        <span style={{ fontSize: 13, color: '#94a3b8', marginLeft: 'auto', fontWeight: 600 }}>พบ {prods.length} รายการ</span>
      </div>

      {showFilters && (
        <div className="card" style={{ padding: '1rem', marginBottom: '0.75rem', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>💸 ช่วงราคา:</span>
          <input type="number" value={priceMin} onChange={e => setMin(+e.target.value)}
            className="input-nice" style={{ width: 100 }} placeholder="ต่ำสุด" />
          <span style={{ color: '#94a3b8', fontWeight: 700 }}>—</span>
          <input type="number" value={priceMax} onChange={e => setMax(+e.target.value)}
            className="input-nice" style={{ width: 110 }} placeholder="สูงสุด" />
          <span style={{ fontSize: 13, color: '#64748b' }}>฿</span>
        </div>
      )}

      {prods.length === 0
        ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
            <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>ไม่พบสินค้าที่ค้นหา</p>
            <p style={{ fontSize: 14 }}>ลองค้นหาด้วยคำอื่น หรือเปลี่ยนหมวดหมู่</p>
          </div>
        )
        : <div className="grid-products">{prods.map(p => <ProductCard key={p.id} p={p} />)}</div>
      }
    </div>
  );
}
