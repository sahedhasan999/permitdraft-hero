
export type MessageType = {
  id: string;
  sender: 'customer' | 'ai';
  content: string;
  timestamp: string;
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
