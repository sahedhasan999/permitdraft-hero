import { db } from '@/config/firebase';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';

export interface CarouselImage {
  id: string;
  src: string;
  alt: string;
  caption: string;
  active: boolean;
  displayOrder: number;
}

const COLLECTION_NAME = 'carouselImages';

export const getCarouselImages = async (): Promise<CarouselImage[]> => {
  try {
    const imagesCollection = collection(db, COLLECTION_NAME);
    const q = query(imagesCollection, orderBy('displayOrder', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CarouselImage[];
  } catch (error) {
    console.error("Error fetching carousel images:", error);
    throw error;
  }
};

export const getActiveCarouselImages = async (): Promise<CarouselImage[]> => {
  try {
    const imagesCollection = collection(db, COLLECTION_NAME);
    const q = query(
      imagesCollection,
      where('active', '==', true),
      orderBy('displayOrder', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CarouselImage[];
  } catch (error) {
    console.error("Error fetching active carousel images:", error);
    throw error;
  }
};

export const addCarouselImage = async (image: Omit<CarouselImage, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), image);
    return docRef.id;
  } catch (error) {
    console.error("Error adding carousel image:", error);
    throw error;
  }
};

export const updateCarouselImage = async (id: string, image: Partial<Omit<CarouselImage, 'id'>>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, image);
  } catch (error) {
    console.error("Error updating carousel image:", error);
    throw error;
  }
};

export const deleteCarouselImage = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting carousel image:", error);
    throw error;
  }
};

export const updateCarouselImageOrder = async (id: string, newOrder: number): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { displayOrder: newOrder });
  } catch (error) {
    console.error("Error updating carousel image order:", error);
    throw error;
  }
}; 