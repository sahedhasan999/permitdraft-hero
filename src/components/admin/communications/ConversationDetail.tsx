
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { ConversationType } from '@/types/communications';
import MessageItem from './MessageItem';
import SuggestedReplyEditor from './SuggestedReplyEditor';

interface ConversationDetailProps {
  selectedConversation: ConversationType | null;
  conversations: ConversationType[];
  setConversations: React.Dispatch<React.SetStateAction<ConversationType[]>>;
  setSelectedConversation: (conversation: ConversationType) => void;
  suggestedReply: string;
  setSuggestedReply: (reply: string) => void;
  replyText: string;
  setReplyText: (text: string) => void;
  handleSendReply: () => void;
}

const ConversationDetail: React.FC<ConversationDetailProps> = ({
  selectedConversation,
  conversations,
  setConversations,
  setSelectedConversation,
  suggestedReply,
  setSuggestedReply,
  replyText,
  setReplyText,
  handleSendReply,
}) => {
  if (!selectedConversation) {
    return (
      <div className="w-full md:w-2/3 bg-card border rounded-lg shadow-sm flex items-center justify-center">
        <div className="text-center p-6">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Conversation Selected</h3>
          <p className="text-muted-foreground">Select a conversation from the list to view details</p>
        </div>
      </div>
    );
  }

  const toggleConversationStatus = () => {
    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        const newStatus: 'active' | 'closed' = conv.status === 'active' ? 'closed' : 'active';
        return {
          ...conv,
          status: newStatus
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    // Find the updated conversation and pass it to setSelectedConversation
    const updatedConversation = updatedConversations.find(c => c.id === selectedConversation.id);
    if (updatedConversation) {
      setSelectedConversation(updatedConversation);
    }
  };

  return (
    <div className="w-full md:w-2/3 bg-card border rounded-lg shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold">{selectedConversation.subject}</h3>
            <p className="text-sm text-muted-foreground">
              Conversation with {selectedConversation.customer} ({selectedConversation.email})
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleConversationStatus}
          >
            {selectedConversation.status === 'active' ? 'Close' : 'Reopen'} Conversation
          </Button>
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 bg-muted/30">
        {selectedConversation.messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
      </div>
      
      {selectedConversation.status === 'active' && (
        <div className="p-4 border-t">
          <SuggestedReplyEditor 
            suggestedReply={suggestedReply}
            setSuggestedReply={setSuggestedReply}
            replyText={replyText}
            setReplyText={setReplyText}
            handleSendReply={handleSendReply}
          />
        </div>
      )}
    </div>
  );
};

export default ConversationDetail;
