# Firebase Setup Guide for RajshahiStay

## 🔥 **Step 1: Create Firebase Project**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name (e.g., "rajshahistay-app")
4. Continue through the setup wizard
5. Enable Google Analytics (optional)

## 🔥 **Step 2: Enable Authentication**

1. In your Firebase project dashboard:
   - Click "Authentication" in the left sidebar
   - Go to "Sign-in method" tab
   - Click "Email/Password"
   - Enable the first option (Email/Password)
   - Save

## 🔥 **Step 3: Setup Firestore Database**

1. Click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (closest to your users)
5. Leave Database ID as `(default)`
6. Done

## 🛡️ **Step 3.1: Update Firestore Rules (Important!)**

After creating the database, you need to update the security rules:

1. In Firestore Database, click the "Rules" tab
2. Replace the default rules with this (for development):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // Development only - allows everything
    }
  }
}
```

3. Click "Publish"

⚠️ **Important**: The default `if false` rule blocks everything - your app won't work without changing this!

## 🔥 **Step 4: Get Your Firebase Config + Enable Hosting**

1. Click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps"
4. Click "Add app" → Web icon (</>)
5. Register your app with a nickname (e.g., "rajshahistay-web")
6. ✅ **Also set up Firebase Hosting** (check this option)
7. Copy the firebaseConfig object

## 🔥 **Step 5: Update Your Config File**

Replace the placeholder values in `src/firebase/config.js` with your actual config:

```javascript
const firebaseConfig = {
  apiKey: "AIza...", // Your actual API key
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

## 🔥 **Step 6: Create Admin User**

After setting up, you can create an admin user by:

1. Registering normally through your app
2. Going to Firestore Database
3. Finding your user document in the `users` collection
4. Editing the document to change `userType` from "student" to "admin"

## 🎯 **Step 6.1: Demo Accounts (Hidden)**

Your app will automatically create these test accounts on first load:
- **Student**: `student@demo.com` / `123456`
- **Owner**: `owner@demo.com` / `123456`  
- **Admin**: `admin@demo.com` / `123456`

These accounts work for testing but **don't appear on the login page** for a clean user experience.

## 🌐 **Step 7: Setup Firebase Hosting (Deploy Your App)**

### **7.1: Enable Hosting in Firebase Console**

1. In Firebase Console, click "Hosting" in the left sidebar
2. Click "Get started"
3. Follow the setup wizard (we'll use CLI method below)

### **7.2: Install Firebase CLI**

**✅ Use npx (No installation required - Recommended):**
```bash
npx firebase-tools --version
```

**Option B - Global install (if you prefer):**
```bash
npm install -g firebase-tools
```

### **7.3: Login to Firebase**

```bash
npx firebase-tools login
```

This will open your browser to sign in to Firebase.

### **7.4: Initialize Firebase in Your Project**

In your project directory (`my-react-app`), run:

```bash
firebase init hosting
# OR if using npx:
npx firebase-tools init hosting
```

**🔍 The following options will appear in your TERMINAL (not web browser):**

When you run the command above, your terminal will show these interactive prompts:

```
? Are you ready to proceed? (Y/n) → Press Y

? Which Firebase features do you want to set up?
→ Choose: ◉ Hosting: Configure files for Firebase Hosting and (optionally) set up GitHub Action deploys

? Please select an option:
→ Choose: ◉ Use an existing project

? Select a default Firebase project for this directory:
→ Choose: rajshahistay-app (or your project name)

? What do you want to use as your public directory? (public)
→ Type: build (NOT public!)

? Configure as a single-page app (rewrite all urls to /index.html)? (y/N)
→ Type: y (Yes)

? Set up automatic builds and deploys with GitHub? (y/N)
→ Type: N (No, for now)

? File build/index.html already exists. Overwrite? (y/N)
→ Type: N (No)
```

**📍 These are TERMINAL prompts, not web interface options!**

### **7.5: Build and Deploy Your App**

```bash
# 1. Build the React app for production
npm run build

# 2. Deploy to Firebase Hosting
firebase deploy --only hosting
# OR if using npx:
npx firebase-tools deploy --only hosting
```

### **7.6: Your App is Live! 🎉**

After deployment, you'll get:
- **Live URL**: `https://your-project-id.web.app`
- **Alt URL**: `https://your-project-id.firebaseapp.com`

### **7.7: Set Up Custom Domain (Optional)**

1. In Firebase Console → Hosting
2. Click "Add custom domain"
3. Follow the DNS setup instructions
4. Your app will be live at your custom domain!

## 🚀 **Quick Deploy Commands (Save These!)**

```bash
# Full deployment (after making changes)
npm run build && firebase deploy --only hosting

# Check deployment status
firebase hosting:sites:list

# View your live app
firebase open hosting:site
```

## 🛡️ **Security Rules (Optional - for Production)**

For production, update Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Other rules for your app data
  }
}
```

## ✅ **What's Already Implemented**

- ✅ Email/Password Registration
- ✅ Email/Password Login
- ✅ User data storage in Firestore
- ✅ Authentication state management
- ✅ Automatic login persistence
- ✅ User type handling (student/owner)
- ✅ Admin panel access control
- ✅ Error handling and user feedback

## 🎯 **Features Working Now**

1. **Registration**: Users can register as Student or Property Owner
2. **Login**: Users login with email/password (no more demo accounts)
3. **User Persistence**: Login state persists on page refresh
4. **Protected Actions**: Booking and publishing require authentication
5. **Admin Access**: Create admin users by changing userType in Firestore
6. **User Profile**: Name, email, phone stored in Firestore
7. **Owner Data**: NID and address stored for property owners

Your app now has **real Firebase authentication** instead of mock login!
