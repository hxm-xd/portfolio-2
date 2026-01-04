import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyDHaifA3AfT3Tgro1_fHTUq7PulGkvmcqs",
  authDomain: "portfolio-78d64.firebaseapp.com",
  projectId: "portfolio-78d64",
  storageBucket: "portfolio-78d64.firebasestorage.app",
  messagingSenderId: "474116055510",
  appId: "1:474116055510:web:471a852faddd419d61c477",
  measurementId: "G-7XY7377L4E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Make available globally for existing scripts
window.auth = auth;
window.db = db;

export { app, auth, db, analytics };