
import React from 'react';
import { MessageType } from '@/types/communications';
import { Paperclip, Download, User, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MessageItemProps {
  message: MessageType;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const handleDownload = (attachment: any) => {
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isFromCustomer = message.sender === 'customer';

  return (
    <div className={`flex ${isFromCustomer ? 'justify-start' : 'justify-end'} mb-6`}>
      <div className={`max-w-2xl ${isFromCustomer ? 'mr-12' : 'ml-12'}`}>
        {/* Message bubble */}
        <div className={`rounded-2xl p-4 shadow-sm ${
          isFromCustomer 
            ? 'bg-white border border-gray-200' 
            : 'bg-blue-600 text-white'
        }`}>
          <p className={`text-sm leading-relaxed ${
            isFromCustomer ? 'text-gray-900' : 'text-white'
          }`}>
            {message.content}
          </p>
          
          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className={`text-xs font-medium ${
                isFromCustomer ? 'text-gray-600' : 'text-blue-100'
              }`}>
                Attachments:
              </p>
              {message.attachments.map((attachment, index) => (
                <div key={index} className={`flex items-center justify-between p-2 rounded-lg ${
                  isFromCustomer ? 'bg-gray-50' : 'bg-blue-500'
                }`}>
                  <div className="flex items-center space-x-2 min-w-0">
                    <Paperclip className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs truncate">{attachment.name}</span>
                    <span className={`text-xs ${
                      isFromCustomer ? 'text-gray-500' : 'text-blue-200'
                    }`}>
                      ({attachment.size})
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(attachment)}
                    className="h-6 w-6 p-0 hover:bg-white/20"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Message info */}
        <div className={`flex items-center mt-2 space-x-2 text-xs text-gray-500 ${
          isFromCustomer ? 'justify-start' : 'justify-end'
        }`}>
          <div className="flex items-center space-x-1">
            {isFromCustomer ? (
              <User className="h-3 w-3" />
            ) : (
              <Headphones className="h-3 w-3" />
            )}
            <span>{isFromCustomer ? 'Customer' : 'Support'}</span>
          </div>
          <span>•</span>
          <span>
            {new Date(message.timestamp).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
