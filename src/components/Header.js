import React from 'react';
import './Header.css';

const Header = ({ onAdminClick, currentUser, onLogin, onLogout }) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h2>🏠 RajshahiStay</h2>
          <span>Student Accommodation</span>
        </div>
        <nav className="nav-menu">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          {currentUser && currentUser.userType === 'admin' && (
            <button className="admin-btn" onClick={onAdminClick}>
              Admin Panel
            </button>
          )}
          {currentUser ? (
            <div className="user-menu">
              <span className="welcome-text">
                Welcome, {currentUser.name || currentUser.email}
              </span>
              <button className="logout-btn" onClick={onLogout}>
                Logout
              </button>
            </div>
          ) : (
            <button className="login-btn" onClick={onLogin}>
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
