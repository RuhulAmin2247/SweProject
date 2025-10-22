// Firebase Connection Test (web)
// Tries to sign in first; if user not found, registers a test user.
// Returns a structured result for UI consumption.

import { registerUser, loginUser } from './auth';

export const testFirebaseConnection = async () => {
  const email = 'test@example.com';
  const password = 'test123';

  try {
    // Try sign-in first
    try {
      const signInData = await loginUser(email, password);
      return { success: true, action: 'signin', user: signInData };
    } catch (signinError) {
      // If user doesn't exist, register
      if (signinError && signinError.code === 'auth/user-not-found') {
        const registered = await registerUser(email, password, {
          name: 'Test User',
          userType: 'student',
          phone: '1234567890'
        });
        return { success: true, action: 'register', user: registered };
      }
      // Other signin error
      return { success: false, error: { code: signinError.code, message: signinError.message } };
    }
  } catch (error) {
    console.error('Full Firebase test error object:', error);
    return { success: false, error: { code: error.code, message: error.message, full: error } };
  }
};

// Expose for quick debugging in browser console
window.testFirebaseConnection = testFirebaseConnection;
