
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ConversationType, MessageType } from '@/types/communications';
import { 
  subscribeToUserConversations, 
  subscribeToConversationMessages 
} from '@/services/firebaseMessagingService';
import { useFirebase } from '@/contexts/FirebaseContext';
import ConversationsList from './ConversationsList';
import ActiveConversationView from './ActiveConversationView';

const ClientMessaging: React.FC = () => {
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [activeConversation, setActiveConversation] = useState<ConversationType | null>(null);
  const [activeMessages, setActiveMessages] = useState<MessageType[]>([]);
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
      console.log('Received conversations update:', userConversations);
      setConversations(userConversations);
      
      // Auto-select first conversation if none selected and conversations exist
      if (userConversations.length > 0 && !activeConversation) {
        console.log('Auto-selecting first conversation:', userConversations[0].id);
        setActiveConversation(userConversations[0]);
      }
      
      setIsLoading(false);
    });

    return () => {
      console.log('Cleaning up conversations subscription');
      unsubscribe();
    };
  }, [currentUser]);

  useEffect(() => {
    if (!activeConversation) {
      console.log('No active conversation, clearing messages');
      setActiveMessages([]);
      return;
    }

    console.log('Setting up messages subscription for conversation:', activeConversation.id);
    
    const unsubscribe = subscribeToConversationMessages(activeConversation.id, (messages) => {
      console.log('Received messages update for conversation', activeConversation.id, ':', messages);
      setActiveMessages(messages);
    });

    return () => {
      console.log('Cleaning up messages subscription for conversation:', activeConversation.id);
      unsubscribe();
    };
  }, [activeConversation]);

  const handleConversationSelect = (conversation: ConversationType) => {
    console.log('Selecting conversation:', conversation.id);
    setActiveConversation(conversation);
  };

  const handleNewConversationCreated = () => {
    console.log('New conversation created, refreshing list');
    // The subscription will automatically update the conversations list
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
        />
      </div>

      <div className="lg:col-span-3">
        <ActiveConversationView
          activeConversation={activeConversation}
          activeMessages={activeMessages}
          hasConversations={conversations.length > 0}
        />
      </div>
    </div>
  );
};

export default ClientMessaging;
