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
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting auth persistence:", error);
});

// Initialize Analytics (only in browser environment)
let analytics: ReturnType<typeof getAnalytics> | undefined;
if (typeof globalThis.window !== "undefined") {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn("Firebase Analytics initialization failed:", error);
  }
}

export { analytics };
