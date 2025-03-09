
import { db } from '@/config/firebase';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit } from 'firebase/firestore';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  project: string;
  status: 'New' | 'Contacted' | 'Converted' | 'Closed';
  date: string;
  message?: string;
}

const COLLECTION_NAME = 'leads';

export const getLeads = async (): Promise<Lead[]> => {
  try {
    const leadsCollection = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(leadsCollection);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Lead[];
  } catch (error) {
    console.error("Error fetching leads:", error);
    throw error;
  }
};

export const getRecentLeads = async (count: number = 5): Promise<Lead[]> => {
  try {
    const leadsCollection = collection(db, COLLECTION_NAME);
    const q = query(leadsCollection, orderBy("date", "desc"), limit(count));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Lead[];
  } catch (error) {
    console.error("Error fetching recent leads:", error);
    throw error;
  }
};

export const addLead = async (lead: Omit<Lead, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), lead);
    return docRef.id;
  } catch (error) {
    console.error("Error adding lead:", error);
    throw error;
  }
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
