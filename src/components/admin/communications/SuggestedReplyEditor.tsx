
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { FileAttachment } from '@/types/communications';
import FileAttachmentComponent from './FileAttachment';

interface SuggestedReplyEditorProps {
  replyText: string;
  setReplyText: (text: string) => void;
  handleSendReply: (attachments?: FileAttachment[]) => void;
}

const SuggestedReplyEditor: React.FC<SuggestedReplyEditorProps> = ({
  replyText,
  setReplyText,
  handleSendReply,
}) => {
  const [attachments, setAttachments] = React.useState<FileAttachment[]>([]);

  const handleSend = () => {
    handleSendReply(attachments);
    setAttachments([]);
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Textarea
          placeholder="Type your message here..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          className="min-h-[100px]"
        />
        
        <FileAttachmentComponent
          attachments={attachments}
          onAttachmentsChange={setAttachments}
        />
        
        <div className="flex justify-end">
          <Button onClick={handleSend} disabled={!replyText.trim() && attachments.length === 0}>
            <Send className="h-4 w-4 mr-1" />
            Send Reply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuggestedReplyEditor;
