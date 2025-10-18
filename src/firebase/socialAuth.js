// Optional: Social authentication (Google, Facebook)
// This is NOT required but adds convenience for users

import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';

// Google Sign-In
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user document exists
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // Create user document for new social login users
      await setDoc(userDocRef, {
        uid: user.uid,
        name: user.displayName || 'Google User',
        email: user.email,
        userType: 'student', // default
        phone: '',
        createdAt: new Date().toISOString(),
        provider: 'google'
      });
    }

    const userData = userDoc.exists() ? userDoc.data() : {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      userType: 'student',
      phone: '',
      provider: 'google'
    };

    return userData;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

// Facebook Sign-In (similar pattern)
export const signInWithFacebook = async () => {
  try {
    const provider = new FacebookAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Similar logic as Google...
    return {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      userType: 'student',
      provider: 'facebook'
    };
  } catch (error) {
    console.error('Facebook sign-in error:', error);
    throw error;
  }
};
