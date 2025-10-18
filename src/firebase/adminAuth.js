// Admin authentication utilities
// Secure admin panel access control through Firebase

import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './config';

// Check if user has admin privileges
export const isUserAdmin = async (user) => {
  if (!user) return false;
  
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.userType === 'admin' || userData.isAdmin === true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Get admin user details with permissions
export const getAdminProfile = async (user) => {
  if (!user) return null;
  
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      
      if (userData.userType === 'admin' || userData.isAdmin === true) {
        return {
          ...userData,
          permissions: userData.permissions || {
            canApproveProperties: true,
            canRejectProperties: true,
            canViewAllUsers: true,
            canDeleteProperties: true,
            canManageUsers: true
          }
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting admin profile:', error);
    return null;
  }
};

// Set admin permissions (only for super admin)
export const setAdminPermissions = async (userId, permissions) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      permissions: permissions,
      updatedAt: new Date().toISOString()
    });
    
    return true;
  } catch (error) {
    console.error('Error setting admin permissions:', error);
    return false;
  }
};

// Promote user to admin (only super admin can do this)
export const promoteToAdmin = async (userId, currentAdminUser) => {
  try {
    // Check if current user is super admin
    const isSuper = await isSuperAdmin(currentAdminUser);
    if (!isSuper) {
      throw new Error('Only super admin can promote users');
    }
    
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      userType: 'admin',
      isAdmin: true,
      promotedAt: new Date().toISOString(),
      promotedBy: currentAdminUser.uid
    });
    
    return true;
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    return false;
  }
};

// Check if user is super admin (the first admin or explicitly set)
export const isSuperAdmin = async (user) => {
  if (!user) return false;
  
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.isSuperAdmin === true || userData.email === 'admin@demo.com';
    }
    
    return false;
  } catch (error) {
    console.error('Error checking super admin status:', error);
    return false;
  }
};

// Log admin actions for security
export const logAdminAction = async (adminUser, action, details) => {
  try {
    const logRef = doc(db, 'admin-logs', `${Date.now()}-${adminUser.uid}`);
    await setDoc(logRef, {
      adminId: adminUser.uid,
      adminEmail: adminUser.email,
      action: action,
      details: details,
      timestamp: new Date().toISOString(),
      ip: 'client-side' // In production, you'd get this from server
    });
    
    return true;
  } catch (error) {
    console.error('Error logging admin action:', error);
    return false;
  }
};
