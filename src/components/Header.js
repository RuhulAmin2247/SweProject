import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ onAdminClick, currentUser, isAdmin, onLogin, onLogout }) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h2>🏠 RajshahiStay</h2>
          <span>Student Accommodation</span>
        </div>
        <nav className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          {isAdmin && (
            <button className="admin-btn" onClick={onAdminClick}>
              🔒 Admin Panel
            </button>
          )}
          {currentUser ? (
            <div className="user-menu">
              <Link to="/profile" className="welcome-text">{currentUser.name || currentUser.email}</Link>
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
