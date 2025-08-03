import React from 'react';
import './Header.css';

const Header = ({ onAdminClick }) => {
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
          <button className="admin-btn" onClick={onAdminClick}>
            Admin
          </button>
          <button className="login-btn">Login</button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
