import React, { useEffect, useRef } from 'react';
import { MessageSquare, Headphones, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConversationType, MessageType } from '@/types/communications';
import ClientMessageItem from './ClientMessageItem';
import MessageComposer from './MessageComposer';
import NewConversationDialog from './NewConversationDialog';

interface ActiveConversationViewProps {
  activeConversation: ConversationType | null;
  currentMessages: MessageType[];
  hasConversations: boolean;
  onNewConversationCreated?: (conversation: ConversationType) => void;
  onBackToList?: () => void;
  isMobile?: boolean;
}

const ActiveConversationView: React.FC<ActiveConversationViewProps> = ({
  activeConversation,
  currentMessages,
  hasConversations,
  onNewConversationCreated,
  onBackToList,
  isMobile = false
}) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = React.useState(false);

  const scrollToBottom = () => {
    if (messagesContainerRef.current && !isUserScrolling) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 5;
      setIsUserScrolling(!isAtBottom);
    }
  };

  useEffect(() => {
    // Auto-scroll to bottom for new messages only if user isn't manually scrolling
    const timeoutId = setTimeout(() => {
      if (!isUserScrolling) {
        scrollToBottom();
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [currentMessages, isUserScrolling]);

  if (!activeConversation) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="text-center p-6 lg:p-8 max-w-md">
          <MessageSquare className="h-12 w-12 lg:h-16 lg:w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg lg:text-xl font-semibold text-gray-600 mb-2">
            {hasConversations ? "No Conversation Selected" : "Welcome to Support"}
          </h3>
          <p className="text-sm lg:text-base text-gray-500 mb-6">
            {hasConversations
              ? 'Select a conversation from the sidebar to continue messaging our support team.'
              : 'Start a conversation with our support team. We\'re here to help with any questions about your projects.'}
          </p>
          <NewConversationDialog
            onConversationCreated={onNewConversationCreated}
            triggerButtonText={hasConversations ? "Start New Conversation" : "Contact Support"}
            triggerButtonClassName="bg-blue-600 hover:bg-blue-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-medium transition-colors text-sm lg:text-base"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header - WhatsApp style */}
      <div className={`${isMobile ? 'p-3' : 'p-4 lg:p-6'} border-b bg-primary shadow-sm flex-shrink-0`}>
        <div className="flex items-center space-x-3">
          {isMobile && onBackToList && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToList}
              className="p-1 text-primary-foreground hover:bg-primary-foreground/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10 lg:w-12 lg:h-12'} bg-primary-foreground/20 rounded-full flex items-center justify-center`}>
            <Headphones className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5 lg:h-6 lg:w-6'} text-primary-foreground`} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className={`${isMobile ? 'text-base' : 'text-lg lg:text-xl'} font-semibold text-primary-foreground truncate`}>
              {activeConversation.subject}
            </h2>
            <p className={`${isMobile ? 'text-xs' : 'text-xs lg:text-sm'} text-primary-foreground/80`}>
              Support conversation
            </p>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            activeConversation.status === 'active'
              ? 'bg-green-500 text-white'
              : 'bg-gray-300 text-gray-700'
          }`}>
            {activeConversation.status === 'active' ? 'Active' : 'Closed'}
          </div>
        </div>
      </div>
      
      {/* Messages - WhatsApp style background */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className={`flex-1 overflow-y-auto ${isMobile ? 'p-3 pb-20' : 'p-4 lg:p-6'} bg-gradient-to-b from-gray-50 to-gray-100`}
        style={isMobile ? {
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f3f4f6' fill-opacity='0.3'%3E%3Cpath d='M30 0c16.569 0 30 13.431 30 30 0 16.569-13.431 30-30 30C13.431 60 0 46.569 0 30 0 13.431 13.431 0 30 0zm0 2C14.536 2 2 14.536 2 30s12.536 28 28 28 28-12.536 28-28S45.464 2 30 2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
          marginBottom: activeConversation.status === 'active' ? '80px' : '0'
        } : {}}
      >
        {currentMessages.length === 0 ? (
          <div className="text-center py-8 lg:py-12">
            <MessageSquare className="h-10 w-10 lg:h-12 lg:w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm lg:text-base text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className={`space-y-2 ${!isMobile ? 'max-w-4xl mx-auto' : ''}`}>
            {currentMessages.map((message) => (
              <ClientMessageItem key={message.id} message={message} isMobile={isMobile} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Message Composer - Fixed at bottom */}
      {activeConversation.status === 'active' && (
        <div className={`${isMobile ? 'p-2 fixed bottom-0 left-0 right-0 z-10' : 'p-4 lg:p-6'} border-t bg-white flex-shrink-0 shadow-lg`}>
          <div className={!isMobile ? 'max-w-4xl mx-auto' : ''}>
            <MessageComposer conversationId={activeConversation.id} isMobile={isMobile} />
          </div>
        </div>
      )}
      
      {activeConversation.status === 'closed' && (
        <div className={`${isMobile ? 'p-3' : 'p-4 lg:p-6'} border-t bg-gray-50 flex-shrink-0`}>
          <div className={!isMobile ? 'max-w-4xl mx-auto' : ''}>
            <p className="text-center text-gray-500 text-sm lg:text-base">
              This conversation has been closed. Contact support to start a new conversation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveConversationView;
