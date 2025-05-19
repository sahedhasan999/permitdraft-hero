import { db } from '@/config/firebase';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, Timestamp, getDoc } from 'firebase/firestore';

export interface AdditionalService {
  sitePlan: boolean;
  materialList: boolean;
  render3D: boolean;
}

export interface Order {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  squareFootage: number;
  additionalServices: AdditionalService;
  totalPrice: number;
  status: 'pending' | 'paid' | 'in-progress' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const COLLECTION_NAME = 'orders';

export const calculatePrice = (squareFootage: number, additionalServices: AdditionalService): number => {
  let basePrice = 0;
  
  // Calculate base price based on square footage
  if (squareFootage <= 200) {
    basePrice = 150;
  } else if (squareFootage <= 400) {
    basePrice = 200;
  } else if (squareFootage <= 600) {
    basePrice = 300;
  } else if (squareFootage <= 1000) {
    basePrice = 500;
  } else {
    basePrice = 750; // For areas larger than 1000 sqft
  }
  
  // Add price for additional services
  let additionalPrice = 0;
  if (additionalServices.sitePlan) additionalPrice += 100;
  if (additionalServices.materialList) additionalPrice += 50;
  if (additionalServices.render3D) additionalPrice += 150;
  
  return basePrice + additionalPrice;
};

export const createOrder = async (
  userId: string,
  orderData: {
    name: string;
    email: string;
    phone: string;
    projectType: string;
    squareFootage: number;
    additionalServices: AdditionalService;
  }
): Promise<string> => {
  try {
    const now = new Date();
    const totalPrice = calculatePrice(orderData.squareFootage, orderData.additionalServices);
    
    const orderToAdd = {
      userId,
      ...orderData,
      totalPrice,
      status: 'pending' as const,
      paymentStatus: 'pending' as const,
      createdAt: now,
      updatedAt: now
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), orderToAdd);
    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrders = async (): Promise<Order[]> => {
  try {
    const ordersCollection = collection(db, COLLECTION_NAME);
    const q = query(ordersCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      
      return {
        id: doc.id,
        userId: data.userId || '',
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        projectType: data.projectType || '',
        squareFootage: data.squareFootage || 0,
        additionalServices: data.additionalServices || { sitePlan: false, materialList: false, render3D: false },
        totalPrice: data.totalPrice || 0,
        status: (data.status as Order['status']) || 'pending',
        paymentStatus: (data.paymentStatus as Order['paymentStatus']) || 'pending',
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt)
      };
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const ordersCollection = collection(db, COLLECTION_NAME);
    const q = query(ordersCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      
      return {
        id: doc.id,
        userId: data.userId || '',
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        projectType: data.projectType || '',
        squareFootage: data.squareFootage || 0,
        additionalServices: data.additionalServices || { sitePlan: false, materialList: false, render3D: false },
        totalPrice: data.totalPrice || 0,
        status: (data.status as Order['status']) || 'pending',
        paymentStatus: (data.paymentStatus as Order['paymentStatus']) || 'pending',
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt)
      };
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, orderId);
    const snapshot = await getDoc(docRef);
    
    if (!snapshot.exists()) {
      return null;
    }
    
    const data = snapshot.data();
    
    return {
      id: snapshot.id,
      userId: data.userId || '',
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || '',
      projectType: data.projectType || '',
      squareFootage: data.squareFootage || 0,
      additionalServices: data.additionalServices || { sitePlan: false, materialList: false, render3D: false },
      totalPrice: data.totalPrice || 0,
      status: (data.status as Order['status']) || 'pending',
      paymentStatus: (data.paymentStatus as Order['paymentStatus']) || 'pending',
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt)
    };
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, orderId);
    await updateDoc(docRef, { 
      status,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const updatePaymentStatus = async (orderId: string, paymentStatus: Order['paymentStatus']): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, orderId);
    await updateDoc(docRef, { 
      paymentStatus,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};

export const getRecentOrders = async (count: number = 5): Promise<Order[]> => {
  try {
    const ordersCollection = collection(db, COLLECTION_NAME);
    const q = query(ordersCollection, orderBy('createdAt', 'desc'), limit(count));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      
      return {
        id: doc.id,
        userId: data.userId || '',
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        projectType: data.projectType || '',
        squareFootage: data.squareFootage || 0,
        additionalServices: data.additionalServices || { sitePlan: false, materialList: false, render3D: false },
        totalPrice: data.totalPrice || 0,
        status: (data.status as Order['status']) || 'pending',
        paymentStatus: (data.paymentStatus as Order['paymentStatus']) || 'pending',
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt)
      };
    });
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    throw error;
  }
};

export const validateOrderData = (data: Partial<Order>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.name?.trim()) errors.push('Name is required');
  if (!data.email?.trim()) errors.push('Email is required');
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('Invalid email format');
  
  if (!data.phone?.trim()) errors.push('Phone number is required');
  else if (!/^\+?[\d\s-()]{10,}$/.test(data.phone)) errors.push('Invalid phone number format');
  
  if (!data.projectType?.trim()) errors.push('Project type is required');
  if (!data.squareFootage || data.squareFootage <= 0) errors.push('Valid square footage is required');

  return {
    isValid: errors.length === 0,
    errors
  };
}; 