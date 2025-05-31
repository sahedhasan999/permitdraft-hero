
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Lightbulb } from 'lucide-react';
import { FileAttachment } from '@/types/communications';
import FileAttachmentComponent from './FileAttachment';

interface SuggestedReplyEditorProps {
  suggestedReply: string;
  setSuggestedReply: (reply: string) => void;
  replyText: string;
  setReplyText: (text: string) => void;
  handleSendReply: (attachments?: FileAttachment[]) => void;
}

const SuggestedReplyEditor: React.FC<SuggestedReplyEditorProps> = ({
  suggestedReply,
  setSuggestedReply,
  replyText,
  setReplyText,
  handleSendReply,
}) => {
  const [attachments, setAttachments] = React.useState<FileAttachment[]>([]);

  const handleSend = () => {
    handleSendReply(attachments);
    setAttachments([]);
  };

  const useSuggestedReply = () => {
    setReplyText(suggestedReply);
  };

  return (
    <div className="space-y-3">
      <div className="bg-blue-50 p-3 rounded-lg border">
        <div className="flex items-start space-x-2 mb-2">
          <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900">AI Suggested Reply</p>
            <p className="text-sm text-blue-700 mt-1">{suggestedReply}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={useSuggestedReply}
          className="w-full"
        >
          Use This Reply
        </Button>
      </div>

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
