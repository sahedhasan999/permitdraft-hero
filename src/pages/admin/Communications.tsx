
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ConversationList from '@/components/admin/communications/ConversationList';
import ConversationDetail from '@/components/admin/communications/ConversationDetail';
import { ConversationType, FileAttachment } from '@/types/communications';
import { subscribeToAllConversations, sendMessage, createConversation } from '@/services/firebaseMessagingService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Users } from 'lucide-react';

const Communications = () => {
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<ConversationType | null>(null);
  const [showNewConversationDialog, setShowNewConversationDialog] = useState(false);
  const [newConversationSubject, setNewConversationSubject] = useState('');
  const [newConversationMessage, setNewConversationMessage] = useState('');
  const [newConversationEmail, setNewConversationEmail] = useState('');
  const [newConversationName, setNewConversationName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    console.log('Setting up admin conversations subscription');
    const unsubscribe = subscribeToAllConversations((allConversations) => {
      console.log('Admin received conversations:', allConversations);
      setConversations(allConversations);
      
      if (selectedConversation) {
        const updatedSelectedConversation = allConversations.find(conv => conv.id === selectedConversation.id);
        if (updatedSelectedConversation) {
          setSelectedConversation(updatedSelectedConversation);
        }
      } else if (allConversations.length > 0) {
        setSelectedConversation(allConversations[0]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const customerToMessage = sessionStorage.getItem('customerToMessage');
    if (customerToMessage) {
      const customerData = JSON.parse(customerToMessage);
      setNewConversationEmail(customerData.email);
      setNewConversationName(customerData.name);
      setNewConversationSubject(`Order ${customerData.orderId.substring(0, 8).toUpperCase()} Support`);
      setNewConversationMessage('Hello! I wanted to reach out regarding your recent order. How can I assist you today?');
      setShowNewConversationDialog(true);
      sessionStorage.removeItem('customerToMessage');
    }
  }, []);

  const handleSendReply = async (message: string, attachments?: FileAttachment[]) => {
    if (!selectedConversation) return;
    
    if (!message.trim() && (!attachments || attachments.length === 0)) return;

    try {
      await sendMessage(selectedConversation.id, 'admin', message, attachments || []);
      
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully."
      });
    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive"
      });
    }
  };

  const handleCreateNewConversation = async () => {
    if (!newConversationEmail.trim() || !newConversationName.trim() || !newConversationSubject.trim() || !newConversationMessage.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      await createConversation(
        'admin-created',
        newConversationEmail,
        newConversationName,
        newConversationSubject,
        newConversationMessage,
        []
      );

      setShowNewConversationDialog(false);
      setNewConversationEmail('');
      setNewConversationName('');
      setNewConversationSubject('');
      setNewConversationMessage('');

      toast({
        title: "Conversation created",
        description: "New conversation has been started with the customer."
      });
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Error",
        description: "Failed to create conversation.",
        variant: "destructive"
      });
    }
  };

  const activeConversations = conversations.filter(conv => conv.status === 'active');
  const totalMessages = conversations.reduce((sum, conv) => sum + (conv.messages?.length || 0), 0);

  return (
    <AdminLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Communications Center</h1>
              <p className="text-gray-600 mt-1">
                Manage customer conversations and support requests
              </p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Conversations</p>
                  <p className="text-2xl font-semibold text-gray-900">{conversations.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Conversations</p>
                  <p className="text-2xl font-semibold text-gray-900">{activeConversations.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Messages</p>
                  <p className="text-2xl font-semibold text-gray-900">{totalMessages}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex bg-gray-50 rounded-lg shadow-sm overflow-hidden">
          <ConversationList
            conversations={conversations}
            selectedConversation={selectedConversation}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setSelectedConversation={setSelectedConversation}
            onNewConversation={() => setShowNewConversationDialog(true)}
          />
          
          <ConversationDetail
            selectedConversation={selectedConversation}
            conversations={conversations}
            setConversations={setConversations}
            setSelectedConversation={setSelectedConversation}
            handleSendReply={handleSendReply}
          />
        </div>

        {/* New Conversation Dialog */}
        <Dialog open={showNewConversationDialog} onOpenChange={setShowNewConversationDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Start New Conversation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Customer Name</label>
                <Input
                  placeholder="Enter customer name"
                  value={newConversationName}
                  onChange={(e) => setNewConversationName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Customer Email</label>
                <Input
                  type="email"
                  placeholder="Enter customer email"
                  value={newConversationEmail}
                  onChange={(e) => setNewConversationEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Subject</label>
                <Input
                  placeholder="Enter conversation subject"
                  value={newConversationSubject}
                  onChange={(e) => setNewConversationSubject(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Initial Message</label>
                <Textarea
                  placeholder="Type your initial message..."
                  value={newConversationMessage}
                  onChange={(e) => setNewConversationMessage(e.target.value)}
                  className="min-h-[80px] mt-1"
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleCreateNewConversation}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Start Conversation
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowNewConversationDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Communications;
