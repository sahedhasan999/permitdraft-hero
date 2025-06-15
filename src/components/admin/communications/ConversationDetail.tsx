
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, MessageSquare, Clock, User } from 'lucide-react';
import { ConversationType, FileAttachment } from '@/types/communications';
import MessageItem from './MessageItem';
import FileAttachmentComponent from './FileAttachment';

interface ConversationDetailProps {
  selectedConversation: ConversationType | null;
  conversations: ConversationType[];
  setConversations: React.Dispatch<React.SetStateAction<ConversationType[]>>;
  setSelectedConversation: (conversation: ConversationType) => void;
  handleSendReply: (message: string, attachments?: FileAttachment[]) => void;
}

const ConversationDetail: React.FC<ConversationDetailProps> = ({
  selectedConversation,
  conversations,
  setConversations,
  setSelectedConversation,
  handleSendReply,
}) => {
  const [replyText, setReplyText] = React.useState('');
  const [attachments, setAttachments] = React.useState<FileAttachment[]>([]);

  const handleSend = () => {
    if (!replyText.trim() && attachments.length === 0) return;
    
    handleSendReply(replyText, attachments);
    setReplyText('');
    setAttachments([]);
  };

  if (!selectedConversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-center p-8">
          <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Conversation Selected</h3>
          <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
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
    const updatedConversation = updatedConversations.find(c => c.id === selectedConversation.id);
    if (updatedConversation) {
      setSelectedConversation(updatedConversation);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-6 border-b bg-white rounded-t-lg">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{selectedConversation.subject}</h2>
              <p className="text-sm text-gray-600 mt-1">
                Conversation with <span className="font-medium">{selectedConversation.customer}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">{selectedConversation.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              selectedConversation.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {selectedConversation.status === 'active' ? 'Active' : 'Closed'}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleConversationStatus}
              className="text-xs"
            >
              {selectedConversation.status === 'active' ? 'Close' : 'Reopen'}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {selectedConversation.messages.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          selectedConversation.messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))
        )}
      </div>
      
      {/* Reply Section */}
      {selectedConversation.status === 'active' && (
        <div className="p-6 border-t bg-white rounded-b-lg">
          <div className="space-y-4">
            <Textarea
              placeholder="Type your response here..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="min-h-[80px] border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            
            <div className="flex items-center justify-between">
              <FileAttachmentComponent
                attachments={attachments}
                onAttachmentsChange={setAttachments}
              />
              
              <Button 
                onClick={handleSend} 
                disabled={!replyText.trim() && attachments.length === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationDetail;
