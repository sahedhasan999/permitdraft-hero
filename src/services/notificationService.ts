import { db } from '@/config/firebase';
import { collection, doc, getDocs, addDoc, updateDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';

export interface Notification {
  id: string;
  type: 'new_lead' | 'lead_status_change' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  data?: Record<string, any>;
}

const COLLECTION_NAME = 'notifications';

export const createNotification = async (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): Promise<string> => {
  try {
    const notificationToAdd = {
      ...notification,
      read: false,
      createdAt: new Date()
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), notificationToAdd);
    return docRef.id;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

export const getUnreadNotifications = async (): Promise<Notification[]> => {
  try {
    const notificationsCollection = collection(db, COLLECTION_NAME);
    const q = query(
      notificationsCollection,
      where('read', '==', false),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate()
    })) as Notification[];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, notificationId);
    await updateDoc(docRef, { read: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const notifyNewLead = async (leadId: string, leadName: string): Promise<void> => {
  try {
    await createNotification({
      type: 'new_lead',
      title: 'New Lead Received',
      message: `A new lead has been submitted by ${leadName}`,
      data: { leadId }
    });
  } catch (error) {
    console.error('Error creating new lead notification:', error);
    throw error;
  }
}; 