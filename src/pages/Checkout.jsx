import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api from '../utils/api';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    address: '', city: '', postalCode: '', country: '', paymentMethod: 'Card',
  });

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const items = cart.map(item => ({
        product: item._id, name: item.name, image: item.image,
        price: item.price, qty: item.qty,
      }));
      const { data } = await api.post('/orders', {
        items,
        shippingAddress: { address: form.address, city: form.city, postalCode: form.postalCode, country: form.country },
        paymentMethod: form.paymentMethod,
        totalPrice: cartTotal,
      });
      // Simulate payment
      await api.put(`/orders/${data._id}/pay`);
      clearCart();
      navigate(`/orders/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page">
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, marginBottom: 32 }}>
        Checkout
      </h1>

      <div className="checkout-grid">
        {/* Form */}
        <form onSubmit={handleSubmit}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 20 }}>
            Shipping address
          </h2>
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label>Street address</label>
            <input name="address" className="form-control" value={form.address} onChange={handleChange} required placeholder="123 Main St" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label>City</label>
              <input name="city" className="form-control" value={form.city} onChange={handleChange} required placeholder="New York" />
            </div>
            <div className="form-group">
              <label>Postal code</label>
              <input name="postalCode" className="form-control" value={form.postalCode} onChange={handleChange} required placeholder="10001" />
            </div>
          </div>
          <div className="form-group">
            <label>Country</label>
            <input name="country" className="form-control" value={form.country} onChange={handleChange} required placeholder="United States" />
          </div>

          <div className="divider" />

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 20 }}>
            Payment method
          </h2>
          <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
            {['Card', 'PayPal', 'Cash on Delivery'].map(method => (
              <label key={method} className={`pay-option ${form.paymentMethod === method ? 'selected' : ''}`}>
                <input type="radio" name="paymentMethod" value={method} checked={form.paymentMethod === method} onChange={handleChange} style={{ display: 'none' }} />
                {method}
              </label>
            ))}
          </div>

          <button className="btn btn-primary" type="submit" style={{ width: '100%', padding: 14, fontSize: 16 }} disabled={loading || cart.length === 0}>
            {loading ? 'Placing order…' : `Place order · $${cartTotal.toFixed(2)}`}
          </button>
        </form>

        {/* Order summary */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Order items</h2>
          <div style={{ background: 'var(--gray-100)', borderRadius: 12, padding: 24 }}>
            {cart.map(item => (
              <div key={item._id} style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
                <img src={item.image} alt={item.name} style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover', background: 'var(--gray-200)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--gray-600)' }}>Qty: {item.qty}</div>
                </div>
                <div style={{ fontWeight: 700 }}>${(item.price * item.qty).toFixed(2)}</div>
              </div>
            ))}
            <div className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .checkout-grid { display: grid; grid-template-columns: 1fr 380px; gap: 56px; align-items: start; }
        .pay-option {
          flex: 1; text-align: center; padding: 12px;
          border: 1.5px solid var(--gray-200); border-radius: 8px;
          font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.15s;
        }
        .pay-option:hover { border-color: var(--black); }
        .pay-option.selected { border-color: var(--black); background: var(--black); color: var(--white); }
        @media (max-width: 768px) { .checkout-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
