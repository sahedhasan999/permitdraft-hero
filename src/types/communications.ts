
export type FileAttachment = {
  name: string;
  url: string;
  size: string;
  type: string;
};

export type MessageType = {
  id: string;
  sender: 'customer' | 'ai';
  content: string;
  timestamp: string;
  attachments?: FileAttachment[];
};

export type ConversationType = {
  id: string;
  customer: string;
  email: string;
  subject: string;
  messages: MessageType[];
  status: 'active' | 'closed';
  lastUpdated: string;
};
