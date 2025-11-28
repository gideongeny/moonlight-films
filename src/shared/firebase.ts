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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

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
