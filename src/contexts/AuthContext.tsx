
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define Admin user interface
interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin';
}

interface AuthContextType {
  user: AdminUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock admin users for demo purposes - in a real app, this would come from a secure backend
const MOCK_ADMINS = [
  {
    id: '1',
    email: 'admin@permitdraftpro.com',
    password: 'admin123', // In a real app, passwords would be hashed and not stored in frontend code
    name: 'Admin User',
    role: 'admin' as const
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage on initial load
    const checkAuth = () => {
      const storedUser = localStorage.getItem('adminUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = MOCK_ADMINS.find(
      admin => admin.email === email && admin.password === password
    );
    
    if (!foundUser) {
      setIsLoading(false);
      throw new Error('Invalid credentials');
    }
    
    // Omit password from stored user data
    const { password: _, ...userWithoutPassword } = foundUser;
    
    // Store the user in state and localStorage
    setUser(userWithoutPassword);
    localStorage.setItem('adminUser', JSON.stringify(userWithoutPassword));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('adminUser');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
