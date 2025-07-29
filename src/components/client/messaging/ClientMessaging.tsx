import React, { useState, useEffect, memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ConversationType, MessageType } from '@/types/communications';
import { subscribeToUserConversations, subscribeToConversationMessages } from '@/services/firebaseMessagingService';
import { useFirebase } from '@/contexts/FirebaseContext';
import { useIsMobile } from '@/hooks/use-mobile';
import ConversationsList from './ConversationsList';
import ActiveConversationView from './ActiveConversationView';

const ClientMessaging: React.FC = memo(() => {
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [activeConversation, setActiveConversation] = useState<ConversationType | null>(null);
  const [currentMessages, setCurrentMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showConversationList, setShowConversationList] = useState(true);
  const { currentUser } = useFirebase();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!currentUser) {
      console.log('No current user, skipping conversations subscription');
      setIsLoading(false);
      return;
    }

    console.log('Setting up conversations subscription for user:', currentUser.uid, currentUser.email);
    
    const unsubscribe = subscribeToUserConversations(
      currentUser.uid, 
      currentUser.email || '', 
      (userConversations) => {
        console.log('Client received conversations update:', userConversations);
        setConversations(userConversations);
        
        // Only update active conversation if it still exists, don't auto-select
        if (activeConversation) {
          const updatedActiveConversation = userConversations.find(conv => conv.id === activeConversation.id);
          if (updatedActiveConversation) {
            setActiveConversation(updatedActiveConversation);
          } else {
            // If active conversation no longer exists, clear it
            setActiveConversation(null);
          }
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      console.log('Cleaning up conversations subscription');
      unsubscribe();
    };
  }, [currentUser]); // Removed activeConversation?.id from dependencies

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
    } else {
      // Clear messages when no active conversation
      setCurrentMessages([]);
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
    if (isMobile) {
      setShowConversationList(false);
    }
  };

  const handleBackToList = () => {
    if (isMobile) {
      setShowConversationList(true);
      setActiveConversation(null);
    }
  };

  const handleNewConversationCreated = (newConversation: ConversationType) => {
    console.log('New conversation created:', newConversation);
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversation(newConversation);
    if (isMobile) {
      setShowConversationList(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[500px] lg:h-[600px] bg-white rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 lg:p-6 h-full">
          <div className="lg:col-span-1 space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="lg:col-span-3 space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="h-[500px] lg:h-[600px] bg-white rounded-lg shadow-sm border flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-gray-600">Please log in to access messages.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full bg-gray-50 overflow-hidden flex flex-col lg:flex-row`}>
      {/* Mobile: Show either conversation list or active conversation */}
      {isMobile ? (
        <>
          {/* Fixed Dashboard section at top */}
          <div className="fixed top-0 left-0 right-0 z-20 p-3 bg-white border-b shadow-sm">
            <div className="flex space-x-4">
              <button className="px-4 py-2 text-sm font-medium text-gray-600 border-b-2 border-transparent">
                Orders
              </button>
              <button className="px-4 py-2 text-sm font-medium text-primary border-b-2 border-primary">
                Messages
              </button>
            </div>
          </div>

          {showConversationList ? (
            <div className="flex-1 bg-white flex flex-col pt-16">
              {/* Conversations list taking remaining space */}
              <div className="flex-1 overflow-hidden">
                <ConversationsList
                  conversations={conversations}
                  activeConversation={activeConversation}
                  onConversationSelect={handleConversationSelect}
                  onNewConversationCreated={handleNewConversationCreated}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col h-full pt-16">
              <ActiveConversationView
                activeConversation={activeConversation}
                currentMessages={currentMessages}
                hasConversations={conversations.length > 0}
                onNewConversationCreated={handleNewConversationCreated}
                onBackToList={handleBackToList}
                isMobile={isMobile}
              />
            </div>
          )}
        </>
      ) : (
        /* Desktop: Show both side by side */
        <>
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
              isMobile={isMobile}
            />
          </div>
        </>
      )}
    </div>
  );
});

ClientMessaging.displayName = "ClientMessaging";

export default ClientMessaging;
