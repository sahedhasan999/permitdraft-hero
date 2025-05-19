import React, { createContext, useContext, useEffect, useState } from 'react';
import { useFirebase } from './FirebaseContext';
import { User } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
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
  const { currentUser, isLoading: firebaseLoading, signIn, signOut } = useFirebase();
  const [isAdmin, setIsAdmin] = useState(false);
  const [authStateChecked, setAuthStateChecked] = useState(false);

  useEffect(() => {
    // Check if the current user is an admin
    const checkAdminStatus = () => {
      if (currentUser && currentUser.email) {
        const adminStatus = ADMIN_EMAILS.includes(currentUser.email);
        setIsAdmin(adminStatus);
        console.log('Auth state: User email:', currentUser.email, 'Admin:', adminStatus);
      } else {
        setIsAdmin(false);
        console.log('Auth state: No user or email');
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

  // Combined loading state to ensure admin status is checked
  const isLoading = firebaseLoading || !authStateChecked;

  return (
    <AuthContext.Provider value={{
      user: currentUser,
      isLoading,
      login,
      logout,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};
