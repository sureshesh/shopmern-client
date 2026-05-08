import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--gray-200)', padding: '40px 0',
      marginTop: 'auto', background: 'var(--white)'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, marginBottom: 4 }}>
            SHOP<span style={{ color: 'var(--accent)' }}>MERN</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--gray-600)' }}>Built with MongoDB · Express · React · Node.js</div>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link to="/" style={{ fontSize: 14, color: 'var(--gray-600)' }}>Shop</Link>
          <Link to="/cart" style={{ fontSize: 14, color: 'var(--gray-600)' }}>Cart</Link>
          <Link to="/orders" style={{ fontSize: 14, color: 'var(--gray-600)' }}>Orders</Link>
        </div>
        <div style={{ fontSize: 13, color: 'var(--gray-400)' }}>© 2024 ShopMERN. Resume project.</div>
      </div>
    </footer>
  );
}
