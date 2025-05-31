
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
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
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!conversationId || (!newMessage.trim() && attachments.length === 0)) return;

    setIsSending(true);
    try {
      await sendMessage(conversationId, 'customer', newMessage, attachments);
      setNewMessage('');
      setAttachments([]);

      toast({
        title: "Message sent",
        description: "Your message has been sent successfully."
      });
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

  return (
    <div className="border-t pt-4 space-y-3">
      <Textarea
        placeholder="Type your message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        className="min-h-[80px]"
      />
      
      <FileUploadManager
        attachments={attachments}
        onAttachmentsChange={setAttachments}
        conversationId={conversationId}
        inputId="file-upload"
      />
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSendMessage}
          disabled={isSending || (!newMessage.trim() && attachments.length === 0)}
        >
          <Send className="h-4 w-4 mr-1" />
          {isSending ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </div>
  );
};

export default MessageComposer;
