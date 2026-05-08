import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, cartCount } = useApp();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          SHOP<span>MERN</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">Shop</Link>
          {user?.isAdmin && <Link to="/admin" className="nav-link">Admin</Link>}
        </div>

        <div className="navbar-actions">
          <Link to="/cart" className="cart-btn">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="user-menu">
              <button className="user-btn" onClick={() => setMenuOpen(o => !o)}>
                <span className="user-avatar">{user.name[0].toUpperCase()}</span>
                <span className="user-name">{user.name.split(' ')[0]}</span>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>
              {menuOpen && (
                <div className="dropdown">
                  <Link to="/orders" className="dropdown-item" onClick={() => setMenuOpen(false)}>My Orders</Link>
                  {user.isAdmin && <Link to="/admin/products" className="dropdown-item" onClick={() => setMenuOpen(false)}>Manage Products</Link>}
                  <div className="dropdown-divider"/>
                  <button className="dropdown-item dropdown-item-danger" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="btn btn-ghost" style={{padding:'8px 16px',fontSize:'14px'}}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{padding:'8px 16px',fontSize:'14px'}}>Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
