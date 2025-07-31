
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAfb7gQUInf_Ax8nkWjPnjbSvHECG8DvOQ",
  authDomain: "permitdraftpro.firebaseapp.com",
  projectId: "permitdraftpro",
  storageBucket: "permitdraftpro.firebasestorage.app",
  messagingSenderId: "814185624643",
  appId: "1:814185624643:web:7c4bc80a538428a8ec10f6",
  measurementId: "G-4KHXPL1804"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Initialize Apple Auth Provider
export const appleProvider = new OAuthProvider('apple.com');

// Add improved error handling for storage operations
export const handleStorageError = (error: any) => {
  console.error("Firebase Storage Error:", error);
  
  if (error.code === 'storage/unauthorized') {
    console.log("Unauthorized access to Firebase Storage. Check your security rules.");
    return { type: 'unauthorized', message: 'Unauthorized access to storage' };
  }
  
  if (error.message && error.message.includes('CORS')) {
    console.log("CORS policy error detected. Your Firebase Storage CORS configuration is working now!");
    return { type: 'cors', message: 'CORS policy error' };
  }
  
  if (error.code === 'storage/unknown') {
    console.log("Unknown storage error. This might be related to network issues or CORS.");
    return { type: 'unknown', message: 'Unknown storage error' };
  }
  
  return { type: 'general', message: error.message || 'Storage operation failed' };
};

export default app;
