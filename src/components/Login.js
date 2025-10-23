import React, { useState } from 'react';
import { loginUser, getAuthErrorMessage, sendResetEmail } from '../firebase/auth';
import './Login.css';

const Login = ({ onLogin, onClose, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [infoMessage, setInfoMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    // Clear info messages when user edits inputs
    if (infoMessage) setInfoMessage('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Login user with Firebase
      const userData = await loginUser(formData.email, formData.password);
      
      // Call the parent component's onLogin function
      onLogin(userData);
      
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ 
        general: getAuthErrorMessage(error.code),
        code: error.code
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setErrors({ ...errors, email: 'Enter your email to reset password' });
      return;
    }

    try {
      await sendResetEmail(formData.email);
      setInfoMessage('Password reset email sent. Check your inbox.');
    } catch (error) {
      console.error('Reset error:', error);
      // Special case: dev admin credentials
      if (process.env.REACT_APP_DEV_ADMIN === 'true' && formData.email === 'admin@gmail.com') {
        setInfoMessage('This is the local dev admin account. Use admin@gmail.com / 123456 to sign in locally.');
      } else {
        setErrors({ general: getAuthErrorMessage(error.code || error.message), code: error.code });
      }
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-container">
        <div className="login-header">
          <h2>Welcome Back!</h2>
          <p>Sign in to your RajshahiStay account</p>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {errors.general && (
            <div className="error-message general-error">
              <div>{errors.general}</div>
              {errors.code && (
                <div style={{ fontSize: 12, color: '#a00', marginTop: 6 }}>Error code: {errors.code}</div>
              )}
            </div>
          )}

            {infoMessage && (
              <div className="info-message" role="status">
                {infoMessage}
              </div>
            )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <button 
            type="submit" 
            className="login-btn-submit"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="login-footer">
            <p>
              Don't have an account? 
              <button 
                type="button" 
                className="link-btn"
                onClick={onSwitchToRegister}
              >
                Register here
              </button>
            </p>
            <button type="button" className="forgot-password" onClick={handleForgotPassword}>
              Forgot Password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
