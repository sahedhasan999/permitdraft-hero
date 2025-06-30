
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConversationType } from '@/types/communications';
import { Search, Plus, MessageCircle, Clock } from 'lucide-react';
import NewConversationDialog from './NewConversationDialog';

interface ConversationsListProps {
  conversations: ConversationType[];
  activeConversation: ConversationType | null;
  onConversationSelect: (conversation: ConversationType) => void;
  onNewConversationCreated?: (conversation: ConversationType) => void;
}

const ConversationsList: React.FC<ConversationsListProps> = ({
  conversations,
  activeConversation,
  onConversationSelect,
  onNewConversationCreated
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Messages</h2>
          <NewConversationDialog 
            onConversationCreated={onNewConversationCreated}
            triggerButtonText="New"
            triggerButtonIcon={<Plus className="h-4 w-4 mr-1" />}
            triggerButtonClassName="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 text-sm rounded-lg"
          />
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-6 lg:py-8 px-4">
            {conversations.length === 0 ? (
              <>
                <MessageCircle className="h-10 w-10 lg:h-12 lg:w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm mb-4">No conversations yet</p>
                <NewConversationDialog 
                  onConversationCreated={onNewConversationCreated}
                  triggerButtonText="Start your first conversation"
                  triggerButtonClassName="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-lg"
                />
              </>
            ) : (
              <>
                <Clock className="h-10 w-10 lg:h-12 lg:w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No conversations found</p>
              </>
            )}
          </div>
        ) : (
          <div className="p-2">
            {filteredConversations.map(conversation => {
              const lastMessage = conversation.messages && conversation.messages.length > 0 
                ? conversation.messages[conversation.messages.length - 1]?.content || 'No messages yet'
                : 'Start a conversation...';
              
              const isActive = activeConversation?.id === conversation.id;
              
              return (
                <div
                  key={conversation.id}
                  onClick={() => onConversationSelect(conversation)}
                  className={`p-3 lg:p-4 rounded-lg cursor-pointer transition-all duration-200 border-l-4 mb-2 ${
                    isActive
                      ? 'bg-blue-50 border-l-blue-500 shadow-sm'
                      : 'hover:bg-gray-50 border-l-transparent hover:border-l-gray-200 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900 truncate text-sm lg:text-base pr-2">
                      {conversation.subject}
                    </h3>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      conversation.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {conversation.status === 'active' ? 'Active' : 'Closed'}
                    </div>
                  </div>
                  
                  <p className="text-xs lg:text-sm text-gray-500 mb-2 line-clamp-2 leading-relaxed">
                    {lastMessage.length > 60 ? `${lastMessage.substring(0, 60)}...` : lastMessage}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{new Date(conversation.lastUpdated).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>{conversation.messages?.length || 0}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsList;
