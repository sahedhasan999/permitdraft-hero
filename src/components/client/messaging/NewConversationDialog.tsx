
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { FileAttachment } from '@/types/communications';
import { createConversation } from '@/services/firebaseMessagingService';
import { useFirebase } from '@/contexts/FirebaseContext';
import { useToast } from '@/hooks/use-toast';
import FileUploadManager from './FileUploadManager';

const NewConversationDialog: React.FC = () => {
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [newConversationSubject, setNewConversationSubject] = useState('');
  const [newConversationMessage, setNewConversationMessage] = useState('');
  const [newConversationAttachments, setNewConversationAttachments] = useState<FileAttachment[]>([]);
  const { currentUser } = useFirebase();
  const { toast } = useToast();

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

  return (
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
          
          <FileUploadManager
            attachments={newConversationAttachments}
            onAttachmentsChange={setNewConversationAttachments}
            conversationId="new"
            inputId="new-file-upload"
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
  );
};

export default NewConversationDialog;
