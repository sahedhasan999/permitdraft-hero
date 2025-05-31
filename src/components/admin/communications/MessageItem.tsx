
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
        
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Attachments:</p>
            {message.attachments.map((attachment, index) => (
              <div key={index} className="flex items-center justify-between bg-background/50 p-2 rounded text-sm">
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
