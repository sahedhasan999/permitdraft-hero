
import { db } from '@/config/firebase';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { PortfolioItem } from '@/contexts/PortfolioContext';

const COLLECTION_NAME = 'portfolio_items';

export const getPortfolioItems = async (): Promise<PortfolioItem[]> => {
  try {
    const portfolioCollection = collection(db, COLLECTION_NAME);
    const q = query(portfolioCollection, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as PortfolioItem));
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    return [];
  }
};

export const getActivePortfolioItems = async (): Promise<PortfolioItem[]> => {
  try {
    const portfolioCollection = collection(db, COLLECTION_NAME);
    const q = query(portfolioCollection, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);

    return snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      } as PortfolioItem))
      .filter(item => item.active);
  } catch (error) {
    console.error('Error fetching active portfolio items:', error);
    return [];
  }
};

export const addPortfolioItem = async (item: Omit<PortfolioItem, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), item);
    return docRef.id;
  } catch (error) {
    console.error('Error adding portfolio item:', error);
    throw error;
  }
};

export const updatePortfolioItem = async (id: string, data: Partial<PortfolioItem>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error('Error updating portfolio item:', error);
    throw error;
  }
};

export const deletePortfolioItem = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    throw error;
  }
};

export const subscribeToPortfolioItems = (callback: (items: PortfolioItem[]) => void): (() => void) => {
  const portfolioCollection = collection(db, COLLECTION_NAME);
  const q = query(portfolioCollection, orderBy('order', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as PortfolioItem));
    callback(items);
  });
};
