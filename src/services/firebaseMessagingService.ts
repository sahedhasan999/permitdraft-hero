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
  getDocs,
  increment
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/config/firebase';
import { ConversationType, MessageType, FileAttachment } from '@/types/communications';

// Collection references
const conversationsRef = collection(db, 'conversations');
const messagesRef = collection(db, 'messages');

// Cache for admin conversations to avoid refetching unchanged data
let adminConversationsCache = new Map<string, ConversationType>();
let messagesListeners = new Map<string, () => void>();

export const createConversation = async (
  userId: string,
  userEmail: string,
  userName: string,
  subject: string,
  initialMessage: string,
  pendingFiles: File[] = []
): Promise<string> => {
  try {
    const batch = writeBatch(db);
    
    // Create conversation document
    const conversationDocRef = doc(conversationsRef);
    const conversationData = {
      userId: userId === 'admin-created' ? userEmail : userId, // Use email for admin-created conversations
      userEmail,
      userName,
      subject,
      status: 'active',
      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp(),
      lastMessage: initialMessage,
      messageCount: 1,
      isAdminCreated: userId === 'admin-created' // Add flag to identify admin-created conversations
    };

    batch.set(conversationDocRef, conversationData);

    // Create initial message document
    const messageDocRef = doc(messagesRef);
    batch.set(messageDocRef, {
      conversationId: conversationDocRef.id,
      sender: userId === 'admin-created' ? 'admin' : 'customer',
      content: initialMessage,
      attachments: [],
      timestamp: serverTimestamp(),
      read: false
    });

    await batch.commit();
    console.log('Conversation and initial message (without attachments) created successfully:', conversationDocRef.id);

    // Upload files and update message with attachments
    if (pendingFiles.length > 0) {
      const uploadedAttachments: FileAttachment[] = [];
      for (const file of pendingFiles) {
        try {
          const attachment = await uploadFile(file, conversationDocRef.id);
          uploadedAttachments.push(attachment);
        } catch (uploadError) {
          console.error('Error uploading an attachment during conversation creation:', uploadError);
        }
      }

      if (uploadedAttachments.length > 0) {
        await updateDoc(messageDocRef, {
          attachments: uploadedAttachments
        });
        console.log('Initial message updated with attachments:', uploadedAttachments);
      }
    }

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
      lastMessage: content,
      messageCount: increment(1)
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
  userEmail: string,
  callback: (conversations: ConversationType[]) => void
) => {
  console.log('Subscribing to conversations for user:', userId, userEmail);
  
  // Query for conversations where userId matches OR userEmail matches (for admin-created conversations)
  const q = query(
    conversationsRef,
    orderBy('lastUpdated', 'desc')
  );

  return onSnapshot(q, async (snapshot) => {
    console.log('User conversations snapshot received, count:', snapshot.docs.length);
    
    const conversations: ConversationType[] = [];
    
    for (const docSnapshot of snapshot.docs) {
      const data = docSnapshot.data();
      
      // Filter conversations that belong to this user (either by userId or by email for admin-created)
      if (data.userId === userId || data.userEmail === userEmail) {
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
        }).reverse();
        
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

// Optimized admin subscription that uses separate message listeners
export const subscribeToAllConversations = (
  callback: (conversations: ConversationType[]) => void
) => {
  console.log('Subscribing to all conversations for admin - OPTIMIZED');
  
  // Clean up existing message listeners
  messagesListeners.forEach(unsubscribe => unsubscribe());
  messagesListeners.clear();
  adminConversationsCache.clear();
  
  const q = query(conversationsRef, orderBy('lastUpdated', 'desc'));

  return onSnapshot(q, async (snapshot) => {
    console.log('Admin conversations snapshot received, count:', snapshot.docs.length);
    
    const conversationPromises = snapshot.docs.map(async (docSnapshot) => {
      const data = docSnapshot.data();
      const conversationId = docSnapshot.id;
      
      // Check if we already have this conversation cached
      const cachedConversation = adminConversationsCache.get(conversationId);
      const dataLastUpdated = data.lastUpdated?.toDate?.()?.getTime() || 0;
      const cachedLastUpdated = new Date(cachedConversation?.lastUpdated || 0).getTime();
      
      // If conversation hasn't changed, return cached version
      if (cachedConversation && dataLastUpdated <= cachedLastUpdated) {
        return cachedConversation;
      }
      
      console.log('Fetching messages for conversation:', conversationId);
      
      // Get messages for this conversation
      const messagesQuery = query(
        messagesRef,
        where('conversationId', '==', conversationId),
        orderBy('timestamp', 'asc')
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
      });
      
      const conversation: ConversationType = {
        id: conversationId,
        customer: data.userName,
        email: data.userEmail,
        subject: data.subject,
        messages,
        status: data.status,
        lastUpdated: data.lastUpdated?.toDate?.()?.toISOString() || new Date().toISOString()
      };
      
      // Cache the conversation
      adminConversationsCache.set(conversationId, conversation);
      
      // Set up real-time message listener for this conversation
      if (!messagesListeners.has(conversationId)) {
        const messageListener = subscribeToConversationMessages(conversationId, (updatedMessages) => {
          // Update the cached conversation with new messages
          const cachedConv = adminConversationsCache.get(conversationId);
          if (cachedConv) {
            cachedConv.messages = updatedMessages;
            adminConversationsCache.set(conversationId, cachedConv);
            
            // Trigger callback with updated conversations
            const allConversations = Array.from(adminConversationsCache.values())
              .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
            callback(allConversations);
          }
        });
        
        messagesListeners.set(conversationId, messageListener);
      }
      
      return conversation;
    });
    
    const conversations = await Promise.all(conversationPromises);
    
    console.log('Final admin conversations array:', conversations);
    callback(conversations);
  }, (error) => {
    console.error('Error in admin conversations subscription:', error);
  });
};
