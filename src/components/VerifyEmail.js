import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { applyActionCode } from 'firebase/auth';
import { auth } from '../firebase/config';
import './VerifyEmail.css';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get('oobCode');
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!oobCode) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }

    applyActionCode(auth, oobCode)
      .then(() => {
        setStatus('success');
        setMessage('Your email has been verified. You can now sign in.');
        // Refresh user if signed in to reflect new verified state
        if (auth.currentUser && typeof auth.currentUser.reload === 'function') {
          auth.currentUser.reload().catch(() => {});
        }
        // Redirect home/login after a short delay
        setTimeout(() => navigate('/'), 2500);
      })
      .catch((err) => {
        console.error('applyActionCode error', err);
        setStatus('error');
        setMessage('Unable to verify this link. It may be expired or already used.');
      });
  }, [oobCode, navigate]);

  return (
    <div className="verify-page">
      <div className="verify-card">
        <h2>Email Verification</h2>
        {status === 'verifying' && <p>Verifying your email...</p>}
        {status === 'success' && <div className="verify-success">{message}</div>}
        {status === 'error' && <div className="verify-error">{message}</div>}
      </div>
    </div>
  );
};

export default VerifyEmail;
