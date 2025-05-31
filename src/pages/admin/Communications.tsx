
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

const Communications = () => {
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<ConversationType | null>(null);
  const [replyText, setReplyText] = useState('');
  const [suggestedReply, setSuggestedReply] = useState("I'd be happy to provide more information about our services. Could you please provide some specific details about your project requirements?");
  const [showNewConversationDialog, setShowNewConversationDialog] = useState(false);
  const [newConversationSubject, setNewConversationSubject] = useState('');
  const [newConversationMessage, setNewConversationMessage] = useState('');
  const [newConversationEmail, setNewConversationEmail] = useState('');
  const [newConversationName, setNewConversationName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = subscribeToAllConversations((allConversations) => {
      setConversations(allConversations);
      if (allConversations.length > 0 && !selectedConversation) {
        setSelectedConversation(allConversations[0]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Check if we need to start a conversation with a specific customer
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

  const handleSendReply = async (attachments?: FileAttachment[]) => {
    if (!selectedConversation) return;
    
    const textToSend = replyText || suggestedReply;
    if (!textToSend.trim() && (!attachments || attachments.length === 0)) return;

    try {
      await sendMessage(selectedConversation.id, 'admin', textToSend, attachments || []);
      setReplyText('');
      setSuggestedReply("Is there anything else I can help you with regarding your project?");
    } catch (error) {
      console.error('Error sending reply:', error);
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
      const conversationId = await createConversation(
        'admin-created', // temporary userId for admin-created conversations
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

  return (
    <AdminLayout>
      <div className="h-full flex flex-col">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">AI Communications Center</h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor AI-assisted customer communications
            </p>
          </div>
          <Button onClick={() => setShowNewConversationDialog(true)}>
            Start New Conversation
          </Button>
        </div>

        <div className="flex flex-col md:flex-row h-[calc(100vh-13rem)] space-y-4 md:space-y-0 md:space-x-4">
          <ConversationList
            conversations={conversations}
            selectedConversation={selectedConversation}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setSelectedConversation={setSelectedConversation}
          />
          
          <ConversationDetail
            selectedConversation={selectedConversation}
            conversations={conversations}
            setConversations={setConversations}
            setSelectedConversation={setSelectedConversation}
            suggestedReply={suggestedReply}
            setSuggestedReply={setSuggestedReply}
            replyText={replyText}
            setReplyText={setReplyText}
            handleSendReply={handleSendReply}
          />
        </div>

        {/* New Conversation Dialog */}
        <Dialog open={showNewConversationDialog} onOpenChange={setShowNewConversationDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start New Conversation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Customer Name</label>
                <Input
                  placeholder="Enter customer name"
                  value={newConversationName}
                  onChange={(e) => setNewConversationName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Customer Email</label>
                <Input
                  placeholder="Enter customer email"
                  value={newConversationEmail}
                  onChange={(e) => setNewConversationEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input
                  placeholder="Enter conversation subject"
                  value={newConversationSubject}
                  onChange={(e) => setNewConversationSubject(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Initial Message</label>
                <Textarea
                  placeholder="Type your initial message..."
                  value={newConversationMessage}
                  onChange={(e) => setNewConversationMessage(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleCreateNewConversation}
                  className="flex-1"
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
