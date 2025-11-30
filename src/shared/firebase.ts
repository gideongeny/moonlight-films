import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// StreamLux Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6scsYbbA4ZfFhujp_eHg83QnsGxpwEAY",
  authDomain: "streamlux-67a84.firebaseapp.com",
  projectId: "streamlux-67a84",
  storageBucket: "streamlux-67a84.firebasestorage.app",
  messagingSenderId: "242283846154",
  appId: "1:242283846154:web:c25b7416322f092cc49df3",
  measurementId: "G-3C0V66LLLR"
};

// Initialize Firebase with error handling
// Always initialize to prevent null errors - if Firebase fails, we'll handle it in components
let app: ReturnType<typeof initializeApp>;
let db: ReturnType<typeof getFirestore>;
let auth: ReturnType<typeof getAuth>;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
} catch (error) {
  console.error("Firebase initialization failed:", error);
  // If Firebase fails, try to reinitialize or use a minimal config
  // This should rarely happen, but we need to ensure the app doesn't crash
  try {
    // Try to get existing app instance
    app = initializeApp(firebaseConfig, "fallback");
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (retryError) {
    console.error("Firebase retry initialization also failed:", retryError);
    // Last resort: initialize with minimal config
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
  }
}

// Export - these should always be defined
export { db, auth };

// Set persistence to LOCAL (persists across browser sessions and app restarts)
// This ensures users stay logged in even after closing the app or restarting their phone
// browserLocalPersistence: Auth state persists in localStorage and persists across browser sessions
// IMPORTANT: Set persistence BEFORE any auth operations
(async () => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    console.log("Auth persistence set to browserLocalPersistence");
  } catch (error) {
    console.error("Error setting auth persistence:", error);
    // Don't crash - auth will still work without explicit persistence
  }
})();

// Initialize Analytics (only in browser environment)
// Optimized to prevent quota exceeded errors
let analytics: ReturnType<typeof getAnalytics> | undefined;
if (globalThis.window !== undefined) {
  try {
    // Only initialize analytics if not in development and user hasn't opted out
    const isDevelopment = process.env.NODE_ENV === 'development';
    const analyticsDisabled = localStorage.getItem('analytics_disabled') === 'true';
    
    if (!isDevelopment && !analyticsDisabled) {
      // getAnalytics only accepts the app instance as argument
      // Analytics configuration is done via Firebase Console, not in code
      analytics = getAnalytics(app);
    }
  } catch (error) {
    // Silently fail if quota exceeded or other errors
    if (error instanceof Error && error.message.includes('quota')) {
      console.warn("Analytics quota exceeded. Analytics disabled.");
      localStorage.setItem('analytics_disabled', 'true');
    } else {
      console.warn("Firebase Analytics initialization failed:", error);
    }
  }
}

export { analytics };
