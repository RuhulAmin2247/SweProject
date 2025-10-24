/*
Local helper to set admin custom claim using Firebase Admin SDK.

This script uses the service account JSON you indicated (absolute path) and sets admin:true for the provided UID.

Security: do NOT commit your service account JSON to git. Keep it private.

Usage examples:
  # recommended: run from project root
  node scripts/setAdmin.js

  # or override path/uid via args
  node scripts/setAdmin.js --key "C:\\path\\to\\serviceAccountKey.json" --uid yaK91q0y5QXkD2I5N7FTsWljGZt1

Behavior:
 - By default this script uses the absolute key path and UID you supplied when asking me to implement.
 - It will initialize firebase-admin, set custom claims { admin: true } for the UID, and exit.
*/

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Default values you provided (can be overridden with CLI args)
const DEFAULT_KEY_PATH = 'C:\\Users\\HP\\OneDrive\\Desktop\\Swftware project\\rajshahistay-app-firebase-adminsdk-fbsvc-058f90bf06.json';
const DEFAULT_UID = 'yaK91q0y5QXkD2I5N7FTsWljGZt1';
const DEFAULT_EMAIL = 'ruhulamin200327@gmail.com';

// Simple CLI arg parsing
const args = process.argv.slice(2);
let keyPath = DEFAULT_KEY_PATH;
let uid = DEFAULT_UID;
let email = DEFAULT_EMAIL;
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--key' && args[i+1]) { keyPath = args[++i]; }
  else if (a === '--uid' && args[i+1]) { uid = args[++i]; }
  else if (a === '--email' && args[i+1]) { email = args[++i]; }
  else if (a === '--help' || a === '-h') {
    console.log('Usage: node scripts/setAdmin.js [--key <keyPath>] [--uid <uid>] [--email <email>]');
    process.exit(0);
  }
}

// Resolve key path
if (!path.isAbsolute(keyPath)) keyPath = path.join(process.cwd(), keyPath);

if (!fs.existsSync(keyPath)) {
  console.error('Service account key not found at:', keyPath);
  console.error('Please download the service account JSON from Firebase Console -> Project settings -> Service accounts and place it there, or run with --key to specify its location.');
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = require(keyPath);
} catch (err) {
  console.error('Failed to load service account JSON (permission or parse error):', err.message || err);
  process.exit(1);
}

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

async function run() {
  try {
    let targetUid = uid;
    if (!targetUid && email) {
      console.log('Resolving UID from email:', email);
      const user = await admin.auth().getUserByEmail(email);
      targetUid = user.uid;
      console.log('Resolved UID:', targetUid);
    }
    if (!targetUid) {
      console.error('No target UID determined. Provide --uid or --email.');
      process.exit(1);
    }

    console.log('Setting custom claim { admin: true } for UID:', targetUid);
    await admin.auth().setCustomUserClaims(targetUid, { admin: true });
    console.log('✅ custom claim set.');
    console.log('Important: the target user must refresh their ID token (client) to see the new claim.');
  } catch (err) {
    console.error('Error setting custom claim:', err.message || err);
    process.exitCode = 1;
  } finally {
    try { await admin.app().delete(); } catch (e) {}
  }
}

run();
