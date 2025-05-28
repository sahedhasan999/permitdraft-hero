import { db } from '@/config/firebase';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

export interface CarouselImage {
  id: string;
  src: string;
  alt: string;
  caption: string;
  active: boolean;
  displayOrder?: number;
}

const COLLECTION_NAME = 'carousel_images';

// Function to get all carousel images (for admin)
export const getCarouselImages = async (): Promise<CarouselImage[]> => {
  try {
    const imagesCollection = collection(db, COLLECTION_NAME);
    const q = query(imagesCollection, orderBy('displayOrder', 'asc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as CarouselImage));
  } catch (error) {
    console.error('Error fetching carousel images:', error);
    return [];
  }
};

// Function to get only active carousel images (for frontend)
export const getActiveCarouselImages = async (): Promise<CarouselImage[]> => {
  try {
    const imagesCollection = collection(db, COLLECTION_NAME);
    const q = query(imagesCollection, orderBy('displayOrder', 'asc'));
    const snapshot = await getDocs(q);

    // Filter only active images
    return snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      } as CarouselImage))
      .filter(image => image.active);
  } catch (error) {
    console.error('Error fetching active carousel images:', error);
    return [];
  }
};

export const addCarouselImage = async (image: Omit<CarouselImage, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), image);
    return docRef.id;
  } catch (error) {
    console.error('Error adding carousel image:', error);
    throw error;
  }
};

export const updateCarouselImage = async (id: string, data: Partial<CarouselImage>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error('Error updating carousel image:', error);
    throw error;
  }
};

export const updateCarouselImageOrder = async (id: string, newIndex: number): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { displayOrder: newIndex });
  } catch (error) {
    console.error('Error updating carousel image order:', error);
    throw error;
  }
};

export const deleteCarouselImage = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting carousel image:', error);
    throw error;
  }
};

export const subscribeToCarouselImages = (callback: (images: CarouselImage[]) => void): (() => void) => {
  const imagesCollection = collection(db, COLLECTION_NAME);
  const q = query(imagesCollection, orderBy('displayOrder', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const images = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as CarouselImage));
    callback(images);
  });
};
