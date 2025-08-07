// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v9-compat or v9+
// Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAf06xaR14yHFqQBnwTHeS2qWnDYDVEIjA",
  authDomain: "rajshahistay-app.firebaseapp.com",
  projectId: "rajshahistay-app",
  storageBucket: "rajshahistay-app.firebasestorage.app",
  messagingSenderId: "780561202697",
  appId: "1:780561202697:web:f705e9354a69d956d142d8",
  measurementId: "G-W251WCGPWH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
