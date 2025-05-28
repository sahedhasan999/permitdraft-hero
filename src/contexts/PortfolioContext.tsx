
import React, { createContext, useContext, useState, useEffect } from 'react';
import { portfolioService } from '@/services/portfolioService';

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  images: string[]; // Changed from 'image' to 'images' array
  active: boolean;
  order: number;
}

interface PortfolioContextType {
  portfolioItems: PortfolioItem[];
  setPortfolioItems: React.Dispatch<React.SetStateAction<PortfolioItem[]>>;
}

// Initial portfolio items using the images from public/portfolioImages
const initialPortfolioItems: PortfolioItem[] = [
  {
    id: 'portfolio-1',
    title: 'Modern Deck Design',
    category: 'Deck',
    description: 'A contemporary deck design with composite materials and glass railings.',
    images: ['/portfolioImages/01.jpg'],
    active: true,
    order: 1
  },
  {
    id: 'portfolio-2',
    title: 'Luxury Patio Design',
    category: 'Patio',
    description: 'An elegant patio design featuring natural stone pavers and built-in seating.',
    images: ['/portfolioImages/02.jpg'],
    active: true,
    order: 2
  },
  {
    id: 'portfolio-3',
    title: 'Cedar Pergola',
    category: 'Pergola',
    description: 'A beautiful cedar pergola with retractable shade system.',
    images: ['/portfolioImages/03.png'],
    active: true,
    order: 3
  },
  {
    id: 'portfolio-4',
    title: 'Outdoor Kitchen',
    category: 'Outdoor Kitchen',
    description: 'Complete outdoor kitchen with grill and entertainment area.',
    images: ['/portfolioImages/04.jpg'],
    active: true,
    order: 4
  },
  {
    id: 'portfolio-5',
    title: 'Home Addition',
    category: 'Home Addition/ADU',
    description: 'Modern home addition with seamless integration.',
    images: ['/portfolioImages/05.jpg'],
    active: true,
    order: 5
  },
  {
    id: 'portfolio-6',
    title: 'Multi-Level Deck',
    category: 'Deck',
    description: 'Sophisticated multi-level deck with integrated landscaping.',
    images: ['/portfolioImages/06.jpg'],
    active: true,
    order: 6
  }
];

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(() => {
    const sharedItems = portfolioService.getPortfolioItems();
    return sharedItems || initialPortfolioItems;
  });

  useEffect(() => {
    // Initialize storage listener for cross-tab updates
    portfolioService.initStorageListener();

    // Subscribe to changes from the portfolio service
    const unsubscribe = portfolioService.subscribe((newItems) => {
      setPortfolioItems(newItems);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    // Update shared storage whenever portfolio items change
    portfolioService.setPortfolioItems(portfolioItems);
  }, [portfolioItems]);

  return (
    <PortfolioContext.Provider value={{ portfolioItems, setPortfolioItems }}>
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
