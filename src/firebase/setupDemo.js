// Firebase Demo Account Setup Script
// Run this once to create the demo accounts in Firebase

import { registerUser } from './auth';

export const createDemoAccounts = async () => {
  console.log('🔥 Creating demo accounts in Firebase...');
  
  const demoAccounts = [
    {
      email: 'student@demo.com',
      password: '123456',
      userData: {
        name: 'Demo Student',
        userType: 'student',
        phone: '+880 1700-000001'
      }
    },
    {
      email: 'owner@demo.com', 
      password: '123456',
      userData: {
        name: 'Demo Owner',
        userType: 'owner',
        phone: '+880 1700-000002',
        nidNumber: '1234567890123',
        address: '123 Demo Street, Rajshahi'
      }
    },
    {
      email: 'admin@demo.com',
      password: '123456', 
      userData: {
        name: 'Demo Admin',
        userType: 'admin',
        phone: '+880 1700-000003'
      }
    }
  ];

  const results = [];
  
  for (const account of demoAccounts) {
    try {
      console.log(`Creating ${account.userData.userType}: ${account.email}`);
      
      const user = await registerUser(account.email, account.password, account.userData);
      results.push({ success: true, email: account.email, user });
      
      console.log(`✅ Created ${account.userData.userType}: ${account.email}`);
      
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠️ ${account.email} already exists - skipping`);
        results.push({ success: true, email: account.email, message: 'already exists' });
      } else {
        console.error(`❌ Failed to create ${account.email}:`, error.message);
        results.push({ success: false, email: account.email, error: error.message });
      }
    }
  }
  
  console.log('🎉 Demo account setup complete!');
  return results;
};

// Export for manual testing
if (typeof window !== 'undefined') {
  window.createDemoAccounts = createDemoAccounts;
}
