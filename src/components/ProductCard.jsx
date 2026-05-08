import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ProductCard({ product }) {
  const { addToCart } = useApp();

  const stars = '★'.repeat(Math.round(product.rating)) + '☆'.repeat(5 - Math.round(product.rating));

  return (
    <div className="card product-card">
      <Link to={`/product/${product._id}`} className="product-img-wrap">
        <img src={product.image} alt={product.name} className="product-img" />
        {product.stock === 0 && (
          <div className="out-of-stock-overlay">Out of stock</div>
        )}
      </Link>
      <div className="product-card-body">
        <div className="product-category">{product.category}</div>
        <Link to={`/product/${product._id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <div className="product-meta">
          <span className="stars">{stars}</span>
          <span style={{ fontSize: 12, color: 'var(--gray-600)' }}>({product.numReviews})</span>
        </div>
        <div className="product-footer">
          <span className="product-price">${product.price}</span>
          <button
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: 13 }}
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
