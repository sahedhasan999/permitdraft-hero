
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ConversationType, MessageType } from '@/types/communications';
import { subscribeToUserConversations } from '@/services/firebaseMessagingService';
import { useFirebase } from '@/contexts/FirebaseContext';
import ConversationsList from './ConversationsList';
import ActiveConversationView from './ActiveConversationView';

const ClientMessaging: React.FC = () => {
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [activeConversation, setActiveConversation] = useState<ConversationType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useFirebase();

  useEffect(() => {
    if (!currentUser) {
      console.log('No current user, skipping conversations subscription');
      setIsLoading(false);
      return;
    }

    console.log('Setting up conversations subscription for user:', currentUser.uid);
    
    const unsubscribe = subscribeToUserConversations(currentUser.uid, (userConversations) => {
      console.log('Client received conversations update:', userConversations);
      setConversations(userConversations);
      
      // Update active conversation if it exists in the new data
      if (activeConversation) {
        const updatedActiveConversation = userConversations.find(conv => conv.id === activeConversation.id);
        if (updatedActiveConversation) {
          setActiveConversation(updatedActiveConversation);
        }
      }
      
      setIsLoading(false);
    });

    return () => {
      console.log('Cleaning up conversations subscription');
      unsubscribe();
    };
  }, [currentUser]);

  const handleConversationSelect = (conversation: ConversationType) => {
    console.log('Selecting conversation:', conversation.id);
    setActiveConversation(conversation);
  };

  const handleNewConversationCreated = (newConversation: ConversationType) => {
    console.log('New conversation created:', newConversation);
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversation(newConversation);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading messages...</div>
        </CardContent>
      </Card>
    );
  }

  if (!currentUser) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Please log in to access messages.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <ConversationsList
          conversations={conversations}
          activeConversation={activeConversation}
          onConversationSelect={handleConversationSelect}
          onNewConversationCreated={handleNewConversationCreated}
        />
      </div>

      <div className="lg:col-span-3">
        <ActiveConversationView
          activeConversation={activeConversation}
          activeMessages={activeConversation?.messages || []}
          hasConversations={conversations.length > 0}
          onNewConversationCreated={handleNewConversationCreated}
        />
      </div>
    </div>
  );
};

export default ClientMessaging;
