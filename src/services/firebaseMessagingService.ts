
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
  writeBatch,
  getDoc,
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
  try {
    const batch = writeBatch(db);
    
    // Create conversation document
    const conversationDocRef = doc(conversationsRef);
    const conversationData = {
      userId: userId === 'admin-created' ? `admin-${Date.now()}` : userId,
      userEmail,
      userName,
      subject,
      status: 'active',
      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp(),
      lastMessage: initialMessage,
      messageCount: 1
    };

    batch.set(conversationDocRef, conversationData);

    // Create initial message document
    const messageDocRef = doc(messagesRef);
    batch.set(messageDocRef, {
      conversationId: conversationDocRef.id,
      sender: userId === 'admin-created' ? 'admin' : 'customer',
      content: initialMessage,
      attachments,
      timestamp: serverTimestamp(),
      read: false
    });

    await batch.commit();
    console.log('Conversation created successfully:', conversationDocRef.id);
    return conversationDocRef.id;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
};

export const sendMessage = async (
  conversationId: string,
  sender: 'customer' | 'admin',
  content: string,
  attachments: FileAttachment[] = []
): Promise<void> => {
  try {
    const batch = writeBatch(db);
    
    // Add message
    const messageDocRef = doc(messagesRef);
    batch.set(messageDocRef, {
      conversationId,
      sender,
      content,
      attachments,
      timestamp: serverTimestamp(),
      read: false
    });

    // Update conversation last updated and last message
    const conversationDocRef = doc(db, 'conversations', conversationId);
    batch.update(conversationDocRef, {
      lastUpdated: serverTimestamp(),
      lastMessage: content
    });

    await batch.commit();
    console.log('Message sent successfully');
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const uploadFile = async (file: File, conversationId: string): Promise<FileAttachment> => {
  try {
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileRef = ref(storage, `chat-attachments/${conversationId}/${timestamp}-${sanitizedFileName}`);
    
    console.log('Uploading file:', file.name);
    
    const snapshot = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      name: file.name,
      url: downloadURL,
      size: formatFileSize(file.size),
      type: file.type
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
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

  return onSnapshot(q, async (snapshot) => {
    console.log('User conversations snapshot received, count:', snapshot.docs.length);
    
    const conversations: ConversationType[] = [];
    
    for (const docSnapshot of snapshot.docs) {
      const data = docSnapshot.data();
      console.log('Processing user conversation:', docSnapshot.id, data);
      
      // Get the latest messages for this conversation
      const messagesQuery = query(
        messagesRef,
        where('conversationId', '==', docSnapshot.id),
        orderBy('timestamp', 'desc')
      );
      
      const messagesSnapshot = await getDocs(messagesQuery);
      const messages: MessageType[] = messagesSnapshot.docs.map(msgDoc => {
        const msgData = msgDoc.data();
        return {
          id: msgDoc.id,
          sender: msgData.sender,
          content: msgData.content,
          timestamp: msgData.timestamp?.toDate?.()?.toISOString() || new Date().toISOString(),
          attachments: msgData.attachments || []
        };
      }).reverse(); // Reverse to get chronological order
      
      conversations.push({
        id: docSnapshot.id,
        customer: data.userName,
        email: data.userEmail,
        subject: data.subject,
        messages,
        status: data.status,
        lastUpdated: data.lastUpdated?.toDate?.()?.toISOString() || new Date().toISOString()
      });
    }
    
    console.log('Final user conversations array:', conversations);
    callback(conversations);
  }, (error) => {
    console.error('Error in user conversations subscription:', error);
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

  return onSnapshot(q, async (snapshot) => {
    console.log('All conversations snapshot received, count:', snapshot.docs.length);
    
    const conversations: ConversationType[] = [];
    
    for (const docSnapshot of snapshot.docs) {
      const data = docSnapshot.data();
      console.log('Processing admin conversation:', docSnapshot.id, data);
      
      // Get the latest messages for this conversation
      const messagesQuery = query(
        messagesRef,
        where('conversationId', '==', docSnapshot.id),
        orderBy('timestamp', 'desc')
      );
      
      const messagesSnapshot = await getDocs(messagesQuery);
      const messages: MessageType[] = messagesSnapshot.docs.map(msgDoc => {
        const msgData = msgDoc.data();
        return {
          id: msgDoc.id,
          sender: msgData.sender,
          content: msgData.content,
          timestamp: msgData.timestamp?.toDate?.()?.toISOString() || new Date().toISOString(),
          attachments: msgData.attachments || []
        };
      }).reverse(); // Reverse to get chronological order
      
      conversations.push({
        id: docSnapshot.id,
        customer: data.userName,
        email: data.userEmail,
        subject: data.subject,
        messages,
        status: data.status,
        lastUpdated: data.lastUpdated?.toDate?.()?.toISOString() || new Date().toISOString()
      });
    }
    
    console.log('Final admin conversations array:', conversations);
    callback(conversations);
  }, (error) => {
    console.error('Error in admin conversations subscription:', error);
  });
};
