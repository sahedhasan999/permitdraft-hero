
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc,
  serverTimestamp,
  where,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/config/firebase';
import { ConversationType, MessageType, FileAttachment } from '@/types/communications';

// Collection references
const conversationsRef = collection(db, 'conversations');
const messagesRef = collection(db, 'messages');

export const createConversation = async (
  userId: string,
  userEmail: string,
  userName: string,
  subject: string,
  initialMessage: string,
  attachments: FileAttachment[] = []
): Promise<string> => {
  const batch = writeBatch(db);
  
  // Create conversation document
  const conversationDocRef = doc(conversationsRef);
  const conversationData = {
    userId,
    userEmail,
    userName,
    subject,
    status: 'active',
    createdAt: serverTimestamp(),
    lastUpdated: serverTimestamp(),
    messageCount: 1
  };

  // If userId is 'admin-created', this is an admin starting a conversation
  if (userId === 'admin-created') {
    conversationData.userId = `admin-${Date.now()}`; // Generate a unique ID for admin-created conversations
  }

  batch.set(conversationDocRef, conversationData);

  // Create initial message document
  const messageDocRef = doc(messagesRef);
  batch.set(messageDocRef, {
    conversationId: conversationDocRef.id,
    sender: userId === 'admin-created' ? 'admin' : 'customer',
    content: initialMessage,
    attachments,
    timestamp: serverTimestamp()
  });

  await batch.commit();
  return conversationDocRef.id;
};

export const sendMessage = async (
  conversationId: string,
  sender: 'customer' | 'admin',
  content: string,
  attachments: FileAttachment[] = []
): Promise<void> => {
  const batch = writeBatch(db);
  
  // Add message
  const messageDocRef = doc(messagesRef);
  batch.set(messageDocRef, {
    conversationId,
    sender,
    content,
    attachments,
    timestamp: serverTimestamp()
  });

  // Update conversation last updated and increment message count
  const conversationDocRef = doc(db, 'conversations', conversationId);
  batch.update(conversationDocRef, {
    lastUpdated: serverTimestamp()
  });

  await batch.commit();
};

export const uploadFile = async (file: File, conversationId: string): Promise<FileAttachment> => {
  const timestamp = Date.now();
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileRef = ref(storage, `chat-attachments/${conversationId}/${timestamp}-${sanitizedFileName}`);
  
  console.log('Uploading file:', file.name, 'to path:', fileRef.fullPath);
  
  const snapshot = await uploadBytes(fileRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);

  console.log('File uploaded successfully, URL:', downloadURL);

  return {
    name: file.name,
    url: downloadURL,
    size: formatFileSize(file.size),
    type: file.type
  };
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const subscribeToUserConversations = (
  userId: string,
  callback: (conversations: ConversationType[]) => void
) => {
  console.log('Subscribing to conversations for user:', userId);
  
  const q = query(
    conversationsRef,
    where('userId', '==', userId),
    orderBy('lastUpdated', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    console.log('Conversations snapshot received, count:', snapshot.docs.length);
    const conversations: ConversationType[] = snapshot.docs.map(doc => {
      const data = doc.data();
      console.log('Processing conversation:', doc.id, data);
      
      return {
        id: doc.id,
        customer: data.userName,
        email: data.userEmail,
        subject: data.subject,
        messages: [], // Messages will be loaded separately
        status: data.status,
        lastUpdated: data.lastUpdated?.toDate?.()?.toISOString() || new Date().toISOString()
      };
    });
    
    console.log('Final conversations array:', conversations);
    callback(conversations);
  }, (error) => {
    console.error('Error in conversations subscription:', error);
  });
};

export const subscribeToConversationMessages = (
  conversationId: string,
  callback: (messages: MessageType[]) => void
) => {
  console.log('Subscribing to messages for conversation:', conversationId);
  
  const q = query(
    messagesRef,
    where('conversationId', '==', conversationId),
    orderBy('timestamp', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    console.log('Messages snapshot received for conversation', conversationId, ', count:', snapshot.docs.length);
    
    const messages: MessageType[] = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        sender: data.sender,
        content: data.content,
        timestamp: data.timestamp?.toDate?.()?.toISOString() || new Date().toISOString(),
        attachments: data.attachments || []
      };
    });
    
    console.log('Processed messages:', messages);
    callback(messages);
  }, (error) => {
    console.error('Error in messages subscription:', error);
  });
};

export const subscribeToAllConversations = (
  callback: (conversations: ConversationType[]) => void
) => {
  console.log('Subscribing to all conversations for admin');
  
  const q = query(conversationsRef, orderBy('lastUpdated', 'desc'));

  return onSnapshot(q, (snapshot) => {
    console.log('All conversations snapshot received, count:', snapshot.docs.length);
    const conversations: ConversationType[] = snapshot.docs.map(doc => {
      const data = doc.data();
      console.log('Processing admin conversation:', doc.id, data);
      
      return {
        id: doc.id,
        customer: data.userName,
        email: data.userEmail,
        subject: data.subject,
        messages: [], // Messages will be loaded separately
        status: data.status,
        lastUpdated: data.lastUpdated?.toDate?.()?.toISOString() || new Date().toISOString()
      };
    });
    
    console.log('Final admin conversations array:', conversations);
    callback(conversations);
  }, (error) => {
    console.error('Error in admin conversations subscription:', error);
  });
};
