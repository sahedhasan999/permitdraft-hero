
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip } from 'lucide-react';
import { FileAttachment } from '@/types/communications';
import { sendMessage } from '@/services/firebaseMessagingService';
import { useToast } from '@/hooks/use-toast';
import FileUploadManager from './FileUploadManager';

interface MessageComposerProps {
  conversationId: string;
  isMobile?: boolean;
}

const MessageComposer: React.FC<MessageComposerProps> = ({ conversationId, isMobile = false }) => {
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = useCallback(async () => {
    if (!conversationId || (!newMessage.trim() && attachments.length === 0)) return;

    setIsSending(true);
    try {
      await sendMessage(conversationId, 'customer', newMessage, attachments);
      setNewMessage('');
      setAttachments([]);
      setShowFileUpload(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  }, [conversationId, newMessage, attachments, toast]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const toggleFileUpload = useCallback(() => {
    setShowFileUpload(prev => !prev);
  }, []);

  const canSend = !isSending && (newMessage.trim() || attachments.length > 0);

  return (
    <div className={isMobile ? 'space-y-2' : 'space-y-3 lg:space-y-4'}>
      <div className={`${isMobile ? 'border-0 rounded-2xl' : 'border border-gray-200 rounded-lg'} overflow-hidden shadow-sm bg-white`}>
        <div className={`flex items-end ${isMobile ? 'p-2 space-x-2' : 'p-3 space-x-3'}`}>
          {/* Attach button for mobile - WhatsApp style */}
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFileUpload}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full h-8 w-8 flex-shrink-0"
              disabled={isSending}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
          )}
          
          {/* Text input */}
          <div className="flex-1">
            <Textarea
              placeholder={isMobile ? "Type a message..." : "Type your message here..."}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`border-0 resize-none focus:ring-0 ${
                isMobile 
                  ? 'min-h-[36px] max-h-[120px] text-sm p-2 bg-gray-50 rounded-2xl' 
                  : 'min-h-[60px] lg:min-h-[80px] text-sm lg:text-base'
              }`}
              disabled={isSending}
              rows={isMobile ? 1 : 3}
            />
          </div>
          
          {/* Send button - WhatsApp style for mobile */}
          <Button 
            onClick={handleSendMessage}
            disabled={!canSend}
            className={isMobile 
              ? "bg-primary hover:bg-primary/90 rounded-full h-8 w-8 p-0 flex-shrink-0" 
              : "bg-blue-600 hover:bg-blue-700 text-sm lg:text-base px-4 lg:px-6"
            }
            size={isMobile ? "sm" : "default"}
          >
            <Send className={isMobile ? "h-4 w-4" : "h-4 w-4 mr-1"} />
            {!isMobile && (isSending ? 'Sending...' : 'Send')}
          </Button>
        </div>
        
        {/* Desktop file upload area */}
        {!isMobile && showFileUpload && (
          <div className="border-t border-gray-200 p-3 bg-gray-50">
            <FileUploadManager
              attachments={attachments}
              onAttachmentsChange={setAttachments}
              conversationId={conversationId}
              inputId="file-upload-composer"
            />
          </div>
        )}
        
        {/* Desktop controls */}
        {!isMobile && (
          <div className="flex items-center justify-between p-3 bg-gray-50 border-t border-gray-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFileUpload}
              className="text-gray-500 hover:text-gray-700 text-sm"
              disabled={isSending}
            >
              <Paperclip className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Attach File</span>
              <span className="sm:hidden">File</span>
            </Button>
          </div>
        )}
      </div>
      
      {/* Mobile file upload area */}
      {isMobile && showFileUpload && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <FileUploadManager
            attachments={attachments}
            onAttachmentsChange={setAttachments}
            conversationId={conversationId}
            inputId="file-upload-composer-mobile"
          />
        </div>
      )}
    </div>
  );
};

export default MessageComposer;
