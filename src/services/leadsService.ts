
import { db, storage } from '@/config/firebase';
import { collection, doc, getDocs, addDoc, updateDoc, getDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

// Define interfaces
export interface Note {
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
  userId?: string;
}

// Function to get recent leads
export const getRecentLeads = async (limit: number = 5): Promise<Lead[]> => {
  try {
    const leadsRef = collection(db, 'leads');
    const q = query(leadsRef, orderBy('createdAt', 'desc'), limit(limit));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as Lead;
    });
  } catch (error) {
    console.error("Error getting recent leads:", error);
    throw error;
  }
};

// Function to get all leads
export const getLeads = async (): Promise<Lead[]> => {
  try {
    const leadsRef = collection(db, 'leads');
    const q = query(leadsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as Lead;
    });
  } catch (error) {
    console.error("Error getting leads:", error);
    throw error;
  }
};

// Function to update lead status
export const updateLeadStatus = async (leadId: string, status: Lead['status']): Promise<void> => {
  try {
    const leadRef = doc(db, 'leads', leadId);
    await updateDoc(leadRef, { 
      status, 
      updatedAt: new Date() 
    });
  } catch (error) {
    console.error("Error updating lead status:", error);
    throw error;
  }
};

// Function to update lead data
export const updateLead = async (leadId: string, data: Partial<Lead>): Promise<void> => {
  try {
    const leadRef = doc(db, 'leads', leadId);
    await updateDoc(leadRef, { 
      ...data,
      updatedAt: new Date() 
    });
  } catch (error) {
    console.error("Error updating lead:", error);
    throw error;
  }
};

// Function to create a lead
export const createLead = async (formData: any): Promise<string> => {
  try {
    // Create the lead document first
    const leadData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || '',
      projectType: formData.projectType,
      squareFootage: formData.squareFootage,
      status: 'new' as const,
      additionalDetails: formData.additionalDetails || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await addDoc(collection(db, 'leads'), leadData);
    const leadId = docRef.id;

    // Handle file uploads if any
    if (formData.files && formData.files.length > 0) {
      const attachments: FileAttachment[] = [];

      for (const file of formData.files) {
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
      }

      // Update the lead document with attachments
      if (attachments.length > 0) {
        await updateDoc(doc(db, 'leads', leadId), { attachments });
      }
    }

    return leadId;
  } catch (error) {
    console.error("Error creating lead:", error);
    throw error;
  }
};

// Function to validate lead data
export const validateLeadData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.name) errors.push("Name is required");
  if (!data.email) errors.push("Email is required");
  if (!data.projectType) errors.push("Project type is required");
  if (!data.squareFootage) errors.push("Square footage is required");
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Function to convert a lead to an order
export const convertLeadToOrder = async (leadId: string): Promise<string | null> => {
  try {
    // Get the lead data
    const leadRef = doc(db, 'leads', leadId);
    const leadSnapshot = await getDoc(leadRef);
    
    if (!leadSnapshot.exists()) {
      throw new Error(`Lead with ID ${leadId} not found`);
    }
    
    const leadData = leadSnapshot.data() as Lead;
    
    // Create a new order based on the lead
    const orderData = {
      clientName: leadData.name,
      clientEmail: leadData.email,
      clientPhone: leadData.phone,
      projectType: leadData.projectType,
      squareFootage: leadData.squareFootage,
      status: 'pending',
      createdFrom: 'lead',
      leadId: leadId,
      userId: leadData.userId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: leadData.notes || [],
      attachments: leadData.attachments || []
    };
    
    // Add the order to Firestore
    const orderRef = await addDoc(collection(db, 'orders'), orderData);
    
    // Update the lead to mark it as converted with the order reference
    await updateDoc(leadRef, {
      status: 'converted',
      orderId: orderRef.id,
      updatedAt: new Date()
    });
    
    return orderRef.id;
  } catch (error) {
    console.error("Error converting lead to order:", error);
    return null;
  }
};
