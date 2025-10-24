import React, { useState } from 'react';
import { testFirebaseConnection } from '../firebase/test';
import { auth } from '../firebase/config';
import { getIdTokenResult } from 'firebase/auth';

export default function FirebaseDebug() {
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);

  const runTest = async () => {
    setRunning(true);
    try {
      const res = await testFirebaseConnection();
      console.log('Firebase debug result:', res);
      setResult(res);
    } catch (e) {
      setResult({ error: e.message || String(e) });
    } finally {
      setRunning(false);
    }
  };

  const checkTokenClaims = async () => {
    setRunning(true);
    try {
      if (!auth || !auth.currentUser) {
        setResult({ error: 'No authenticated user (sign in first).' });
        return;
      }
      // Force token refresh so custom claims are present
      await auth.currentUser.getIdToken(true);
      const idRes = await getIdTokenResult(auth.currentUser);
      setResult({ tokenClaims: idRes.claims });
    } catch (e) {
      setResult({ error: e.message || String(e) });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Firebase Debug</h2>
      <p>Run a test registration to verify Firebase connectivity and auth setup.</p>
      <button onClick={runTest} disabled={running}>
        {running ? 'Running...' : 'Run Firebase Test'}
      </button>

      <div style={{ marginTop: 12 }}>
        <button onClick={checkTokenClaims} disabled={running}>
          {running ? 'Checking...' : 'Check auth token claims'}
        </button>
      </div>

      {result && (
        <div style={{ marginTop: 20 }}>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(result, null, 2)}</pre>
          {!result.success && (
            <div style={{ marginTop: 10, color: '#a00' }}>
              <p>Common fixes:</p>
              <ul>
                <li>Enable Email/Password sign-in in Firebase Console → Authentication → Sign-in method.</li>
                <li>Check `src/firebase/config.js` values match your Firebase project.</li>
                <li>Ensure Firestore rules allow writes for testing or set proper rules in Console.</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
