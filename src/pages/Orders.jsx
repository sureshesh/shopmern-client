import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const STATUS_COLORS = {
  pending: 'badge-warning', processing: 'badge-warning',
  shipped: 'badge-dark', delivered: 'badge-success', cancelled: 'badge-error',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/myorders')
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  return (
    <div className="container page">
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, marginBottom: 32 }}>My Orders</h1>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
          <h3>No orders yet</h3>
          <p style={{ marginBottom: 24 }}>Once you place an order, it'll appear here.</p>
          <Link to="/" className="btn btn-primary">Start shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {orders.map(order => (
            <Link to={`/orders/${order._id}`} key={order._id} className="card order-row">
              <div className="order-row-inner">
                <div>
                  <div style={{ fontSize: 12, color: 'var(--gray-600)', marginBottom: 4 }}>Order ID</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>#{order._id.slice(-8).toUpperCase()}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--gray-600)', marginBottom: 4 }}>Date</div>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--gray-600)', marginBottom: 4 }}>Items</div>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{order.items.reduce((a, i) => a + i.qty, 0)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--gray-600)', marginBottom: 4 }}>Total</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>${order.totalPrice.toFixed(2)}</div>
                </div>
                <div>
                  <span className={`badge ${STATUS_COLORS[order.status] || 'badge-dark'}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div style={{ color: 'var(--gray-400)', fontSize: 20 }}>→</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .order-row { display: block; padding: 20px 24px; transition: box-shadow 0.2s, transform 0.2s; }
        .order-row:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
        .order-row-inner {
          display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr auto;
          gap: 16px; align-items: center;
        }
        @media (max-width: 640px) {
          .order-row-inner { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
}
