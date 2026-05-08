import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

const STEPS = ['pending', 'processing', 'shipped', 'delivered'];

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner" />;
  if (!order) return <div className="container page"><div className="alert alert-error">Order not found</div></div>;

  const stepIndex = STEPS.indexOf(order.status);

  return (
    <div className="container page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <Link to="/orders" style={{ fontSize: 14, color: 'var(--gray-600)' }}>← My Orders</Link>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginTop: 8 }}>
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>
          <div style={{ fontSize: 14, color: 'var(--gray-600)', marginTop: 4 }}>
            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Progress tracker */}
      {order.status !== 'cancelled' && (
        <div className="order-tracker" style={{ marginBottom: 40 }}>
          {STEPS.map((step, i) => (
            <div key={step} className={`tracker-step ${i <= stepIndex ? 'done' : ''} ${i === stepIndex ? 'active' : ''}`}>
              <div className="tracker-dot">{i < stepIndex ? '✓' : i + 1}</div>
              <div className="tracker-label">{step.charAt(0).toUpperCase() + step.slice(1)}</div>
              {i < STEPS.length - 1 && <div className={`tracker-line ${i < stepIndex ? 'done' : ''}`} />}
            </div>
          ))}
        </div>
      )}

      <div className="order-detail-grid">
        {/* Items */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Items</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, padding: 16, background: 'var(--gray-100)', borderRadius: 10 }}>
                <img src={item.image} alt={item.name} style={{ width: 70, height: 70, borderRadius: 8, objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--gray-600)' }}>Qty: {item.qty} × ${item.price}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>${(item.qty * item.price).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, padding: 20, background: 'var(--gray-100)', borderRadius: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: 'var(--gray-600)' }}>Subtotal</span>
              <span>${order.totalPrice.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ color: 'var(--gray-600)' }}>Shipping</span>
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>Free</span>
            </div>
            <div className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20 }}>${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Details sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ padding: 24, background: 'var(--gray-100)', borderRadius: 12 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Shipping address</h3>
            <div style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.8 }}>
              {order.shippingAddress.address}<br />
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
              {order.shippingAddress.country}
            </div>
          </div>
          <div style={{ padding: 24, background: 'var(--gray-100)', borderRadius: 12 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Payment</h3>
            <div style={{ fontSize: 14, color: 'var(--gray-600)' }}>{order.paymentMethod}</div>
            <div style={{ marginTop: 8 }}>
              {order.isPaid
                ? <span className="badge badge-success">✓ Paid {new Date(order.paidAt).toLocaleDateString()}</span>
                : <span className="badge badge-warning">Not paid</span>}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .order-tracker {
          display: flex; align-items: flex-start; position: relative;
          background: var(--gray-100); border-radius: 12px; padding: 24px 32px;
        }
        .tracker-step { display: flex; flex-direction: column; align-items: center; gap: 8px; flex: 1; position: relative; }
        .tracker-dot {
          width: 36px; height: 36px; border-radius: 50%;
          background: var(--gray-200); color: var(--gray-600);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; transition: all 0.3s; z-index: 1;
        }
        .tracker-step.done .tracker-dot { background: var(--black); color: white; }
        .tracker-step.active .tracker-dot { background: var(--accent); color: white; box-shadow: 0 0 0 4px rgba(255,77,0,0.2); }
        .tracker-label { font-size: 12px; font-weight: 600; color: var(--gray-600); text-align: center; }
        .tracker-step.done .tracker-label, .tracker-step.active .tracker-label { color: var(--black); }
        .tracker-line {
          position: absolute; top: 18px; left: 50%; width: 100%;
          height: 2px; background: var(--gray-200); z-index: 0;
        }
        .tracker-line.done { background: var(--black); }
        .order-detail-grid { display: grid; grid-template-columns: 1fr 300px; gap: 40px; align-items: start; }
        @media (max-width: 768px) { .order-detail-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
