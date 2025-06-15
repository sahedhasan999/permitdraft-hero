
import React, { useState, useEffect, memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ConversationType, MessageType } from '@/types/communications';
import { subscribeToUserConversations, subscribeToConversationMessages } from '@/services/firebaseMessagingService';
import { useFirebase } from '@/contexts/FirebaseContext';
import ConversationsList from './ConversationsList';
import ActiveConversationView from './ActiveConversationView';

const ClientMessaging: React.FC = memo(() => {
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [activeConversation, setActiveConversation] = useState<ConversationType | null>(null);
  const [currentMessages, setCurrentMessages] = useState<MessageType[]>([]);
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
  }, [currentUser, activeConversation?.id]);

  useEffect(() => {
    let messageSubscriptionUnsubscribe: (() => void) | undefined;

    if (activeConversation) {
      console.log('Setting up message subscription for conversation:', activeConversation.id);
      messageSubscriptionUnsubscribe = subscribeToConversationMessages(
        activeConversation.id,
        (receivedMessages) => {
          console.log('Received messages update:', receivedMessages);
          setCurrentMessages(receivedMessages);
        }
      );
    }

    return () => {
      if (messageSubscriptionUnsubscribe) {
        console.log('Cleaning up message subscription for conversation:', activeConversation?.id);
        messageSubscriptionUnsubscribe();
      }
    };
  }, [activeConversation?.id]);

  const handleConversationSelect = (conversation: ConversationType) => {
    console.log('Selecting conversation:', conversation.id);
    setActiveConversation(conversation);
    setCurrentMessages([]);
  };

  const handleNewConversationCreated = (newConversation: ConversationType) => {
    console.log('New conversation created:', newConversation);
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversation(newConversation);
  };

  if (isLoading) {
    return (
      <div className="h-[600px] bg-white rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
          <div className="lg:col-span-1 space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
          <div className="lg:col-span-3 space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="h-[600px] bg-white rounded-lg shadow-sm border flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to access messages.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[600px] bg-gray-50 rounded-lg shadow-sm overflow-hidden flex">
      <div className="w-80 border-r bg-white">
        <ConversationsList
          conversations={conversations}
          activeConversation={activeConversation}
          onConversationSelect={handleConversationSelect}
          onNewConversationCreated={handleNewConversationCreated}
        />
      </div>

      <div className="flex-1">
        <ActiveConversationView
          activeConversation={activeConversation}
          currentMessages={currentMessages}
          hasConversations={conversations.length > 0}
          onNewConversationCreated={handleNewConversationCreated}
        />
      </div>
    </div>
  );
});

ClientMessaging.displayName = "ClientMessaging";

export default ClientMessaging;
