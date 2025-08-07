// Firebase Connection Test
// Open this in your browser console to test Firebase

import { registerUser } from '../firebase/auth';

// Test function
export const testFirebaseConnection = async () => {
  try {
    console.log('🔥 Testing Firebase connection...');
    
    // Try to register a test user
    const testData = await registerUser('test@example.com', 'test123', {
      name: 'Test User',
      userType: 'student',
      phone: '1234567890'
    });
    
    console.log('✅ Firebase connection successful!', testData);
    return testData;
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    return { error: error.message };
  }
};

// Call this function in browser console: testFirebaseConnection()
window.testFirebaseConnection = testFirebaseConnection;
