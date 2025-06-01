
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ConversationType } from '@/types/communications';
import NewConversationDialog from './NewConversationDialog';

interface ConversationsListProps {
  conversations: ConversationType[];
  activeConversation: ConversationType | null;
  onConversationSelect: (conversation: ConversationType) => void;
  onNewConversationCreated?: (conversation: ConversationType) => void;
}

const ConversationsList: React.FC<ConversationsListProps> = ({
  conversations,
  activeConversation,
  onConversationSelect,
  onNewConversationCreated
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg">Messages</CardTitle>
          <CardDescription>Your conversations</CardDescription>
        </div>
        <NewConversationDialog onConversationCreated={onNewConversationCreated} />
      </CardHeader>
      <CardContent className="p-4">
        {conversations.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            <p className="mb-4">No conversations yet</p>
            <NewConversationDialog onConversationCreated={onNewConversationCreated} />
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map(conversation => {
              const lastMessage = conversation.messages && conversation.messages.length > 0 
                ? conversation.messages[conversation.messages.length - 1]?.content || 'No messages yet'
                : 'Loading messages...';
              
              return (
                <Button
                  key={conversation.id}
                  variant={activeConversation?.id === conversation.id ? "secondary" : "ghost"}
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => onConversationSelect(conversation)}
                >
                  <div className="w-full">
                    <div className="font-medium truncate">{conversation.subject}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {lastMessage}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConversationsList;
