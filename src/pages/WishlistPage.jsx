import { useApp } from '../context';
import ProductCard from '../components/ProductCard';

export default function WishlistPage() {
  const { state } = useApp();
  const wishProds = state.products.filter(p => state.wishlist.includes(p.id));

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1rem' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: '1.5rem' }}>❤️ สินค้าโปรด ({wishProds.length})</h1>
      {wishProds.length === 0
        ? <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🤍</div>
            <p>ยังไม่มีสินค้าโปรด กดหัวใจที่สินค้าเพื่อเพิ่ม</p>
          </div>
        : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem' }}>{wishProds.map(p => <ProductCard key={p.id} p={p} />)}</div>
      }
    </div>
  );
}
