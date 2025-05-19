import { db } from '@/config/firebase';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';

interface Note {
  id: string;
  content: string;
  date: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  squareFootage?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  followUpDate?: string;
  createdAt: Date;
  updatedAt: Date;
  notes?: Note[];
}

const COLLECTION_NAME = 'leads';

export const createLead = async (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<string> => {
  try {
    const now = new Date();
    const leadToAdd = {
      ...leadData,
      status: 'new' as const,
      createdAt: now,
      updatedAt: now
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), leadToAdd);
    return docRef.id;
  } catch (error) {
    console.error('Error creating lead:', error);
    throw error;
  }
};

export const getLeads = async (): Promise<Lead[]> => {
  try {
    console.log('Fetching leads from collection:', COLLECTION_NAME);
    const leadsCollection = collection(db, COLLECTION_NAME);
    const q = query(leadsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    console.log('Raw Firestore data:', snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    
    const leads = snapshot.docs.map(doc => {
      const data = doc.data();
      console.log('Processing document:', doc.id, data);
      
      // Convert Firestore Timestamp to Date
      let createdAt: Date;
      let updatedAt: Date;
      
      try {
        createdAt = data.createdAt instanceof Timestamp 
          ? data.createdAt.toDate() 
          : new Date(data.createdAt);
      } catch (e) {
        console.error('Error converting createdAt:', e);
        createdAt = new Date();
      }
      
      try {
        updatedAt = data.updatedAt instanceof Timestamp 
          ? data.updatedAt.toDate() 
          : new Date(data.updatedAt);
      } catch (e) {
        console.error('Error converting updatedAt:', e);
        updatedAt = new Date();
      }

      const lead: Lead = {
        id: doc.id,
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        projectType: data.projectType || '',
        squareFootage: data.squareFootage,
        status: (data.status as Lead['status']) || 'new',
        followUpDate: data.followUpDate,
        createdAt,
        updatedAt
      };

      console.log('Processed lead:', lead);
      return lead;
    });

    console.log('Final processed leads:', leads);
    return leads;
  } catch (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }
};

export const getRecentLeads = async (count: number = 5): Promise<Lead[]> => {
  try {
    const leadsCollection = collection(db, COLLECTION_NAME);
    const q = query(leadsCollection, orderBy('createdAt', 'desc'), limit(count));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate(),
      updatedAt: (doc.data().updatedAt as Timestamp).toDate()
    })) as Lead[];
  } catch (error) {
    console.error("Error fetching recent leads:", error);
    throw error;
  }
};

export const validateLeadData = (data: Partial<Lead>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.name?.trim()) errors.push('Name is required');
  if (!data.email?.trim()) errors.push('Email is required');
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('Invalid email format');
  
  if (!data.phone?.trim()) errors.push('Phone number is required');
  else if (!/^\+?[\d\s-()]{10,}$/.test(data.phone)) errors.push('Invalid phone number format');
  
  if (!data.projectType?.trim()) errors.push('Project type is required');

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const updateLead = async (id: string, lead: Partial<Omit<Lead, 'id'>>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, lead);
  } catch (error) {
    console.error("Error updating lead:", error);
    throw error;
  }
};

export const updateLeadStatus = async (id: string, status: Lead['status']): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { status });
  } catch (error) {
    console.error("Error updating lead status:", error);
    throw error;
  }
};

export const deleteLead = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting lead:", error);
    throw error;
  }
};
