
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip } from 'lucide-react';
import { FileAttachment } from '@/types/communications';
import { sendMessage } from '@/services/firebaseMessagingService';
import { useToast } from '@/hooks/use-toast';
import FileUploadManager from './FileUploadManager';

interface MessageComposerProps {
  conversationId: string;
}

const MessageComposer: React.FC<MessageComposerProps> = ({ conversationId }) => {
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
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
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-3 lg:space-y-4">
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <Textarea
          placeholder="Type your message here..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border-0 resize-none focus:ring-0 min-h-[60px] lg:min-h-[80px] text-sm lg:text-base"
        />
        
        {showFileUpload && (
          <div className="border-t border-gray-200 p-3 bg-gray-50">
            <FileUploadManager
              attachments={attachments}
              onAttachmentsChange={setAttachments}
              conversationId={conversationId}
              inputId="file-upload-composer"
            />
          </div>
        )}
        
        <div className="flex items-center justify-between p-3 bg-gray-50 border-t border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFileUpload(!showFileUpload)}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            <Paperclip className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Attach File</span>
            <span className="sm:hidden">File</span>
          </Button>
          
          <Button 
            onClick={handleSendMessage}
            disabled={isSending || (!newMessage.trim() && attachments.length === 0)}
            className="bg-blue-600 hover:bg-blue-700 text-sm lg:text-base px-4 lg:px-6"
          >
            <Send className="h-4 w-4 mr-1" />
            {isSending ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageComposer;
