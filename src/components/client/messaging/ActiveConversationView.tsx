
import React from 'react';
import { MessageSquare, Headphones } from 'lucide-react';
import { ConversationType, MessageType } from '@/types/communications';
import MessageItem from '@/components/admin/communications/MessageItem';
import MessageComposer from './MessageComposer';
import NewConversationDialog from './NewConversationDialog';

interface ActiveConversationViewProps {
  activeConversation: ConversationType | null;
  currentMessages: MessageType[];
  hasConversations: boolean;
  onNewConversationCreated?: (conversation: ConversationType) => void;
}

const ActiveConversationView: React.FC<ActiveConversationViewProps> = ({
  activeConversation,
  currentMessages,
  hasConversations,
  onNewConversationCreated
}) => {
  if (!activeConversation) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="text-center p-8">
          <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {hasConversations ? "No Conversation Selected" : "Welcome to Support"}
          </h3>
          <p className="text-gray-500 mb-6 max-w-md">
            {hasConversations
              ? 'Select a conversation from the sidebar to continue messaging our support team.'
              : 'Start a conversation with our support team. We\'re here to help with any questions about your projects.'}
          </p>
          <NewConversationDialog
            onConversationCreated={onNewConversationCreated}
            triggerElement={
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                {hasConversations ? "Start New Conversation" : "Contact Support"}
              </button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b bg-white">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Headphones className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{activeConversation.subject}</h2>
            <p className="text-sm text-gray-600">Support conversation</p>
          </div>
          <div className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${
            activeConversation.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {activeConversation.status === 'active' ? 'Active' : 'Closed'}
          </div>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {currentMessages.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentMessages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))}
          </div>
        )}
      </div>
      
      {/* Message Composer */}
      {activeConversation.status === 'active' && (
        <div className="p-6 border-t bg-white">
          <MessageComposer conversationId={activeConversation.id} />
        </div>
      )}
      
      {activeConversation.status === 'closed' && (
        <div className="p-6 border-t bg-gray-50">
          <p className="text-center text-gray-500 text-sm">
            This conversation has been closed. Contact support to start a new conversation.
          </p>
        </div>
      )}
    </div>
  );
};

export default ActiveConversationView;
