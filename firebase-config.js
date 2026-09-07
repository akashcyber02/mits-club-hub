/*
  FIREBASE CONFIG
  ----------------
  1. Go to https://console.firebase.google.com
  2. Create a new project (e.g. "mits-club-hub")
  3. Click the Web (</>) icon to register a web app
  4. Copy the config object Firebase gives you and paste it below
  5. In Firebase Console:
     - Authentication > Sign-in method > enable "Google"
     - Firestore Database > Create database (start in test mode for now)
*/

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// Only these email domains are allowed to log in
const ALLOWED_DOMAIN = "@mitsgwl.ac.in";
