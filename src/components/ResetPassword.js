import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '../firebase/config';
import './ResetPassword.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get('oobCode');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [verifying, setVerifying] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!oobCode) {
      setError('Invalid or missing password reset code.');
      setVerifying(false);
      return;
    }

    // Verify the code and get the email
    verifyPasswordResetCode(auth, oobCode)
      .then((emailFromCode) => {
        setEmail(emailFromCode);
        setVerifying(false);
      })
      .catch((err) => {
        console.error('verifyPasswordResetCode error', err);
        setError('The password reset link is invalid or expired.');
        setVerifying(false);
      });
  }, [oobCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setInfo('Password has been reset successfully. You can now sign in.');
      // Optionally redirect to login after short delay
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error('confirmPasswordReset error', err);
      setError('Unable to reset password. The link may have expired.');
    }
  };

  return (
    <div className="reset-page">
      <div className="reset-card">
        <h2>Reset Password</h2>
        {verifying ? (
          <p>Verifying link...</p>
        ) : (
          <>
            {error && <div className="reset-error">{error}</div>}
            {info && <div className="reset-info">{info}</div>}
            {!error && (
              <form onSubmit={handleSubmit} className="reset-form">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={email} readOnly />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password (min 6 chars)" />
                </div>
                <button type="submit" className="reset-btn">Set New Password</button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
