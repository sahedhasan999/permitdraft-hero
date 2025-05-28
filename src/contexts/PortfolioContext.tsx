
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getPortfolioItems, subscribeToPortfolioItems } from '@/services/portfolioFirebaseService';

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  images: string[];
  active: boolean;
  order: number;
}

interface PortfolioContextType {
  portfolioItems: PortfolioItem[];
  setPortfolioItems: React.Dispatch<React.SetStateAction<PortfolioItem[]>>;
  loading: boolean;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to real-time updates from Firebase
    const unsubscribe = subscribeToPortfolioItems((items) => {
      setPortfolioItems(items);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <PortfolioContext.Provider value={{ portfolioItems, setPortfolioItems, loading }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
