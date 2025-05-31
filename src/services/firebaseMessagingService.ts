
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
  getDocs
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
  const conversationDoc = await addDoc(conversationsRef, {
    userId,
    userEmail,
    userName,
    subject,
    status: 'active',
    createdAt: serverTimestamp(),
    lastUpdated: serverTimestamp()
  });

  // Add initial message
  await addDoc(messagesRef, {
    conversationId: conversationDoc.id,
    sender: 'customer',
    content: initialMessage,
    attachments,
    timestamp: serverTimestamp()
  });

  return conversationDoc.id;
};

export const sendMessage = async (
  conversationId: string,
  sender: 'customer' | 'admin',
  content: string,
  attachments: FileAttachment[] = []
): Promise<void> => {
  await addDoc(messagesRef, {
    conversationId,
    sender,
    content,
    attachments,
    timestamp: serverTimestamp()
  });

  // Update conversation last updated
  const conversationDocRef = doc(db, 'conversations', conversationId);
  await updateDoc(conversationDocRef, {
    lastUpdated: serverTimestamp()
  });
};

export const uploadFile = async (file: File, conversationId: string): Promise<FileAttachment> => {
  const fileRef = ref(storage, `chat-attachments/${conversationId}/${Date.now()}-${file.name}`);
  const snapshot = await uploadBytes(fileRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);

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
  const q = query(
    conversationsRef,
    where('userId', '==', userId),
    orderBy('lastUpdated', 'desc')
  );

  return onSnapshot(q, async (snapshot) => {
    const conversations: ConversationType[] = [];
    
    for (const doc of snapshot.docs) {
      const data = doc.data();
      
      // Get messages for this conversation
      const messagesQuery = query(
        messagesRef,
        where('conversationId', '==', doc.id),
        orderBy('timestamp', 'asc')
      );
      
      const messagesSnapshot = await getDocs(messagesQuery);
      const messages: MessageType[] = messagesSnapshot.docs.map(msgDoc => ({
        id: msgDoc.id,
        sender: msgDoc.data().sender,
        content: msgDoc.data().content,
        timestamp: msgDoc.data().timestamp?.toDate?.()?.toISOString() || new Date().toISOString(),
        attachments: msgDoc.data().attachments || []
      }));

      conversations.push({
        id: doc.id,
        customer: data.userName,
        email: data.userEmail,
        subject: data.subject,
        messages,
        status: data.status,
        lastUpdated: data.lastUpdated?.toDate?.()?.toISOString() || new Date().toISOString()
      });
    }
    
    callback(conversations);
  });
};

export const subscribeToConversationMessages = (
  conversationId: string,
  callback: (messages: MessageType[]) => void
) => {
  const q = query(
    messagesRef,
    where('conversationId', '==', conversationId),
    orderBy('timestamp', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const messages: MessageType[] = snapshot.docs.map(doc => ({
      id: doc.id,
      sender: doc.data().sender,
      content: doc.data().content,
      timestamp: doc.data().timestamp?.toDate?.()?.toISOString() || new Date().toISOString(),
      attachments: doc.data().attachments || []
    }));
    
    callback(messages);
  });
};

export const subscribeToAllConversations = (
  callback: (conversations: ConversationType[]) => void
) => {
  const q = query(conversationsRef, orderBy('lastUpdated', 'desc'));

  return onSnapshot(q, async (snapshot) => {
    const conversations: ConversationType[] = [];
    
    for (const doc of snapshot.docs) {
      const data = doc.data();
      
      // Get messages for this conversation
      const messagesQuery = query(
        messagesRef,
        where('conversationId', '==', doc.id),
        orderBy('timestamp', 'asc')
      );
      
      const messagesSnapshot = await getDocs(messagesQuery);
      const messages: MessageType[] = messagesSnapshot.docs.map(msgDoc => ({
        id: msgDoc.id,
        sender: msgDoc.data().sender,
        content: msgDoc.data().content,
        timestamp: msgDoc.data().timestamp?.toDate?.()?.toISOString() || new Date().toISOString(),
        attachments: msgDoc.data().attachments || []
      }));

      conversations.push({
        id: doc.id,
        customer: data.userName,
        email: data.userEmail,
        subject: data.subject,
        messages,
        status: data.status,
        lastUpdated: data.lastUpdated?.toDate?.()?.toISOString() || new Date().toISOString()
      });
    }
    
    callback(conversations);
  });
};
