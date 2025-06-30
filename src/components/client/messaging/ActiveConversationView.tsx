
import React from 'react';
import { MessageSquare, Headphones, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConversationType, MessageType } from '@/types/communications';
import MessageItem from '@/components/admin/communications/MessageItem';
import MessageComposer from './MessageComposer';
import NewConversationDialog from './NewConversationDialog';

interface ActiveConversationViewProps {
  activeConversation: ConversationType | null;
  currentMessages: MessageType[];
  hasConversations: boolean;
  onNewConversationCreated?: (conversation: ConversationType) => void;
  onBackToList?: () => void;
  isMobile?: boolean;
}

const ActiveConversationView: React.FC<ActiveConversationViewProps> = ({
  activeConversation,
  currentMessages,
  hasConversations,
  onNewConversationCreated,
  onBackToList,
  isMobile = false
}) => {
  if (!activeConversation) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="text-center p-6 lg:p-8 max-w-md">
          <MessageSquare className="h-12 w-12 lg:h-16 lg:w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg lg:text-xl font-semibold text-gray-600 mb-2">
            {hasConversations ? "No Conversation Selected" : "Welcome to Support"}
          </h3>
          <p className="text-sm lg:text-base text-gray-500 mb-6">
            {hasConversations
              ? 'Select a conversation from the sidebar to continue messaging our support team.'
              : 'Start a conversation with our support team. We\'re here to help with any questions about your projects.'}
          </p>
          <NewConversationDialog
            onConversationCreated={onNewConversationCreated}
            triggerButtonText={hasConversations ? "Start New Conversation" : "Contact Support"}
            triggerButtonClassName="bg-blue-600 hover:bg-blue-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-medium transition-colors text-sm lg:text-base"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b bg-white shadow-sm">
        <div className="flex items-center space-x-3 lg:space-x-4">
          {isMobile && onBackToList && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToList}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Headphones className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900 truncate">{activeConversation.subject}</h2>
            <p className="text-xs lg:text-sm text-gray-600">Support conversation</p>
          </div>
          <div className={`px-2 lg:px-3 py-1 rounded-full text-xs font-medium ${
            activeConversation.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {activeConversation.status === 'active' ? 'Active' : 'Closed'}
          </div>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gray-50">
        {currentMessages.length === 0 ? (
          <div className="text-center py-8 lg:py-12">
            <MessageSquare className="h-10 w-10 lg:h-12 lg:w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm lg:text-base text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-3 lg:space-y-4 max-w-4xl mx-auto">
            {currentMessages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))}
          </div>
        )}
      </div>
      
      {/* Message Composer */}
      {activeConversation.status === 'active' && (
        <div className="p-4 lg:p-6 border-t bg-white">
          <div className="max-w-4xl mx-auto">
            <MessageComposer conversationId={activeConversation.id} />
          </div>
        </div>
      )}
      
      {activeConversation.status === 'closed' && (
        <div className="p-4 lg:p-6 border-t bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <p className="text-center text-gray-500 text-sm lg:text-base">
              This conversation has been closed. Contact support to start a new conversation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveConversationView;
