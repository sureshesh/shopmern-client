import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Cart() {
  const { cart, removeFromCart, updateQty, cartTotal, user } = useApp();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="container page">
        <div className="empty-state">
          <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
          <h3>Your cart is empty</h3>
          <p style={{ marginBottom: 24 }}>Looks like you haven't added anything yet.</p>
          <Link to="/" className="btn btn-primary">Start shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, marginBottom: 32 }}>
        Your Cart
      </h1>

      <div className="cart-layout">
        {/* Items */}
        <div className="cart-items">
          {cart.map(item => (
            <div key={item._id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-img" />
              <div className="cart-item-info">
                <Link to={`/product/${item._id}`} className="cart-item-name">{item.name}</Link>
                <div style={{ fontSize: 13, color: 'var(--gray-600)', marginTop: 2 }}>{item.brand}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, margin: '8px 0' }}>
                  ${(item.price * item.qty).toFixed(2)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div className="qty-input">
                    <button className="qty-btn" onClick={() => updateQty(item._id, item.qty - 1)}>−</button>
                    <span className="qty-num">{item.qty}</span>
                    <button className="qty-btn" onClick={() => updateQty(item._id, Math.min(item.stock, item.qty + 1))}>+</button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    style={{ background: 'none', color: 'var(--error)', fontSize: 13, fontWeight: 500, padding: 0 }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="cart-summary">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Order summary</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 15 }}>
            <span style={{ color: 'var(--gray-600)' }}>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 15 }}>
            <span style={{ color: 'var(--gray-600)' }}>Shipping</span>
            <span style={{ color: 'var(--success)', fontWeight: 600 }}>Free</span>
          </div>
          <div className="divider" />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>Total</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22 }}>${cartTotal.toFixed(2)}</span>
          </div>
          <button
            className="btn btn-primary"
            style={{ width: '100%', padding: 14, fontSize: 16 }}
            onClick={() => user ? navigate('/checkout') : navigate('/login')}
          >
            {user ? 'Proceed to checkout' : 'Login to checkout'}
          </button>
          <Link to="/" style={{ display: 'block', textAlign: 'center', marginTop: 16, fontSize: 14, color: 'var(--gray-600)' }}>
            ← Continue shopping
          </Link>
        </div>
      </div>

      <style>{`
        .cart-layout { display: grid; grid-template-columns: 1fr 340px; gap: 40px; align-items: start; }
        .cart-items { display: flex; flex-direction: column; gap: 16px; }
        .cart-item {
          display: flex; gap: 20px; padding: 20px;
          border: 1px solid var(--gray-200); border-radius: 12px;
        }
        .cart-item-img {
          width: 100px; height: 100px; object-fit: cover;
          border-radius: 8px; flex-shrink: 0; background: var(--gray-100);
        }
        .cart-item-info { flex: 1; }
        .cart-item-name { font-weight: 600; font-size: 16px; color: var(--black); }
        .cart-item-name:hover { color: var(--accent); }
        .cart-summary {
          background: var(--gray-100); border-radius: 16px; padding: 28px;
          position: sticky; top: 80px;
        }
        @media (max-width: 768px) {
          .cart-layout { grid-template-columns: 1fr; }
          .cart-summary { position: static; }
        }
      `}</style>
    </div>
  );
}
