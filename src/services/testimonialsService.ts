
import { db } from '@/config/firebase';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot } from 'firebase/firestore';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  image: string;
  rating: number;
  project: string;
  location: string;
  active: boolean;
  order: number;
}

const COLLECTION_NAME = 'testimonials';

export const getTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const testimonialsCollection = collection(db, COLLECTION_NAME);
    const q = query(testimonialsCollection, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Testimonial));
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
};

export const getActiveTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const testimonialsCollection = collection(db, COLLECTION_NAME);
    const q = query(testimonialsCollection, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);

    return snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Testimonial))
      .filter(testimonial => testimonial.active);
  } catch (error) {
    console.error('Error fetching active testimonials:', error);
    return [];
  }
};

export const addTestimonial = async (testimonial: Omit<Testimonial, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), testimonial);
    return docRef.id;
  } catch (error) {
    console.error('Error adding testimonial:', error);
    throw error;
  }
};

export const updateTestimonial = async (id: string, data: Partial<Testimonial>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    throw error;
  }
};

export const deleteTestimonial = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    throw error;
  }
};

export const subscribeToTestimonials = (callback: (testimonials: Testimonial[]) => void): (() => void) => {
  const testimonialsCollection = collection(db, COLLECTION_NAME);
  const q = query(testimonialsCollection, orderBy('order', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const testimonials = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Testimonial));
    callback(testimonials);
  });
};
