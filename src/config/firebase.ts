
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAfb7gQUInf_Ax8nkWjPnjbSvHECG8DvOQ",
  authDomain: "permitdraftpro.firebaseapp.com",
  projectId: "permitdraftpro",
  storageBucket: "permitdraftpro.appspot.com",
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

export default app;
