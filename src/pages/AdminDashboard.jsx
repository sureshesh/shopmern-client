import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, revenue: 0, pending: 0, delivered: 0 });

  useEffect(() => {
    api.get('/orders')
      .then(({ data }) => {
        setOrders(data);
        setStats({
          total: data.length,
          revenue: data.filter(o => o.isPaid).reduce((s, o) => s + o.totalPrice, 0),
          pending: data.filter(o => o.status === 'pending').length,
          delivered: data.filter(o => o.status === 'delivered').length,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId, status) => {
    await api.put(`/orders/${orderId}/status`, { status });
    setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="container page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800 }}>Admin Dashboard</h1>
        <Link to="/admin/products" className="btn btn-accent">Manage Products</Link>
      </div>

      {/* Stats cards */}
      <div className="stats-grid">
        {[
          { label: 'Total orders', value: stats.total, icon: '📦' },
          { label: 'Revenue', value: `$${stats.revenue.toFixed(0)}`, icon: '💰' },
          { label: 'Pending', value: stats.pending, icon: '⏳' },
          { label: 'Delivered', value: stats.delivered, icon: '✅' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize: 32 }}>{s.icon}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, margin: '8px 0 4px' }}>{s.value}</div>
            <div style={{ fontSize: 13, color: 'var(--gray-600)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Orders table */}
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 20 }}>All orders</h2>
      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>
                  <Link to={`/orders/${order._id}`} style={{ fontWeight: 600, fontSize: 13 }}>
                    #{order._id.slice(-8).toUpperCase()}
                  </Link>
                </td>
                <td style={{ fontSize: 14 }}>
                  <div style={{ fontWeight: 500 }}>{order.user?.name || 'Unknown'}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-600)' }}>{order.user?.email}</div>
                </td>
                <td style={{ fontSize: 13, color: 'var(--gray-600)' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>${order.totalPrice.toFixed(2)}</td>
                <td>
                  {order.isPaid
                    ? <span className="badge badge-success">Paid</span>
                    : <span className="badge badge-warning">Pending</span>}
                </td>
                <td>
                  <select
                    className="form-control"
                    style={{ padding: '6px 10px', fontSize: 13, width: 'auto' }}
                    value={order.status}
                    onChange={e => updateStatus(order._id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 40px; }
        .stat-card { background: var(--gray-100); border-radius: 16px; padding: 28px; text-align: center; }
        .admin-table { width: 100%; border-collapse: collapse; font-size: 14px; }
        .admin-table th {
          text-align: left; padding: 12px 16px; border-bottom: 2px solid var(--gray-200);
          font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--gray-600); font-weight: 600;
        }
        .admin-table td { padding: 14px 16px; border-bottom: 1px solid var(--gray-200); vertical-align: middle; }
        .admin-table tr:last-child td { border-bottom: none; }
        .admin-table tr:hover td { background: var(--gray-100); }
        @media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>
    </div>
  );
}
