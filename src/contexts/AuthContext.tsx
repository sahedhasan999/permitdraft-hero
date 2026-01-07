import React, { createContext, useContext, useEffect, useState } from 'react';
import { useFirebase } from './FirebaseContext';
import { User } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// List of admin emails - add your email here to grant admin access
const ADMIN_EMAILS = [
  'admin@permitdraftpro.com',
  // Add your email below, for example:
  // 'your-email@example.com',
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    currentUser, 
    isLoading: firebaseLoading, 
    signIn, 
    signOut,
    signInWithGoogle, // Destructure from useFirebase()
    signInWithApple   // Destructure from useFirebase()
  } = useFirebase();
  const [isAdmin, setIsAdmin] = useState(false);
  const [authStateChecked, setAuthStateChecked] = useState(false);

  useEffect(() => {
    // Check if the current user is an admin
    const checkAdminStatus = () => {
      if (currentUser && currentUser.email) {
        const adminStatus = ADMIN_EMAILS.includes(currentUser.email);
        setIsAdmin(adminStatus);
        // Secure logging - don't expose email in production
        if (process.env.NODE_ENV === 'development') {
          console.log('Auth state: User authenticated, Admin:', adminStatus);
        }
      } else {
        setIsAdmin(false);
        if (process.env.NODE_ENV === 'development') {
          console.log('Auth state: No user authenticated');
        }
      }
      setAuthStateChecked(true);
    };

    checkAdminStatus();
  }, [currentUser]);

  const login = async (email: string, password: string) => {
    await signIn(email, password);
  };

  const logout = async () => {
    await signOut();
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("AuthContext: Google login failed", error);
      throw error;
    }
  };

  const loginWithApple = async () => {
    try {
      await signInWithApple();
    } catch (error) {
      console.error("AuthContext: Apple login failed", error);
      throw error;
    }
  };

  // Combined loading state to ensure admin status is checked
  const isLoading = firebaseLoading || !authStateChecked;

  return (
    <AuthContext.Provider value={{
      user: currentUser,
      isLoading,
      login,
      logout,
      isAdmin,
      loginWithGoogle,
      loginWithApple
    }}>
      {children}
    </AuthContext.Provider>
  );
};
