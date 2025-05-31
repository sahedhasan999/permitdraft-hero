
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageSquare, Plus, Send, Upload, X, Paperclip } from 'lucide-react';
import { ConversationType, MessageType, FileAttachment } from '@/types/communications';
import { 
  subscribeToUserConversations, 
  sendMessage, 
  createConversation,
  uploadFile,
  subscribeToConversationMessages 
} from '@/services/firebaseMessagingService';
import { useFirebase } from '@/contexts/FirebaseContext';
import { useToast } from '@/hooks/use-toast';
import MessageItem from '@/components/admin/communications/MessageItem';

const ClientMessaging: React.FC = () => {
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [activeConversation, setActiveConversation] = useState<ConversationType | null>(null);
  const [activeMessages, setActiveMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [newConversationSubject, setNewConversationSubject] = useState('');
  const [newConversationMessage, setNewConversationMessage] = useState('');
  const [newConversationAttachments, setNewConversationAttachments] = useState<FileAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { currentUser } = useFirebase();
  const { toast } = useToast();

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

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>, isNewConversation = false) => {
    const files = event.target.files;
    if (!files || !activeConversation) return;

    setIsUploading(true);
    
    try {
      const newAttachments: FileAttachment[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const attachment = await uploadFile(file, activeConversation.id);
        newAttachments.push(attachment);
      }
      
      if (isNewConversation) {
        setNewConversationAttachments([...newConversationAttachments, ...newAttachments]);
      } else {
        setAttachments([...attachments, ...newAttachments]);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Error",
        description: "Failed to upload files.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const removeAttachment = (index: number, isNewConversation = false) => {
    if (isNewConversation) {
      setNewConversationAttachments(newConversationAttachments.filter((_, i) => i !== index));
    } else {
      setAttachments(attachments.filter((_, i) => i !== index));
    }
  };

  const handleSendMessage = async () => {
    if (!activeConversation || !currentUser || (!newMessage.trim() && attachments.length === 0)) return;

    setIsSending(true);
    try {
      await sendMessage(activeConversation.id, 'customer', newMessage, attachments);
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
      await createConversation(
        currentUser.uid,
        currentUser.email || '',
        currentUser.displayName || 'Anonymous',
        newConversationSubject,
        newConversationMessage,
        newConversationAttachments
      );

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
                  
                  {/* File attachments for new conversation */}
                  <div className="space-y-2">
                    {newConversationAttachments.length > 0 && (
                      <div className="space-y-1">
                        {newConversationAttachments.map((attachment, index) => (
                          <div key={index} className="flex items-center justify-between bg-muted p-2 rounded text-sm">
                            <div className="flex items-center space-x-2">
                              <Paperclip className="h-3 w-3" />
                              <span className="truncate">{attachment.name}</span>
                              <span className="text-muted-foreground">({attachment.size})</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAttachment(index, true)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <Input
                        type="file"
                        multiple
                        onChange={(e) => handleFileSelect(e, true)}
                        className="hidden"
                        id="new-file-upload"
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('new-file-upload')?.click()}
                        disabled={isUploading}
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        {isUploading ? 'Uploading...' : 'Attach Files'}
                      </Button>
                    </div>
                  </div>
                  
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
                {activeMessages.map((message) => (
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
                
                {/* File attachments */}
                <div className="space-y-2">
                  {attachments.length > 0 && (
                    <div className="space-y-1">
                      {attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted p-2 rounded text-sm">
                          <div className="flex items-center space-x-2">
                            <Paperclip className="h-3 w-3" />
                            <span className="truncate">{attachment.name}</span>
                            <span className="text-muted-foreground">({attachment.size})</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttachment(index)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Input
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      disabled={isUploading}
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      {isUploading ? 'Uploading...' : 'Attach Files'}
                    </Button>
                  </div>
                </div>
                
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
