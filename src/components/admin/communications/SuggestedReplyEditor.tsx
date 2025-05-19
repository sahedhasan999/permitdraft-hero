
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Edit, Check, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface SuggestedReplyEditorProps {
  suggestedReply: string;
  setSuggestedReply: (reply: string) => void;
  replyText: string;
  setReplyText: (text: string) => void;
  handleSendReply: () => void;
}

const SuggestedReplyEditor: React.FC<SuggestedReplyEditorProps> = ({
  suggestedReply,
  setSuggestedReply,
  replyText,
  setReplyText,
  handleSendReply,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleResetReply = () => {
    setReplyText('');
    setSuggestedReply("I'd be happy to provide more information about our services. Could you please provide some specific details about your project requirements?");
  };

  const handleUseReply = () => {
    setReplyText(suggestedReply);
    setSuggestedReply('');
  };

  return (
    <>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-muted-foreground">AI Suggested Reply</h4>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                  <X className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                  <Check className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        {isEditing ? (
          <Textarea
            className="text-sm"
            rows={3}
            value={suggestedReply}
            onChange={(e) => setSuggestedReply(e.target.value)}
          />
        ) : (
          <div 
            className="p-3 bg-primary/5 rounded-md text-sm"
            onClick={() => setIsEditing(true)}
          >
            {suggestedReply}
          </div>
        )}
        
        <div className="mt-2 flex justify-end space-x-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleResetReply}
          >
            Reset
          </Button>
          <Button 
            size="sm"
            onClick={handleUseReply}
          >
            Use This Reply
          </Button>
        </div>
      </div>
      
      <div className="flex items-start space-x-2">
        <Textarea
          className="flex-grow text-sm"
          rows={3}
          placeholder="Type your custom reply here..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        />
        <Button className="flex-shrink-0" onClick={handleSendReply}>
          <MessageSquare className="h-4 w-4 mr-2" />
          Send
        </Button>
      </div>
    </>
  );
};

export default SuggestedReplyEditor;
