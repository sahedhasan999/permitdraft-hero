
import React from 'react';
import { MessageType } from '@/types/communications';
import { Paperclip, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MessageItemProps {
  message: MessageType;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const handleDownload = (attachment: any) => {
    // Create a temporary link to download the file
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isFromCustomer = message.sender === 'customer';

  return (
    <div 
      className={`mb-4 max-w-3xl ${
        isFromCustomer ? 'ml-0 mr-auto' : 'ml-auto mr-0'
      }`}
    >
      <div className={`p-4 rounded-lg ${
        isFromCustomer 
          ? 'bg-blue-50 border border-blue-200 text-blue-900' 
          : 'bg-green-50 border border-green-200 text-green-900'
      }`}>
        <p className="text-sm">{message.content}</p>
        
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Attachments:</p>
            {message.attachments.map((attachment, index) => (
              <div key={index} className="flex items-center justify-between bg-white/70 p-2 rounded text-sm">
                <div className="flex items-center space-x-2">
                  <Paperclip className="h-3 w-3" />
                  <span className="truncate">{attachment.name}</span>
                  <span className="text-muted-foreground">({attachment.size})</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(attachment)}
                  className="h-6 w-6 p-0"
                >
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={`text-xs text-muted-foreground mt-1 ${
        isFromCustomer ? 'text-left' : 'text-right'
      }`}>
        {isFromCustomer ? 'Customer' : 'Support Team'} • {
          new Date(message.timestamp).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        }
      </div>
    </div>
  );
};

export default MessageItem;
