import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const EMPTY = { name: '', description: '', price: '', image: '', category: '', brand: '', stock: '' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetch = () => {
    api.get('/products').then(({ data }) => setProducts(data)).finally(() => setLoading(false));
  };

  useEffect(fetch, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setError(''); setShowForm(true); };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({ name: p.name, description: p.description, price: p.price, image: p.image, category: p.category, brand: p.brand, stock: p.stock });
    setError(''); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    fetch();
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (editing) await api.put(`/products/${editing}`, payload);
      else await api.post('/products', payload);
      setShowForm(false);
      fetch();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="container page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <Link to="/admin" style={{ fontSize: 14, color: 'var(--gray-600)' }}>← Admin Dashboard</Link>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, marginTop: 8 }}>Products</h1>
        </div>
        <button className="btn btn-accent" onClick={openNew}>+ Add product</button>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>{editing ? 'Edit product' : 'New product'}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', fontSize: 22, color: 'var(--gray-600)' }}>✕</button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product name</label>
                <input className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>Price ($)</label>
                  <input className="form-control" type="number" min="0" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input className="form-control" type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input className="form-control" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required />
                </div>
              </div>
              <div className="form-group">
                <label>Brand</label>
                <input className="form-control" value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input className="form-control" type="url" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} required placeholder="https://..." />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button className="btn btn-primary" type="submit" disabled={saving} style={{ flex: 1, padding: 13 }}>
                  {saving ? 'Saving…' : editing ? 'Update product' : 'Create product'}
                </button>
                <button className="btn btn-ghost" type="button" onClick={() => setShowForm(false)} style={{ padding: 13 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products table */}
      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img src={p.image} alt={p.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-600)' }}>{p.brand}</div>
                    </div>
                  </div>
                </td>
                <td><span className="badge badge-dark">{p.category}</span></td>
                <td style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>${p.price}</td>
                <td>
                  <span className={`badge ${p.stock > 0 ? 'badge-success' : 'badge-error'}`}>
                    {p.stock > 0 ? p.stock : 'Out'}
                  </span>
                </td>
                <td style={{ fontSize: 13 }}>⭐ {p.rating.toFixed(1)} ({p.numReviews})</td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-ghost" style={{ padding: '6px 14px', fontSize: 13 }} onClick={() => openEdit(p)}>Edit</button>
                    <button className="btn" style={{ padding: '6px 14px', fontSize: 13, background: '#fee2e2', color: 'var(--error)' }} onClick={() => handleDelete(p._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .admin-table { width: 100%; border-collapse: collapse; font-size: 14px; }
        .admin-table th {
          text-align: left; padding: 12px 16px; border-bottom: 2px solid var(--gray-200);
          font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--gray-600); font-weight: 600;
        }
        .admin-table td { padding: 14px 16px; border-bottom: 1px solid var(--gray-200); vertical-align: middle; }
        .admin-table tr:last-child td { border-bottom: none; }
        .admin-table tr:hover td { background: var(--gray-100); }

        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.5);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 16px;
        }
        .modal-box {
          background: var(--white); border-radius: 16px; padding: 32px;
          width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto;
          animation: fadeDown 0.2s ease;
        }
      `}</style>
    </div>
  );
}
