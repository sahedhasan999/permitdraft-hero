import { db, storage, handleStorageError } from '@/config/firebase';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { createOrder } from './orderService';

interface Note {
  id: string;
  content: string;
  date: string;
}

export interface FileAttachment {
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
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
  attachments?: FileAttachment[];
  additionalDetails?: string;
}

const COLLECTION_NAME = 'leads';

export const createLead = async (leadData: any): Promise<string> => {
  try {
    const now = new Date();
    const leadToAdd = {
      ...leadData,
      status: 'new' as const,
      createdAt: now,
      updatedAt: now
    };

    const { files, ...leadDataWithoutFiles } = leadToAdd;
    
    // First create the lead document
    const docRef = await addDoc(collection(db, COLLECTION_NAME), leadDataWithoutFiles);
    const leadId = docRef.id;
    
    // Handle file uploads if any
    if (files && files.length > 0) {
      const attachments: FileAttachment[] = [];
      
      for (const file of files) {
        try {
          const fileName = `${Date.now()}-${file.name}`;
          const storageRef = ref(storage, `Clients_Attachement/${leadId}/${fileName}`);
          
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          
          attachments.push({
            name: file.name,
            url,
            type: file.name.split('.').pop() || 'unknown',
            size: file.size,
            uploadedAt: now
          });
        } catch (error) {
          handleStorageError(error);
          console.error(`Failed to upload file ${file.name}:`, error);
        }
      }
      
      // Update the lead document with attachment references
      if (attachments.length > 0) {
        await updateDoc(doc(db, COLLECTION_NAME, leadId), { attachments });
      }
    }
    
    return leadId;
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
    
    // New functionality: If status is 'converted', create an order
    if (status === 'converted') {
      // First, get the lead data to create the order
      const leadData = await doc(db, COLLECTION_NAME, id).get();
      const lead = leadData.data() as Lead;
      
      // Create an order from the lead data
      await convertLeadToOrder(id);
    }
    
    await updateDoc(docRef, { status });
  } catch (error) {
    console.error("Error updating lead status:", error);
    throw error;
  }
};

// New function to convert lead to order
export const convertLeadToOrder = async (leadId: string): Promise<string | null> => {
  try {
    // Get lead data
    const leadDoc = await doc(db, COLLECTION_NAME, leadId).get();
    if (!leadDoc.exists()) {
      console.error("Lead not found");
      return null;
    }
    
    const leadData = leadDoc.data() as Lead;
    
    // Create an order from the lead data
    const orderData = {
      name: leadData.name,
      email: leadData.email,
      phone: leadData.phone,
      projectType: leadData.projectType,
      squareFootage: parseInt(leadData.squareFootage || '0'),
      additionalServices: {
        sitePlan: false,
        materialList: false,
        render3D: false
      }
    };
    
    // Create the order
    const orderId = await createOrder(leadData.userId || 'guest', orderData);
    return orderId;
  } catch (error) {
    console.error("Error converting lead to order:", error);
    return null;
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

// New function to upload attachments for a lead
export const uploadLeadAttachments = async (leadId: string, files: File[]): Promise<FileAttachment[]> => {
  try {
    const attachments: FileAttachment[] = [];
    
    for (const file of files) {
      try {
        const fileName = `${Date.now()}-${file.name}`;
        const storageRef = ref(storage, `Clients_Attachement/${leadId}/${fileName}`);
        
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        
        attachments.push({
          name: file.name,
          url,
          type: file.name.split('.').pop() || 'unknown',
          size: file.size,
          uploadedAt: new Date()
        });
      } catch (error) {
        handleStorageError(error);
        console.error(`Failed to upload file ${file.name}:`, error);
      }
    }
    
    return attachments;
  } catch (error) {
    console.error("Error uploading attachments:", error);
    throw error;
  }
};
