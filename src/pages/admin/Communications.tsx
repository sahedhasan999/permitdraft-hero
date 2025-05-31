
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ConversationList from '@/components/admin/communications/ConversationList';
import ConversationDetail from '@/components/admin/communications/ConversationDetail';
import { ConversationType, FileAttachment } from '@/types/communications';
import { subscribeToAllConversations, sendMessage } from '@/services/firebaseMessagingService';

const Communications = () => {
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<ConversationType | null>(null);
  const [replyText, setReplyText] = useState('');
  const [suggestedReply, setSuggestedReply] = useState("I'd be happy to provide more information about our services. Could you please provide some specific details about your project requirements?");

  useEffect(() => {
    const unsubscribe = subscribeToAllConversations((allConversations) => {
      setConversations(allConversations);
      if (allConversations.length > 0 && !selectedConversation) {
        setSelectedConversation(allConversations[0]);
      }
    });

    return () => unsubscribe();
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
      </div>
    </AdminLayout>
  );
};

export default Communications;
