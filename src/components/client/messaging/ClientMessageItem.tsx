
import React, { memo, useCallback } from 'react';
import { MessageType } from '@/types/communications';
import { Paperclip, Download, User, Headphones, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClientMessageItemProps {
  message: MessageType;
  isMobile?: boolean;
}

const ClientMessageItem: React.FC<ClientMessageItemProps> = memo(({ message, isMobile = false }) => {
  const handleDownload = useCallback((attachment: any) => {
    // For Firebase Storage URLs, we can directly download
    const link = document.createElement('a');
    link.href = attachment.url;
    link.target = '_blank';
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const handleView = useCallback((attachment: any) => {
    // Open in new tab for viewing
    window.open(attachment.url, '_blank');
  }, []);

  const isFromCustomer = message.sender === 'customer';

  return (
    <div className={`flex ${isFromCustomer ? 'justify-end' : 'justify-start'} ${isMobile ? 'mb-2' : 'mb-4 lg:mb-6'}`}>
      <div className={`${isMobile ? 'max-w-[80%]' : 'max-w-[85%] sm:max-w-xl lg:max-w-2xl'} ${isFromCustomer ? (isMobile ? 'ml-2' : 'ml-4 lg:ml-12') : (isMobile ? 'mr-2' : 'mr-4 lg:mr-12')}`}>
        {/* Message bubble - WhatsApp style */}
        <div className={`${isMobile ? 'rounded-lg' : 'rounded-2xl'} ${isMobile ? 'p-2.5' : 'p-3 lg:p-4'} shadow-sm relative ${
          isFromCustomer 
            ? 'bg-teal-600 text-white' 
            : 'bg-card border border-border'
        }`}>
          {/* WhatsApp-style tail for mobile */}
          {isMobile && (
            <div 
              className={`absolute top-0 ${
                isFromCustomer 
                  ? 'right-0 border-l-[8px] border-l-teal-600 border-t-[8px] border-t-transparent -mr-2' 
                  : 'left-0 border-r-[8px] border-r-card border-t-[8px] border-t-transparent -ml-2'
              }`}
              style={{ transform: 'translateY(0px)' }}
            />
          )}
          <p className={`${isMobile ? 'text-sm' : 'text-sm lg:text-base'} leading-relaxed break-words ${
            isFromCustomer ? 'text-white' : 'text-card-foreground'
          }`}>
            {message.content}
          </p>
          
          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-3 space-y-2">
          <p className={`text-xs font-medium ${
            isFromCustomer ? 'text-white/70' : 'text-muted-foreground'
          }`}>
                Attachments:
              </p>
              {message.attachments.map((attachment, index) => (
              <div key={index} className={`flex items-center justify-between p-2 rounded-lg ${
                isFromCustomer ? 'bg-teal-700/50' : 'bg-muted'
              }`}>
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <Paperclip className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs truncate">{attachment.name}</span>
                    <span className={`text-xs flex-shrink-0 ${
                      isFromCustomer ? 'text-white/60' : 'text-muted-foreground'
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
        
        {/* Message info - Simplified for mobile */}
        <div className={`flex items-center ${isMobile ? 'mt-1' : 'mt-2'} space-x-2 text-xs text-muted-foreground ${
          isFromCustomer ? 'justify-end' : 'justify-start'
        }`}>
          {!isMobile && (
            <div className="flex items-center space-x-1">
              {isFromCustomer ? (
                <User className="h-3 w-3" />
              ) : (
                <Headphones className="h-3 w-3" />
              )}
              <span>{isFromCustomer ? 'You' : 'Support'}</span>
            </div>
          )}
          {!isMobile && <span>•</span>}
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
});

ClientMessageItem.displayName = "ClientMessageItem";

export default ClientMessageItem;
