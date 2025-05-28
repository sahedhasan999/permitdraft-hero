
import { PortfolioItem } from '@/contexts/PortfolioContext';

const PORTFOLIO_STORAGE_KEY = 'shared_portfolio_items';

// Simulate a shared storage system (in a real app, this would be a database)
class PortfolioService {
  private static instance: PortfolioService;
  private listeners: Array<(items: PortfolioItem[]) => void> = [];

  static getInstance(): PortfolioService {
    if (!PortfolioService.instance) {
      PortfolioService.instance = new PortfolioService();
    }
    return PortfolioService.instance;
  }

  getPortfolioItems(): PortfolioItem[] {
    const stored = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  setPortfolioItems(items: PortfolioItem[]): void {
    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(items));
    // Notify all listeners about the change
    this.listeners.forEach(listener => listener(items));
  }

  subscribe(callback: (items: PortfolioItem[]) => void): () => void {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Listen for storage changes from other tabs/windows
  initStorageListener(): void {
    window.addEventListener('storage', (e) => {
      if (e.key === PORTFOLIO_STORAGE_KEY && e.newValue) {
        const newItems = JSON.parse(e.newValue);
        this.listeners.forEach(listener => listener(newItems));
      }
    });
  }
}

export const portfolioService = PortfolioService.getInstance();
