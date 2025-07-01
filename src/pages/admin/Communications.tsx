
import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ConversationList from '@/components/admin/communications/ConversationList';
import ConversationDetail from '@/components/admin/communications/ConversationDetail';
import { ConversationType, FileAttachment } from '@/types/communications';
import { subscribeToAllConversations, sendMessage, createConversation } from '@/services/firebaseMessagingService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';
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
  const [showConversationList, setShowConversationList] = useState(true);
  const isMobile = useIsMobile();

  // Memoize conversation updates to prevent unnecessary re-renders
  const handleConversationsUpdate = useCallback((allConversations: ConversationType[]) => {
    console.log('Admin received conversations:', allConversations);
    setConversations(allConversations);
    
    // Update selected conversation if it exists
    if (selectedConversation) {
      const updatedSelectedConversation = allConversations.find(conv => conv.id === selectedConversation.id);
      if (updatedSelectedConversation) {
        setSelectedConversation(updatedSelectedConversation);
      }
    } else if (allConversations.length > 0) {
      setSelectedConversation(allConversations[0]);
    }
  }, [selectedConversation]);

  useEffect(() => {
    console.log('Setting up admin conversations subscription');
    const unsubscribe = subscribeToAllConversations(handleConversationsUpdate);
    return () => unsubscribe();
  }, [handleConversationsUpdate]);

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

  // Optimized message sending with immediate UI update
  const handleSendReply = useCallback(async (message: string, attachments?: FileAttachment[]) => {
    if (!selectedConversation) return;
    
    if (!message.trim() && (!attachments || attachments.length === 0)) return;

    try {
      // Send message without showing toast notification
      await sendMessage(selectedConversation.id, 'admin', message, attachments || []);
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  }, [selectedConversation]);

  const handleCreateNewConversation = useCallback(async () => {
    if (!newConversationEmail.trim() || !newConversationName.trim() || !newConversationSubject.trim() || !newConversationMessage.trim()) {
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
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  }, [newConversationEmail, newConversationName, newConversationSubject, newConversationMessage]);

  const handleConversationSelect = useCallback((conversation: ConversationType) => {
    setSelectedConversation(conversation);
    if (isMobile) {
      setShowConversationList(false);
    }
  }, [isMobile]);

  const handleBackToList = useCallback(() => {
    if (isMobile) {
      setShowConversationList(true);
      setSelectedConversation(null);
    }
  }, [isMobile]);

  // Memoize stats calculations
  const stats = React.useMemo(() => {
    const activeConversations = conversations.filter(conv => conv.status === 'active');
    const totalMessages = conversations.reduce((sum, conv) => sum + (conv.messages?.length || 0), 0);
    return { activeConversations, totalMessages };
  }, [conversations]);

  return (
    <AdminLayout>
      <div className="flex flex-col h-[calc(100vh-80px)]">
        {/* Header - Hide on mobile when viewing conversation */}
        {(!isMobile || showConversationList) && (
          <div className="flex-shrink-0 p-4 lg:p-6 border-b bg-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Communications</h1>
                <p className="text-gray-600 mt-1 text-sm">
                  Manage customer conversations
                </p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 lg:gap-4">
              <div className="bg-gray-50 p-3 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-100 rounded flex items-center justify-center">
                    <MessageSquare className="h-3 w-3 lg:h-4 lg:w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Total</p>
                    <p className="text-sm lg:text-lg font-semibold text-gray-900">{conversations.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-green-100 rounded flex items-center justify-center">
                    <Users className="h-3 w-3 lg:h-4 lg:w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Active</p>
                    <p className="text-sm lg:text-lg font-semibold text-gray-900">{stats.activeConversations.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-purple-100 rounded flex items-center justify-center">
                    <MessageSquare className="h-3 w-3 lg:h-4 lg:w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Messages</p>
                    <p className="text-sm lg:text-lg font-semibold text-gray-900">{stats.totalMessages}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {isMobile ? (
            /* Mobile: Show either conversation list or detail */
            <>
              {showConversationList ? (
                <div className="w-full">
                  <ConversationList
                    conversations={conversations}
                    selectedConversation={selectedConversation}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    setSelectedConversation={handleConversationSelect}
                    onNewConversation={() => setShowNewConversationDialog(true)}
                  />
                </div>
              ) : (
                <div className="w-full">
                  <ConversationDetail
                    selectedConversation={selectedConversation}
                    conversations={conversations}
                    setConversations={setConversations}
                    setSelectedConversation={setSelectedConversation}
                    handleSendReply={handleSendReply}
                    onBackToList={handleBackToList}
                    isMobile={isMobile}
                  />
                </div>
              )}
            </>
          ) : (
            /* Desktop: Show both side by side */
            <>
              <div className="w-80 flex-shrink-0">
                <ConversationList
                  conversations={conversations}
                  selectedConversation={selectedConversation}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  setSelectedConversation={handleConversationSelect}
                  onNewConversation={() => setShowNewConversationDialog(true)}
                />
              </div>
              
              <div className="flex-1">
                <ConversationDetail
                  selectedConversation={selectedConversation}
                  conversations={conversations}
                  setConversations={setConversations}
                  setSelectedConversation={setSelectedConversation}
                  handleSendReply={handleSendReply}
                  isMobile={isMobile}
                />
              </div>
            </>
          )}
        </div>

        {/* New Conversation Dialog */}
        <Dialog open={showNewConversationDialog} onOpenChange={setShowNewConversationDialog}>
          <DialogContent className="max-w-md mx-4">
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
