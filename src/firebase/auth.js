import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';

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

// Sign in existing user
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

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

// Listen to authentication state changes
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
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
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    default:
      return 'An error occurred. Please try again.';
  }
};
