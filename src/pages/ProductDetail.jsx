import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useApp } from '../context/AppContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, user } = useApp();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewMsg, setReviewMsg] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  const handleReview = async (e) => {
    e.preventDefault();
    setReviewMsg(''); setReviewError('');
    setSubmitting(true);
    try {
      await api.post(`/products/${id}/reviews`, { rating, comment });
      setReviewMsg('Review submitted!');
      setComment('');
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="spinner" />;
  if (!product) return null;

  const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

  return (
    <div className="container page">
      <button className="btn btn-ghost" style={{ marginBottom: 24, fontSize: 14 }} onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="detail-grid">
        {/* Image */}
        <div className="detail-img-wrap">
          <img src={product.image} alt={product.name} className="detail-img" />
        </div>

        {/* Info */}
        <div className="detail-info">
          <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--accent)' }}>
            {product.category} · {product.brand}
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, lineHeight: 1.15, margin: '10px 0' }}>
            {product.name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span className="stars">{stars(Math.round(product.rating))}</span>
            <span style={{ fontSize: 14, color: 'var(--gray-600)' }}>{product.rating.toFixed(1)} ({product.numReviews} reviews)</span>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, marginBottom: 16 }}>
            ${product.price}
          </div>
          <p style={{ color: 'var(--gray-600)', lineHeight: 1.7, marginBottom: 24 }}>{product.description}</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: product.stock > 0 ? 'var(--success)' : 'var(--error)', fontWeight: 600 }}>
              {product.stock > 0 ? `✓ In stock (${product.stock})` : '✗ Out of stock'}
            </span>
          </div>

          {product.stock > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 24 }}>
              <div className="qty-input">
                <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span className="qty-num">{qty}</span>
                <button className="qty-btn" onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
              </div>
              <button className="btn btn-primary" style={{ flex: 1, padding: '13px' }} onClick={handleAddToCart}>
                Add to cart
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="divider" style={{ margin: '48px 0 32px' }} />
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, marginBottom: 24 }}>
        Reviews ({product.numReviews})
      </h2>

      {product.reviews.length === 0 ? (
        <p style={{ color: 'var(--gray-600)', marginBottom: 32 }}>No reviews yet. Be the first!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
          {product.reviews.map(r => (
            <div key={r._id} style={{ padding: '20px', background: 'var(--gray-100)', borderRadius: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <strong style={{ fontSize: 15 }}>{r.name}</strong>
                <span className="stars">{stars(r.rating)}</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--gray-600)' }}>{r.comment}</p>
              <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 8 }}>
                {new Date(r.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {user ? (
        <div style={{ background: 'var(--gray-100)', borderRadius: 12, padding: 24, maxWidth: 500 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Write a review</h3>
          {reviewMsg && <div className="alert alert-success">{reviewMsg}</div>}
          {reviewError && <div className="alert alert-error">{reviewError}</div>}
          <form onSubmit={handleReview}>
            <div className="form-group">
              <label>Rating</label>
              <select className="form-control" value={rating} onChange={e => setRating(Number(e.target.value))}>
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{stars(n)} — {n} star{n!==1?'s':''}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Comment</label>
              <textarea className="form-control" rows={4} value={comment} onChange={e => setComment(e.target.value)} required style={{ resize: 'vertical' }} />
            </div>
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit review'}
            </button>
          </form>
        </div>
      ) : (
        <p style={{ color: 'var(--gray-600)', fontSize: 14 }}>
          <a href="/login" style={{ color: 'var(--black)', fontWeight: 600, textDecoration: 'underline' }}>Log in</a> to write a review.
        </p>
      )}

      <style>{`
        .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: start; }
        .detail-img-wrap { border-radius: 16px; overflow: hidden; background: var(--gray-100); aspect-ratio: 1; }
        .detail-img { width: 100%; height: 100%; object-fit: cover; }
        @media (max-width: 768px) {
          .detail-grid { grid-template-columns: 1fr; gap: 24px; }
        }
      `}</style>
    </div>
  );
}
