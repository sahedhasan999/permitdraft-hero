
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageSquare, Plus, Send } from 'lucide-react';
import { ConversationType, MessageType, FileAttachment } from '@/types/communications';
import { getClientConversations, sendClientMessage, createClientConversation } from '@/services/clientMessagingService';
import { useFirebase } from '@/contexts/FirebaseContext';
import { useToast } from '@/hooks/use-toast';
import MessageItem from '@/components/admin/communications/MessageItem';
import FileAttachmentComponent from '@/components/admin/communications/FileAttachment';

const ClientMessaging: React.FC = () => {
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [activeConversation, setActiveConversation] = useState<ConversationType | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [newConversationSubject, setNewConversationSubject] = useState('');
  const [newConversationMessage, setNewConversationMessage] = useState('');
  const [newConversationAttachments, setNewConversationAttachments] = useState<FileAttachment[]>([]);
  const { currentUser } = useFirebase();
  const { toast } = useToast();

  useEffect(() => {
    const fetchConversations = async () => {
      if (!currentUser) return;
      
      try {
        const userConversations = await getClientConversations(currentUser.uid);
        setConversations(userConversations);
        if (userConversations.length > 0) {
          setActiveConversation(userConversations[0]);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
        toast({
          title: "Error",
          description: "Failed to load conversations.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [currentUser, toast]);

  const handleSendMessage = async () => {
    if (!activeConversation || (!newMessage.trim() && attachments.length === 0)) return;

    setIsSending(true);
    try {
      const message = await sendClientMessage(activeConversation.id, newMessage, attachments);
      
      const updatedConversations = conversations.map(conv => {
        if (conv.id === activeConversation.id) {
          return {
            ...conv,
            messages: [...conv.messages, message],
            lastUpdated: new Date().toISOString()
          };
        }
        return conv;
      });

      setConversations(updatedConversations);
      setActiveConversation(updatedConversations.find(c => c.id === activeConversation.id)!);
      setNewMessage('');
      setAttachments([]);

      toast({
        title: "Message sent",
        description: "Your message has been sent successfully."
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateConversation = async () => {
    if (!currentUser || !newConversationSubject.trim() || !newConversationMessage.trim()) return;

    setIsCreatingConversation(true);
    try {
      const conversation = await createClientConversation(
        newConversationSubject,
        newConversationMessage,
        currentUser.email || '',
        currentUser.displayName || 'Anonymous',
        newConversationAttachments
      );

      setConversations([conversation, ...conversations]);
      setActiveConversation(conversation);
      setNewConversationSubject('');
      setNewConversationMessage('');
      setNewConversationAttachments([]);

      toast({
        title: "Conversation created",
        description: "Your new conversation has been started."
      });
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Error",
        description: "Failed to create conversation.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingConversation(false);
    }
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
      {/* Conversations List */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg">Messages</CardTitle>
              <CardDescription>Your conversations</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  New
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Start New Conversation</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Subject</label>
                    <Input
                      placeholder="Enter conversation subject"
                      value={newConversationSubject}
                      onChange={(e) => setNewConversationSubject(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Message</label>
                    <Textarea
                      placeholder="Type your message..."
                      value={newConversationMessage}
                      onChange={(e) => setNewConversationMessage(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  <FileAttachmentComponent
                    attachments={newConversationAttachments}
                    onAttachmentsChange={setNewConversationAttachments}
                  />
                  <Button 
                    onClick={handleCreateConversation}
                    disabled={isCreatingConversation || !newConversationSubject.trim() || !newConversationMessage.trim()}
                    className="w-full"
                  >
                    {isCreatingConversation ? 'Creating...' : 'Start Conversation'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="p-4">
            {conversations.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">
                No conversations yet
              </div>
            ) : (
              <div className="space-y-2">
                {conversations.map(conversation => (
                  <Button
                    key={conversation.id}
                    variant={activeConversation?.id === conversation.id ? "secondary" : "ghost"}
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => setActiveConversation(conversation)}
                  >
                    <div className="w-full">
                      <div className="font-medium truncate">{conversation.subject}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {conversation.messages[conversation.messages.length - 1]?.content}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Active Conversation */}
      <div className="lg:col-span-3">
        {activeConversation ? (
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>{activeConversation.subject}</CardTitle>
              <CardDescription>
                Conversation with support team
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-4">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {activeConversation.messages.map((message) => (
                  <MessageItem key={message.id} message={message} />
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-3">
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="min-h-[80px]"
                />
                
                <FileAttachmentComponent
                  attachments={attachments}
                  onAttachmentsChange={setAttachments}
                />
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSendMessage}
                    disabled={isSending || (!newMessage.trim() && attachments.length === 0)}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    {isSending ? 'Sending...' : 'Send'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-[600px]">
            <CardContent className="h-full flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Conversation Selected</h3>
                <p className="text-muted-foreground">Select a conversation or start a new one</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ClientMessaging;
