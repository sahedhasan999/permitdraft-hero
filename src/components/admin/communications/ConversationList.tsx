
import React from 'react';
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConversationType } from '@/types/communications';

interface ConversationListProps {
  conversations: ConversationType[];
  selectedConversation: ConversationType | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setSelectedConversation: (conversation: ConversationType) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversation,
  searchTerm,
  setSearchTerm,
  setSelectedConversation,
}) => {
  const filteredConversations = conversations.filter(conv => 
    conv.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderConversationItem = (conv: ConversationType) => (
    <div 
      key={conv.id}
      onClick={() => setSelectedConversation(conv)}
      className={`p-3 mb-2 rounded-md cursor-pointer transition-colors ${
        selectedConversation?.id === conv.id 
          ? 'bg-primary/10' 
          : 'hover:bg-muted'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium">{conv.customer}</h4>
          <p className="text-sm text-muted-foreground truncate">{conv.subject}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          conv.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {conv.status === 'active' ? 'Active' : 'Closed'}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {new Date(conv.lastUpdated).toLocaleDateString()}
      </p>
    </div>
  );

  return (
    <div className="w-full md:w-1/3 bg-card border rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            className="pl-9"
            placeholder="Search conversations..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full px-4 pt-2">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="pt-2">
          <div className="h-[calc(100vh-20rem)] overflow-y-auto">
            {filteredConversations.map(renderConversationItem)}
          </div>
        </TabsContent>
        
        <TabsContent value="active" className="pt-2">
          <div className="h-[calc(100vh-20rem)] overflow-y-auto">
            {filteredConversations
              .filter(conv => conv.status === 'active')
              .map(renderConversationItem)}
          </div>
        </TabsContent>
        
        <TabsContent value="closed" className="pt-2">
          <div className="h-[calc(100vh-20rem)] overflow-y-auto">
            {filteredConversations
              .filter(conv => conv.status === 'closed')
              .map(renderConversationItem)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConversationList;
