
import { db } from '@/config/firebase';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';

export interface Service {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  basePrice: number;
  features: string[];
  active: boolean;
  image: string;
}

const COLLECTION_NAME = 'services';

export const getServices = async (): Promise<Service[]> => {
  try {
    const servicesCollection = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(servicesCollection);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Service[];
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

export const getActiveServices = async (): Promise<Service[]> => {
  try {
    const servicesCollection = collection(db, COLLECTION_NAME);
    const q = query(servicesCollection, where("active", "==", true), orderBy("title"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Service[];
  } catch (error) {
    console.error("Error fetching active services:", error);
    throw error;
  }
};

export const addService = async (service: Omit<Service, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), service);
    return docRef.id;
  } catch (error) {
    console.error("Error adding service:", error);
    throw error;
  }
};

export const updateService = async (id: string, service: Partial<Omit<Service, 'id'>>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, service);
  } catch (error) {
    console.error("Error updating service:", error);
    throw error;
  }
};

export const deleteService = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting service:", error);
    throw error;
  }
};
