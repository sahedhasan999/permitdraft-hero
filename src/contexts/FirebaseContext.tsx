
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
import { auth, googleProvider, appleProvider, db } from '@/config/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

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

interface FirebaseProviderProps {
  children: React.ReactNode;
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
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
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        };
        await setDoc(userRef, userData);
        console.log("Created user profile in Firestore for:", user.uid);
      } else {
        // Existing user, update last login and potentially other details
        await setDoc(userRef, {
          displayName: user.displayName || docSnap.data()?.displayName || '',
          photoURL: user.photoURL || docSnap.data()?.photoURL || '',
          email: user.email,
          lastLoginAt: serverTimestamp()
        }, { merge: true });
        console.log("Updated user profile in Firestore for:", user.uid);
      }
    } catch (error) {
      console.error("Error managing user profile in Firestore:", error);
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
        await manageUserProfile(userCredential.user);
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
        await manageUserProfile(userCredential.user);
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
