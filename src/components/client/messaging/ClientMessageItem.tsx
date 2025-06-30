
import React from 'react';
import { MessageType } from '@/types/communications';
import { Paperclip, Download, User, Headphones, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClientMessageItemProps {
  message: MessageType;
}

const ClientMessageItem: React.FC<ClientMessageItemProps> = ({ message }) => {
  const handleDownload = (attachment: any) => {
    // For Firebase Storage URLs, we can directly download
    const link = document.createElement('a');
    link.href = attachment.url;
    link.target = '_blank';
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (attachment: any) => {
    // Open in new tab for viewing
    window.open(attachment.url, '_blank');
  };

  const isFromCustomer = message.sender === 'customer';

  return (
    <div className={`flex ${isFromCustomer ? 'justify-end' : 'justify-start'} mb-4 lg:mb-6`}>
      <div className={`max-w-[85%] sm:max-w-xl lg:max-w-2xl ${isFromCustomer ? 'ml-4 lg:ml-12' : 'mr-4 lg:mr-12'}`}>
        {/* Message bubble */}
        <div className={`rounded-2xl p-3 lg:p-4 shadow-sm ${
          isFromCustomer 
            ? 'bg-blue-600 text-white' 
            : 'bg-white border border-gray-200'
        }`}>
          <p className={`text-sm lg:text-base leading-relaxed break-words ${
            isFromCustomer ? 'text-white' : 'text-gray-900'
          }`}>
            {message.content}
          </p>
          
          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className={`text-xs font-medium ${
                isFromCustomer ? 'text-blue-100' : 'text-gray-600'
              }`}>
                Attachments:
              </p>
              {message.attachments.map((attachment, index) => (
                <div key={index} className={`flex items-center justify-between p-2 rounded-lg ${
                  isFromCustomer ? 'bg-blue-500' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <Paperclip className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs truncate">{attachment.name}</span>
                    <span className={`text-xs flex-shrink-0 ${
                      isFromCustomer ? 'text-blue-200' : 'text-gray-500'
                    }`}>
                      ({attachment.size})
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(attachment)}
                      className="h-6 w-6 p-0 hover:bg-white/20"
                      title="View file"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(attachment)}
                      className="h-6 w-6 p-0 hover:bg-white/20"
                      title="Download file"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Message info */}
        <div className={`flex items-center mt-2 space-x-2 text-xs text-gray-500 ${
          isFromCustomer ? 'justify-end' : 'justify-start'
        }`}>
          <div className="flex items-center space-x-1">
            {isFromCustomer ? (
              <User className="h-3 w-3" />
            ) : (
              <Headphones className="h-3 w-3" />
            )}
            <span>{isFromCustomer ? 'You' : 'Support'}</span>
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

export default ClientMessageItem;
