import React, { useState } from 'react';
import { registerUser, getAuthErrorMessage } from '../firebase/auth';
import './Register.css';

const Register = ({ onRegister, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    userType: 'student',
    nidNumber: '', // For owners
    address: '' // For owners
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[+]?[\d\s-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Additional validation for owners
    if (formData.userType === 'owner') {
      if (!formData.nidNumber) {
        newErrors.nidNumber = 'NID number is required for property owners';
      } else if (formData.nidNumber.length < 10) {
        newErrors.nidNumber = 'Please enter a valid NID number';
      }

      if (!formData.address) {
        newErrors.address = 'Address is required for property owners';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Register user with Firebase
      const userData = await registerUser(formData.email, formData.password, {
        name: formData.name,
        userType: formData.userType,
        phone: formData.phone,
        ...(formData.userType === 'owner' && {
          nidNumber: formData.nidNumber,
          address: formData.address
        })
      });
      
      // Call the parent component's onRegister function
      onRegister(userData);
      
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ 
        general: getAuthErrorMessage(error.code),
        code: error.code
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-overlay">
      <div className="register-container">
        <div className="register-header">
          <h2>Join RajshahiStay</h2>
          <p>Create your account to get started</p>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {errors.general && (
            <div className="error-message general-error">
              <div>{errors.general}</div>
              {errors.code && (
                <div style={{ fontSize: 12, color: '#a00', marginTop: 6 }}>Error code: {errors.code}</div>
              )}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="userType">I am a:</label>
            <div className="user-type-tabs">
              <button
                type="button"
                className={`user-type-btn ${formData.userType === 'student' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, userType: 'student' })}
              >
                🎓 Student
              </button>
              <button
                type="button"
                className={`user-type-btn ${formData.userType === 'owner' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, userType: 'owner' })}
              >
                🏠 Property Owner
              </button>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="e.g., +880 1711-123456"
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a password"
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          </div>

          {formData.userType === 'owner' && (
            <>
              <div className="owner-section-header">
                <h4>🏠 Property Owner Information</h4>
                <p>Additional details required for property owners</p>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nidNumber">NID Number *</label>
                  <input
                    type="text"
                    id="nidNumber"
                    name="nidNumber"
                    value={formData.nidNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., 1234567890123"
                    className={errors.nidNumber ? 'error' : ''}
                  />
                  {errors.nidNumber && <span className="error-message">{errors.nidNumber}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">Address *</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your full address"
                  className={errors.address ? 'error' : ''}
                  rows="3"
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>
            </>
          )}

          <div className="terms-section">
            <p>
              By creating an account, you agree to our{' '}
              <button type="button" className="terms-link">Terms of Service</button>
              {' '}and{' '}
              <button type="button" className="terms-link">Privacy Policy</button>
            </p>
          </div>

          <button 
            type="submit" 
            className="register-btn-submit"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="register-footer">
            <p>
              Already have an account? 
              <button 
                type="button" 
                className="link-btn"
                onClick={onSwitchToLogin}
              >
                Sign in here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
