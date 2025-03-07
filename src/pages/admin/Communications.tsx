
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchIcon, MessageSquare, Edit, Check, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for AI communications
const mockCommunications = [
  {
    id: 'comm-001',
    customer: 'John Doe',
    email: 'john@example.com',
    subject: 'Deck Design Questions',
    messages: [
      { id: 'm1', sender: 'customer', content: 'I have some questions about your deck design services.', timestamp: '2023-09-10T10:30:00Z' },
      { id: 'm2', sender: 'ai', content: 'Thank you for your interest! I\'d be happy to help with any questions about our deck design services. What would you like to know?', timestamp: '2023-09-10T10:32:00Z' },
      { id: 'm3', sender: 'customer', content: 'What materials do you typically use for decks?', timestamp: '2023-09-10T10:35:00Z' },
      { id: 'm4', sender: 'ai', content: 'We offer a variety of materials including pressure-treated lumber, cedar, composite, and PVC. Each has its own benefits in terms of cost, maintenance, and appearance. Would you like more details on any specific material?', timestamp: '2023-09-10T10:37:00Z' },
    ],
    status: 'active',
    lastUpdated: '2023-09-10T10:37:00Z'
  },
  {
    id: 'comm-002',
    customer: 'Jane Smith',
    email: 'jane@example.com',
    subject: 'Pricing for Patio Installation',
    messages: [
      { id: 'm1', sender: 'customer', content: 'Can you provide pricing for a 12x15 patio installation?', timestamp: '2023-09-09T14:20:00Z' },
      { id: 'm2', sender: 'ai', content: 'Thanks for your inquiry about a 12x15 patio installation. The cost typically ranges from $3,600 to $7,200 depending on the materials and complexity. Would you like a more detailed quote based on specific materials?', timestamp: '2023-09-09T14:25:00Z' },
    ],
    status: 'active',
    lastUpdated: '2023-09-09T14:25:00Z'
  },
  {
    id: 'comm-003',
    customer: 'Robert Johnson',
    email: 'robert@example.com',
    subject: 'Home Addition Timeline',
    messages: [
      { id: 'm1', sender: 'customer', content: 'What's the typical timeline for a small home addition?', timestamp: '2023-09-08T09:15:00Z' },
      { id: 'm2', sender: 'ai', content: 'For a small home addition, the timeline typically ranges from 6-12 weeks from design approval to completion. This includes permitting (2-3 weeks), construction (3-8 weeks), and finishing work (1-2 weeks). Would you like more details about a specific type of addition?', timestamp: '2023-09-08T09:20:00Z' },
      { id: 'm3', sender: 'customer', content: 'Yes, I'm interested in adding a bedroom and bathroom.', timestamp: '2023-09-08T09:25:00Z' },
      { id: 'm4', sender: 'ai', content: 'A bedroom and bathroom addition typically falls on the longer end of the timeline, around 8-12 weeks due to the plumbing work involved. The permitting process might also take a bit longer. Would you like to schedule a consultation to discuss your specific requirements?', timestamp: '2023-09-08T09:30:00Z' },
    ],
    status: 'closed',
    lastUpdated: '2023-09-08T09:30:00Z'
  },
];

const Communications = () => {
  const [conversations, setConversations] = useState(mockCommunications);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [replyText, setReplyText] = useState('');
  const [suggestedReply, setSuggestedReply] = useState("I'd be happy to provide more information about our services. Could you please provide some specific details about your project requirements?");
  const [isEditing, setIsEditing] = useState(false);

  const filteredConversations = conversations.filter(conv => 
    conv.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendReply = () => {
    const textToSend = replyText || suggestedReply;
    if (!textToSend.trim()) return;

    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        const newMessage = {
          id: `m${conv.messages.length + 1}`,
          sender: 'ai',
          content: textToSend,
          timestamp: new Date().toISOString()
        };
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastUpdated: new Date().toISOString()
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setSelectedConversation(updatedConversations.find(c => c.id === selectedConversation.id)!);
    setReplyText('');
    setSuggestedReply("Is there anything else I can help you with regarding your project?");
  };

  return (
    <AdminLayout>
      <div className="h-full flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">AI Communications Center</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor AI-assisted customer communications
          </p>
        </div>

        <div className="flex flex-col md:flex-row h-[calc(100vh-13rem)] space-y-4 md:space-y-0 md:space-x-4">
          {/* Conversation List */}
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
                  {filteredConversations.map((conv) => (
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
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="active" className="pt-2">
                <div className="h-[calc(100vh-20rem)] overflow-y-auto">
                  {filteredConversations
                    .filter(conv => conv.status === 'active')
                    .map((conv) => (
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
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(conv.lastUpdated).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="closed" className="pt-2">
                <div className="h-[calc(100vh-20rem)] overflow-y-auto">
                  {filteredConversations
                    .filter(conv => conv.status === 'closed')
                    .map((conv) => (
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
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(conv.lastUpdated).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Conversation Detail */}
          {selectedConversation ? (
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
                    onClick={() => {
                      const updatedConversations = conversations.map(conv => {
                        if (conv.id === selectedConversation.id) {
                          return {
                            ...conv,
                            status: conv.status === 'active' ? 'closed' : 'active'
                          };
                        }
                        return conv;
                      });
                      setConversations(updatedConversations);
                      setSelectedConversation(updatedConversations.find(c => c.id === selectedConversation.id)!);
                    }}
                  >
                    {selectedConversation.status === 'active' ? 'Close' : 'Reopen'} Conversation
                  </Button>
                </div>
              </div>
              
              <div className="flex-grow overflow-y-auto p-4 bg-muted/30">
                {selectedConversation.messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`mb-4 max-w-3xl ${
                      message.sender === 'customer' ? 'ml-0 mr-auto' : 'ml-auto mr-0'
                    }`}
                  >
                    <div className={`p-3 rounded-lg ${
                      message.sender === 'customer' 
                        ? 'bg-muted text-foreground' 
                        : 'bg-primary/10 text-foreground'
                    }`}>
                      <p>{message.content}</p>
                    </div>
                    <div className={`text-xs text-muted-foreground mt-1 ${
                      message.sender === 'customer' ? 'text-left' : 'text-right'
                    }`}>
                      {message.sender === 'customer' ? 'Customer' : 'AI'} • {
                        new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      }
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedConversation.status === 'active' && (
                <div className="p-4 border-t">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-muted-foreground">AI Suggested Reply</h4>
                      <div className="flex gap-2">
                        {isEditing ? (
                          <>
                            <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                              <X className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => {
                              setIsEditing(false);
                              // Save the edited suggested reply
                            }}>
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
                      <textarea
                        className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                        onClick={() => {
                          setReplyText('');
                          setSuggestedReply("I'd be happy to provide more information about our services. Could you please provide some specific details about your project requirements?");
                        }}
                      >
                        Reset
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => {
                          setReplyText(suggestedReply);
                          setSuggestedReply('');
                        }}
                      >
                        Use This Reply
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <textarea
                      className="flex-grow px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                </div>
              )}
            </div>
          ) : (
            <div className="w-full md:w-2/3 bg-card border rounded-lg shadow-sm flex items-center justify-center">
              <div className="text-center p-6">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Conversation Selected</h3>
                <p className="text-muted-foreground">Select a conversation from the list to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Communications;
