
import { db } from '@/config/firebase';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit } from 'firebase/firestore';

export interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  service: string;
  amount: number;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  date: string;
  address: string;
}

const COLLECTION_NAME = 'orders';

export const getOrders = async (): Promise<Order[]> => {
  try {
    const ordersCollection = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(ordersCollection);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[];
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const getRecentOrders = async (count: number = 5): Promise<Order[]> => {
  try {
    const ordersCollection = collection(db, COLLECTION_NAME);
    const q = query(ordersCollection, orderBy("date", "desc"), limit(count));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[];
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    throw error;
  }
};

export const addOrder = async (order: Omit<Order, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), order);
    return docRef.id;
  } catch (error) {
    console.error("Error adding order:", error);
    throw error;
  }
};

export const updateOrder = async (id: string, order: Partial<Omit<Order, 'id'>>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, order);
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

export const updateOrderStatus = async (id: string, status: Order['status']): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { status });
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

export const deleteOrder = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};
