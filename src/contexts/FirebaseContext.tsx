import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  updateProfile,
  browserLocalPersistence,
  setPersistence,
  signInWithPopup
} from 'firebase/auth';
import { auth, googleProvider, appleProvider, db } from '@/config/firebase'; // Added db
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'; // Added Firestore functions

interface FirebaseContextType {
  currentUser: User | null;
  isLoading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<User>;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<User>;
  signInWithApple: () => Promise<User>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to manage user profile in Firestore
  const manageUserProfile = async (user: User) => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);

    try {
      if (!docSnap.exists()) {
        // New user
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || '', // Ensure displayName is not null
          photoURL: user.photoURL || '',     // Ensure photoURL is not null
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
          // You can add any other app-specific default fields here
          // e.g., roles: ['user'], preferences: {}, etc.
        };
        await setDoc(userRef, userData);
        console.log("Created user profile in Firestore for:", user.uid);
      } else {
        // Existing user, update last login and potentially other details
        await setDoc(userRef, {
          displayName: user.displayName || docSnap.data()?.displayName || '', // Keep existing if new is null
          photoURL: user.photoURL || docSnap.data()?.photoURL || '',         // Keep existing if new is null
          email: user.email, // Email can also be updated if changed in provider
          lastLoginAt: serverTimestamp()
        }, { merge: true });
        console.log("Updated user profile in Firestore for:", user.uid);
      }
    } catch (error) {
      console.error("Error managing user profile in Firestore:", error);
      // Potentially re-throw or handle as needed for the app's error strategy
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName: string): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile with display name
    if (userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName
      });
    }
    
    return userCredential.user;
  };

  const signIn = async (email: string, password: string): Promise<User> => {
    // Set persistence to LOCAL to maintain state across page refreshes
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  const signOut = async (): Promise<void> => {
    await firebaseSignOut(auth);
  };

  const signInWithGoogle = async (): Promise<User> => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      if (userCredential.user) {
        await manageUserProfile(userCredential.user); // Manage profile in Firestore
        console.log("Google sign-in successful, user profile managed:", userCredential.user);
      }
      return userCredential.user;
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error; 
    }
  };

  const signInWithApple = async (): Promise<User> => {
    try {
      const userCredential = await signInWithPopup(auth, appleProvider);
      if (userCredential.user) {
        await manageUserProfile(userCredential.user); // Manage profile in Firestore
        console.log("Apple sign-in successful, user profile managed:", userCredential.user);
      }
      return userCredential.user;
    } catch (error) {
      console.error("Apple sign-in error:", error);
      throw error;
    }
  };

  const value = {
    currentUser,
    isLoading,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    signInWithApple
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};
