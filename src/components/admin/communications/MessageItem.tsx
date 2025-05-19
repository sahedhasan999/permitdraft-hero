
import React from 'react';
import { MessageType } from '@/types/communications';

interface MessageItemProps {
  message: MessageType;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  return (
    <div 
      className={`mb-4 max-w-3xl ${
        message.sender === 'customer' ? 'ml-0 mr-auto' : 'ml-auto mr-0'
      }`}
    >
      <div className={`p-3 rounded-lg ${
        message.sender === 'customer' 
          ? 'bg-muted text-foreground' 
          : 'bg-primary/10 text-foreground'
      }`}>
        <p>{message.content}</p>
      </div>
      <div className={`text-xs text-muted-foreground mt-1 ${
        message.sender === 'customer' ? 'text-left' : 'text-right'
      }`}>
        {message.sender === 'customer' ? 'Customer' : 'AI'} • {
          new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
        }
      </div>
    </div>
  );
};

export default MessageItem;
