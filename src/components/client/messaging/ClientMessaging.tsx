
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
    if (!currentUser) return;

    const unsubscribe = subscribeToUserConversations(currentUser.uid, (userConversations) => {
      setConversations(userConversations);
      if (userConversations.length > 0 && !activeConversation) {
        setActiveConversation(userConversations[0]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    if (!activeConversation) return;

    const unsubscribe = subscribeToConversationMessages(activeConversation.id, (messages) => {
      setActiveMessages(messages);
    });

    return () => unsubscribe();
  }, [activeConversation]);

  const handleConversationSelect = (conversation: ConversationType) => {
    setActiveConversation(conversation);
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
