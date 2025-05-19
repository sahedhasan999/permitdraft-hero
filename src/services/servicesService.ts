import { db } from '@/config/firebase';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';

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
  regularPrice?: number;
  discountPercentage?: number;
  cta?: string;
  link?: string;
  displayOrder?: number;
  showInNavigation: boolean;
  showOnHomepage: boolean;
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
    // Simplified query to avoid index requirements
    const q = query(
      servicesCollection, 
      where("active", "==", true)
    );
    const snapshot = await getDocs(q);
    // Sort in memory instead of in the query
    const services = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Service[];
    
    return services.sort((a, b) => {
      // Sort by displayOrder first, then by title
      if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
        return a.displayOrder - b.displayOrder;
      }
      return (a.title || '').localeCompare(b.title || '');
    });
  } catch (error) {
    console.error("Error fetching active services:", error);
    throw error;
  }
};

export const getServicesForNavigation = async (): Promise<Service[]> => {
  try {
    const servicesCollection = collection(db, COLLECTION_NAME);
    const q = query(
      servicesCollection, 
      where("active", "==", true),
      where("showInNavigation", "==", true)
    );
    const snapshot = await getDocs(q);
    const services = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Service[];
    
    return services.sort((a, b) => {
      if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
        return a.displayOrder - b.displayOrder;
      }
      return (a.title || '').localeCompare(b.title || '');
    });
  } catch (error) {
    console.error("Error fetching navigation services:", error);
    throw error;
  }
};

export const getServicesForHomepage = async (): Promise<Service[]> => {
  try {
    const servicesCollection = collection(db, COLLECTION_NAME);
    const q = query(
      servicesCollection, 
      where("active", "==", true),
      where("showOnHomepage", "==", true)
    );
    const snapshot = await getDocs(q);
    const services = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Service[];
    
    return services.sort((a, b) => {
      if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
        return a.displayOrder - b.displayOrder;
      }
      return (a.title || '').localeCompare(b.title || '');
    });
  } catch (error) {
    console.error("Error fetching homepage services:", error);
    throw error;
  }
};

export const subscribeToServices = (
  callback: (services: Service[]) => void,
  onError?: (error: Error) => void
) => {
  const servicesCollection = collection(db, COLLECTION_NAME);
  // Simplified query to avoid index requirements
  const q = query(servicesCollection);
  
  return onSnapshot(
    q,
    (snapshot) => {
      const services = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[];
      
      // Sort in memory instead of in the query
      services.sort((a, b) => {
        // Sort by displayOrder first, then by title
        if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
          return a.displayOrder - b.displayOrder;
        }
        return (a.title || '').localeCompare(b.title || '');
      });
      
      callback(services);
    },
    (error) => {
      console.error("Error subscribing to services:", error);
      if (onError) onError(error);
    }
  );
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
