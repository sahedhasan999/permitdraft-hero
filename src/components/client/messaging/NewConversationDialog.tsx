
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip, X } from 'lucide-react';
import { ConversationType } from '@/types/communications';
import { createConversation } from '@/services/firebaseMessagingService';
import { useFirebase } from '@/contexts/FirebaseContext';
import { useToast } from '@/hooks/use-toast';

interface NewConversationDialogProps {
  onConversationCreated?: (conversation: ConversationType) => void;
  triggerButtonText?: string;
  triggerButtonClassName?: string;
}

const NewConversationDialog: React.FC<NewConversationDialogProps> = ({
  onConversationCreated,
  triggerButtonText = "New Conversation",
  triggerButtonClassName = "bg-blue-600 hover:bg-blue-700 text-white"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const { currentUser } = useFirebase();
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(prev => [...prev, ...Array.from(files)]);
      event.target.value = ''; // Reset input
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateConversation = async () => {
    if (!currentUser || !subject.trim() || !message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      const conversationId = await createConversation(
        currentUser.uid,
        currentUser.email || '',
        currentUser.displayName || 'Customer',
        subject,
        message,
        selectedFiles
      );

      console.log('New conversation created with ID:', conversationId);

      // Create a mock conversation object for the callback
      const newConversation: ConversationType = {
        id: conversationId,
        customer: currentUser.displayName || 'Customer',
        email: currentUser.email || '',
        subject: subject,
        messages: [],
        status: 'active',
        lastUpdated: new Date().toISOString()
      };

      if (onConversationCreated) {
        onConversationCreated(newConversation);
      }

      // Reset form
      setSubject('');
      setMessage('');
      setSelectedFiles([]);
      setIsOpen(false);

      toast({
        title: "Conversation started",
        description: "Your message has been sent to our support team."
      });
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Error",
        description: "Failed to start conversation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={triggerButtonClassName}>
          {triggerButtonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md mx-4">
        <DialogHeader>
          <DialogTitle>Start New Conversation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Subject *</label>
            <Input
              placeholder="What do you need help with?"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Message *</label>
            <Textarea
              placeholder="Describe your question or issue..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px] w-full"
            />
          </div>

          {/* File Attachments */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Attachments</label>
              <div className="space-y-1">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <Paperclip className="h-3 w-3 flex-shrink-0" />
                      <span className="text-sm truncate">{file.name}</span>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        ({formatFileSize(file.size)})
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="h-6 w-6 p-0 ml-2"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="new-conversation-files"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.heic,.heif"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('new-conversation-files')?.click()}
              className="text-sm"
            >
              <Paperclip className="h-4 w-4 mr-1" />
              Add Files
            </Button>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleCreateConversation}
              disabled={isCreating || !subject.trim() || !message.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4 mr-2" />
              {isCreating ? 'Sending...' : 'Send Message'}
            </Button>
            <Button 
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewConversationDialog;
