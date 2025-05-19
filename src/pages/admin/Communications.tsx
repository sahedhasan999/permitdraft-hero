
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ConversationList from '@/components/admin/communications/ConversationList';
import ConversationDetail from '@/components/admin/communications/ConversationDetail';
import { mockCommunications } from '@/data/mockCommunications';
import { ConversationType } from '@/types/communications';

const Communications = () => {
  const [conversations, setConversations] = useState<ConversationType[]>(mockCommunications);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<ConversationType>(conversations[0]);
  const [replyText, setReplyText] = useState('');
  const [suggestedReply, setSuggestedReply] = useState("I'd be happy to provide more information about our services. Could you please provide some specific details about your project requirements?");

  const handleSendReply = () => {
    const textToSend = replyText || suggestedReply;
    if (!textToSend.trim()) return;

    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        const newMessage = {
          id: `m${conv.messages.length + 1}`,
          sender: 'ai' as const,
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
