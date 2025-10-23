import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { sendEmailVerification as firebaseSendEmailVerification } from 'firebase/auth';

// Register a new user
export const registerUser = async (email, password, userData) => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile with display name
    await updateProfile(user, {
      displayName: userData.name
    });

    // Send verification email
    try {
      const continueUrl = (typeof window !== 'undefined' && window.location ? window.location.origin : '') + '/verify-email';
      await firebaseSendEmailVerification(user, { url: continueUrl, handleCodeInApp: true });
    } catch (ve) {
      console.warn('Failed to send verification email:', ve);
    }

    // Store additional user data in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      uid: user.uid,
      name: userData.name,
      email: email,
      userType: userData.userType,
      phone: userData.phone || '',
      createdAt: new Date().toISOString(),
      // Only store additional fields for property owners
      ...(userData.userType === 'owner' && {
        nidNumber: userData.nidNumber,
        address: userData.address
      })
    });

    // Sign the user out so they cannot access the app until they verify their email
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Failed to sign out after registration:', e);
    }

    return {
      uid: user.uid,
      email: user.email,
      name: userData.name,
      userType: userData.userType,
      phone: userData.phone,
      ...(userData.userType === 'owner' && {
        nidNumber: userData.nidNumber,
        address: userData.address
      })
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Resend verification email for a user
export const resendVerificationEmail = async (user) => {
  try {
    if (!user) throw new Error('No user provided');
    const continueUrl = (typeof window !== 'undefined' && window.location ? window.location.origin : '') + '/verify-email';
    await firebaseSendEmailVerification(user, { url: continueUrl, handleCodeInApp: true });
    return { success: true };
  } catch (error) {
    console.error('Resend verification error:', error);
    throw error;
  }
};

// Helper to check whether the current Firebase user has verified their email
export const isEmailVerified = (user) => {
  return !!(user && user.emailVerified);
};

// Sign in existing user
export const loginUser = async (email, password) => {
  try {
    // Dev-only admin override: enable by setting REACT_APP_DEV_ADMIN=true in .env
    // WARNING: This is insecure and MUST NOT be used in production. It's provided
    // as a convenience so you can log in locally as the admin without creating
    // a Firebase user. To enable, create a .env file with:
    // REACT_APP_DEV_ADMIN=true
    // Use credentials: admin@gmail.com / 123456
    if (process.env.REACT_APP_DEV_ADMIN === 'true') {
      const DEV_ADMIN_EMAIL = 'admin@gmail.com';
      const DEV_ADMIN_PASSWORD = '123456';
      if (email === DEV_ADMIN_EMAIL && password === DEV_ADMIN_PASSWORD) {
        // Return a fake admin user object compatible with the rest of the app
        return {
          uid: 'dev-admin',
          email: DEV_ADMIN_EMAIL,
          name: 'Local Admin',
          userType: 'owner',
          phone: ''
        };
      }
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Ensure the user has verified their email before proceeding
    if (!user.emailVerified) {
      // Include the firebase user so caller can resend verification if needed
      const err = new Error('Email not verified');
      err.code = 'auth/email-not-verified';
      err.user = user;
      throw err;
    }

    // Get additional user data from Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        uid: user.uid,
        email: user.email,
        name: userData.name || user.displayName,
        userType: userData.userType,
        phone: userData.phone,
        ...(userData.userType === 'owner' && {
          nidNumber: userData.nidNumber,
          address: userData.address
        })
      };
    } else {
      // Fallback if no Firestore document exists
      return {
        uid: user.uid,
        email: user.email,
        name: user.displayName || email.split('@')[0],
        userType: 'student', // default
        phone: ''
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Sign out user
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Send password reset email
export const sendResetEmail = async (email) => {
  try {
    // Build an actionCodeSettings object so the email link redirects back to
    // the app's reset page. This makes the link open the SPA and allows
    // the user to complete the password reset inside the app.
    // Ensure the domain (localhost or your hosting domain) is added to
    // Firebase Console > Authentication > Authorized domains.
    const continueUrl = (typeof window !== 'undefined' && window.location ? window.location.origin : '') + '/reset-password';
    const actionCodeSettings = {
      // The URL the user will be redirected to after clicking the reset link
      url: continueUrl,
      // This must be true to handle the code in the app
      handleCodeInApp: true
    };

    await sendPasswordResetEmail(auth, email, actionCodeSettings);
    return { success: true };
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

// Listen to authentication state changes
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // If the user's email is not verified, treat them as signed out so they
      // cannot access the application until verification completes.
      if (!user.emailVerified) {
        callback(null);
        return;
      }
      // User is signed in, get additional data from Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        callback({
          uid: user.uid,
          email: user.email,
          name: userData.name || user.displayName,
          userType: userData.userType,
          phone: userData.phone,
          ...(userData.userType === 'owner' && {
            nidNumber: userData.nidNumber,
            address: userData.address
          })
        });
      } else {
        callback({
          uid: user.uid,
          email: user.email,
          name: user.displayName || user.email.split('@')[0],
          userType: 'student',
          phone: ''
        });
      }
    } else {
      // User is signed out
      callback(null);
    }
  });
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Firebase Auth error codes translation
export const getAuthErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No user found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/email-not-verified':
      return 'Your email address is not verified. Please check your inbox.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    default:
      return 'An error occurred. Please try again.';
  }
};
