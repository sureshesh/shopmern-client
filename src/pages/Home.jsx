import { useState, useEffect } from 'react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import '../components/ProductCard.css';

const CATEGORIES = ['All', 'Electronics', 'Footwear', 'Fashion'];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search) params.keyword = search;
        if (category !== 'All') params.category = category;
        const { data } = await api.get('/products', { params });
        setProducts(data);
      } catch {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [search, category]);

  return (
    <div>
      {/* Hero */}
      <div className="hero">
        <div className="container">
          <div className="hero-content">
            <span className="badge badge-accent" style={{ marginBottom: 16 }}>New arrivals</span>
            <h1 className="hero-title">Shop the best.<br />Built with MERN.</h1>
            <p className="hero-sub">A full-stack e-commerce experience — React, Node, Express, MongoDB.</p>
          </div>
        </div>
      </div>

      <div className="container page">
        {/* Filters */}
        <div className="filters-bar">
          <div className="search-wrap">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="search-icon">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              className="search-input"
              placeholder="Search products…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="category-tabs">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`cat-tab ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="spinner" />
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h3>No products found</h3>
            <p>Try a different search or category</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 20, color: 'var(--gray-600)', fontSize: 14 }}>
              {products.length} product{products.length !== 1 ? 's' : ''}
            </div>
            <div className="products-grid">
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </>
        )}
      </div>

      <style>{`
        .hero {
          background: var(--black); color: var(--white);
          padding: 80px 0 80px; position: relative; overflow: hidden;
        }
        .hero::before {
          content: ''; position: absolute; right: -100px; top: -100px;
          width: 500px; height: 500px; border-radius: 50%;
          background: var(--accent); opacity: 0.08;
        }
        .hero-content { max-width: 560px; position: relative; }
        .hero-title {
          font-family: var(--font-display); font-size: clamp(36px, 5vw, 64px);
          font-weight: 800; line-height: 1.05; margin-bottom: 16px; letter-spacing: -1px;
        }
        .hero-sub { font-size: 17px; color: rgba(255,255,255,0.6); line-height: 1.6; }

        .filters-bar {
          display: flex; gap: 16px; align-items: center; margin-bottom: 32px;
          flex-wrap: wrap;
        }
        .search-wrap {
          position: relative; flex: 1; min-width: 200px;
        }
        .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--gray-400); }
        .search-input {
          width: 100%; padding: 11px 16px 11px 42px;
          border: 1.5px solid var(--gray-200); border-radius: var(--radius);
          font-size: 15px; background: var(--white); transition: border-color 0.2s;
        }
        .search-input:focus { outline: none; border-color: var(--black); }
        .category-tabs { display: flex; gap: 6px; flex-wrap: wrap; }
        .cat-tab {
          padding: 8px 16px; border-radius: 100px; font-size: 14px; font-weight: 500;
          background: var(--gray-100); color: var(--gray-600); transition: all 0.15s;
        }
        .cat-tab:hover { background: var(--gray-200); color: var(--black); }
        .cat-tab.active { background: var(--black); color: var(--white); }
      `}</style>
    </div>
  );
}
