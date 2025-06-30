
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchIcon, Plus, MessageCircle, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConversationType } from '@/types/communications';

interface ConversationListProps {
  conversations: ConversationType[];
  selectedConversation: ConversationType | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setSelectedConversation: (conversation: ConversationType) => void;
  onNewConversation: () => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversation,
  searchTerm,
  setSearchTerm,
  setSelectedConversation,
  onNewConversation,
}) => {
  const filteredConversations = conversations.filter(conv => 
    conv.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderConversationItem = (conv: ConversationType) => {
    const lastMessage = conv.messages && conv.messages.length > 0 
      ? conv.messages[conv.messages.length - 1]?.content 
      : 'No messages yet';
    
    const isSelected = selectedConversation?.id === conv.id;
    
    return (
      <div 
        key={conv.id}
        onClick={() => setSelectedConversation(conv)}
        className={`p-3 lg:p-4 cursor-pointer transition-all duration-200 border-l-4 ${
          isSelected 
            ? 'bg-blue-50 border-l-blue-500 shadow-sm' 
            : 'hover:bg-gray-50 border-l-transparent hover:border-l-gray-200'
        }`}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 truncate text-sm lg:text-base">{conv.customer}</h4>
            <p className="text-xs lg:text-sm text-gray-600 truncate">{conv.subject}</p>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${
            conv.status === 'active' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {conv.status === 'active' ? 'Active' : 'Closed'}
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mb-2 line-clamp-2">
          {lastMessage.length > 50 ? `${lastMessage.substring(0, 50)}...` : lastMessage}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{new Date(conv.lastUpdated).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })}</span>
          <div className="flex items-center space-x-1">
            <MessageCircle className="h-3 w-3" />
            <span>{conv.messages?.length || 0}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full bg-white border-r flex flex-col">
      {/* Header */}
      <div className="p-3 lg:p-4 border-b flex-shrink-0">
        <div className="flex items-center justify-between mb-3 lg:mb-4">
          <h2 className="text-base lg:text-lg font-semibold text-gray-900">Messages</h2>
          <Button onClick={onNewConversation} size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs lg:text-sm">
            <Plus className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
            New
          </Button>
        </div>
        
        <div className="relative">
          <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input 
            className="pl-9 border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
            placeholder="Search conversations..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Conversation List */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="all" className="h-full flex flex-col">
          <TabsList className="mx-3 lg:mx-4 mt-2 grid grid-cols-3">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="active" className="text-xs">Active</TabsTrigger>
            <TabsTrigger value="closed" className="text-xs">Closed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="flex-1 overflow-y-auto mt-2">
            {filteredConversations.length === 0 ? (
              <div className="text-center py-6 lg:py-8 px-4">
                <Clock className="h-10 w-10 lg:h-12 lg:w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No conversations found</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredConversations.map(renderConversationItem)}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="active" className="flex-1 overflow-y-auto mt-2">
            <div className="space-y-1">
              {filteredConversations
                .filter(conv => conv.status === 'active')
                .map(renderConversationItem)}
            </div>
          </TabsContent>
          
          <TabsContent value="closed" className="flex-1 overflow-y-auto mt-2">
            <div className="space-y-1">
              {filteredConversations
                .filter(conv => conv.status === 'closed')
                .map(renderConversationItem)}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ConversationList;
