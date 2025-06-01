
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { ConversationType, MessageType } from '@/types/communications';
import MessageItem from '@/components/admin/communications/MessageItem';
import MessageComposer from './MessageComposer';
import NewConversationDialog from './NewConversationDialog';

interface ActiveConversationViewProps {
  activeConversation: ConversationType | null;
  activeMessages: MessageType[];
  hasConversations: boolean;
  onNewConversationCreated?: (conversation: ConversationType) => void;
}

const ActiveConversationView: React.FC<ActiveConversationViewProps> = ({
  activeConversation,
  activeMessages,
  hasConversations,
  onNewConversationCreated
}) => {
  if (!activeConversation) {
    return (
      <Card className="h-[600px]">
        <CardContent className="h-full flex items-center justify-center">
          <div className="text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Conversation Selected</h3>
            <p className="text-muted-foreground mb-4">
              {hasConversations ? 'Select a conversation or start a new one' : 'Start your first conversation with our support team'}
            </p>
            <NewConversationDialog onConversationCreated={onNewConversationCreated} />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>{activeConversation.subject}</CardTitle>
        <CardDescription>
          Conversation with support team
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-4">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {activeMessages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
        </div>
        
        <MessageComposer conversationId={activeConversation.id} />
      </CardContent>
    </Card>
  );
};

export default ActiveConversationView;
