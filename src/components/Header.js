import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ onAdminClick, currentUser, isAdmin, onLogin, onLogout }) => {
  const navigate = useNavigate();

  const handleNav = (path) => {
    if (!currentUser) {
      // redirect to login and return to requested path after login
      window.location.href = `/login?returnTo=${encodeURIComponent(path)}`;
      return;
    }
    navigate(path);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h2>🏠 RajshahiStay</h2>
          <span>Student Accommodation</span>
        </div>
        <nav className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link" onClick={(e) => { e.preventDefault(); handleNav('/about'); }}>About</Link>
          <Link to="/contact" className="nav-link" onClick={(e) => { e.preventDefault(); handleNav('/contact'); }}>Contact</Link>
          {isAdmin && (
            <button className="admin-btn" onClick={onAdminClick}>
              🔒 Admin Panel
            </button>
          )}
          {currentUser ? (
            <div className="user-menu">
              <button className="welcome-text link-like" onClick={() => navigate('/profile')}>{currentUser.name || currentUser.email}</button>
              <button className="logout-btn" onClick={onLogout}>Logout</button>
            </div>
          ) : (
            <button className="login-btn" onClick={onLogin}>Login</button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
