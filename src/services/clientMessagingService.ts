
import { ConversationType, MessageType, FileAttachment } from '@/types/communications';

// Mock service for client messaging
// In a real app, this would integrate with Firebase or another backend

const mockClientConversations: ConversationType[] = [
  {
    id: 'client-thread-1',
    customer: 'John Doe',
    email: 'john@example.com',
    subject: 'Project Update Request',
    messages: [
      {
        id: 'msg-1',
        sender: 'customer',
        content: 'Hi, I would like an update on my project progress.',
        timestamp: '2024-01-01T10:00:00Z',
        attachments: []
      },
      {
        id: 'msg-2',
        sender: 'ai',
        content: 'Hello! Your project is currently in the design phase. We expect to complete it by next week.',
        timestamp: '2024-01-01T10:30:00Z',
        attachments: []
      }
    ],
    status: 'active',
    lastUpdated: '2024-01-01T10:30:00Z'
  }
];

export const getClientConversations = async (userId: string): Promise<ConversationType[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockClientConversations);
    }, 500);
  });
};

export const sendClientMessage = async (
  conversationId: string,
  content: string,
  attachments: FileAttachment[] = []
): Promise<MessageType> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const message: MessageType = {
        id: `msg-${Date.now()}`,
        sender: 'customer',
        content,
        timestamp: new Date().toISOString(),
        attachments
      };
      resolve(message);
    }, 300);
  });
};

export const createClientConversation = async (
  subject: string,
  content: string,
  userEmail: string,
  userName: string,
  attachments: FileAttachment[] = []
): Promise<ConversationType> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const conversation: ConversationType = {
        id: `client-thread-${Date.now()}`,
        customer: userName,
        email: userEmail,
        subject,
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: 'customer',
            content,
            timestamp: new Date().toISOString(),
            attachments
          }
        ],
        status: 'active',
        lastUpdated: new Date().toISOString()
      };
      resolve(conversation);
    }, 500);
  });
};
