
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { FileAttachment, ConversationType } from '@/types/communications';
import { createConversation } from '@/services/firebaseMessagingService';
import { useFirebase } from '@/contexts/FirebaseContext';
import { useToast } from '@/hooks/use-toast';
import FileUploadManager from './FileUploadManager';
import { VariantProps } from 'class-variance-authority';

// Get Button variants type
type ButtonVariant = VariantProps<typeof Button>['variant'];

interface NewConversationDialogProps {
  onConversationCreated?: (conversation: ConversationType) => void;
  triggerButtonText?: string;
  triggerButtonIcon?: React.ReactNode;
  triggerButtonVariant?: ButtonVariant;
  triggerButtonClassName?: string;
}

const NewConversationDialog: React.FC<NewConversationDialogProps> = ({
  onConversationCreated,
  triggerButtonText = "New", // Default text
  triggerButtonIcon,
  triggerButtonVariant = "default", // Default variant
  triggerButtonClassName
}) => {
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [newConversationSubject, setNewConversationSubject] = useState('');
  const [newConversationMessage, setNewConversationMessage] = useState('');
  const [newConversationFiles, setNewConversationFiles] = useState<File[]>([]); // Changed state name and type
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useFirebase();
  const { toast } = useToast();

  const handleCreateConversation = async () => {
    if (!currentUser || !newConversationSubject.trim() || !newConversationMessage.trim()) return;

    setIsCreatingConversation(true);
    try {
      const conversationId = await createConversation(
        currentUser.uid,
        currentUser.email || '',
        currentUser.displayName || 'Anonymous',
        newConversationSubject,
        newConversationMessage,
        newConversationFiles // Pass File[] here
      );

      // Create a mock conversation object to pass to the callback
      // Note: The actual attachments will be uploaded by createConversation.
      // This mock might not be perfectly accurate for attachments immediately,
      // but the real-time subscription should update it.
      const newConversation: ConversationType = {
        id: conversationId,
        customer: currentUser.displayName || 'Anonymous',
        email: currentUser.email || '',
        subject: newConversationSubject,
        messages: [{
          id: `msg-${Date.now()}`,
          sender: 'customer',
          content: newConversationMessage,
          timestamp: new Date().toISOString(),
          // attachments: newConversationAttachments // This is tricky, as they are Files not FileAttachments yet.
          // For simplicity, we'll leave it empty in the mock. The subscription will provide the real data.
          attachments: []
        }],
        status: 'active',
        lastUpdated: new Date().toISOString()
      };

      if (onConversationCreated) {
        onConversationCreated(newConversation);
      }

      setNewConversationSubject('');
      setNewConversationMessage('');
      setNewConversationFiles([]); // Reset files state
      setIsOpen(false);

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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={triggerButtonVariant}
          size="sm"
          className={triggerButtonClassName}
        >
          {triggerButtonIcon ? triggerButtonIcon : (triggerButtonText === "New" && <Plus className="h-4 w-4 mr-1" />)}
          {triggerButtonText}
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
            // attachments prop is not used by FileUploadManager when conversationId="new" for selection
            // but we pass newConversationFiles to make it clear what it's managing internally if needed
            attachments={[]} // Pass empty array as FileAttachment[] is expected by prop type
            onFilesChange={setNewConversationFiles} // Changed prop name
            conversationId="new"
            inputId="new-file-upload"
            // We need to ensure FileUploadManager calls onFilesChange with File[]
            // and not onAttachmentsChange with FileAttachment[] when conversationId is "new"
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
