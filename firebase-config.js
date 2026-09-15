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
  apiKey: "AIzaSyBvOHtd-MTsuPxFvUTyOslQJ_p2rkpkDjU",
  authDomain: "mits-club-hub.firebaseapp.com",
  projectId: "mits-club-hub",
  storageBucket: "mits-club-hub.firebasestorage.app",
  messagingSenderId: "508903698315",
  appId: "1:508903698315:web:018d57ed9ad53b1f42098e",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// Email domains allowed to log in (Official college domain + Gmail for dev testing)
const ALLOWED_DOMAINS = ["@mitsgwl.ac.in", "@gmail.com"];
const ALLOWED_DOMAIN = ""; // empty so it does not restrict to a single domain
