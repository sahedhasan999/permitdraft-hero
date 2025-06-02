
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, Paperclip } from 'lucide-react';
import { FileAttachment } from '@/types/communications';
import { uploadFile } from '@/services/firebaseMessagingService';
import { useToast } from '@/hooks/use-toast';

interface FileUploadManagerProps {
  attachments: FileAttachment[]; // Used for displaying existing attachments or newly uploaded ones for existing conversations
  onAttachmentsChange?: (attachments: FileAttachment[]) => void; // For existing conversations - now optional
  onFilesChange?: (files: File[]) => void; // For new conversations, passes raw File objects
  conversationId: string; // Can be "new"
  inputId: string;
}

const FileUploadManager: React.FC<FileUploadManagerProps> = ({
  attachments,
  onAttachmentsChange,
  onFilesChange, // New prop
  conversationId,
  inputId
}) => {
  const [isUploading, setIsUploading] = useState(false);
  // Store selected files locally if it's a new conversation
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (conversationId === 'new') {
      if (onFilesChange) {
        // Add to selectedFiles and notify parent
        const newSelectedFiles = [...selectedFiles, ...Array.from(files)];
        setSelectedFiles(newSelectedFiles);
        onFilesChange(newSelectedFiles);
      }
       event.target.value = ''; // Reset file input
      return;
    }

    // Existing conversation: Upload files directly
    setIsUploading(true);
    try {
      const newUploadedAttachments: FileAttachment[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const attachment = await uploadFile(file, conversationId);
        newUploadedAttachments.push(attachment);
      }
      if (onAttachmentsChange) {
        onAttachmentsChange([...attachments, ...newUploadedAttachments]);
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
      event.target.value = ''; // Reset file input
    }
  };

  const removeAttachment = (index: number, isNewConversationFile: boolean = false) => {
    if (isNewConversationFile) {
      if (onFilesChange) {
        const newSelectedFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(newSelectedFiles);
        onFilesChange(newSelectedFiles);
      }
    } else {
      if (onAttachmentsChange) {
        onAttachmentsChange(attachments.filter((_, i) => i !== index));
      }
    }
  };

  // Determine which list of files/attachments to display
  const displayItems = conversationId === 'new'
    ? selectedFiles.map(file => ({ name: file.name, size: formatFileSize(file.size), type: file.type, isNew: true }))
    : attachments.map(att => ({ ...att, isNew: false }));

  return (
    <div className="space-y-2">
      {displayItems.length > 0 && (
        <div className="space-y-1">
          {displayItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between bg-muted p-2 rounded text-sm">
              <div className="flex items-center space-x-2">
                <Paperclip className="h-3 w-3" />
                <span className="truncate">{item.name}</span>
                {item.size && <span className="text-muted-foreground">({item.size})</span>}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeAttachment(index, item.isNew)}
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
          id={inputId}
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.heic,.heif" // Added more common types
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => document.getElementById(inputId)?.click()}
          disabled={isUploading && conversationId !== 'new'}
        >
          <Upload className="h-4 w-4 mr-1" />
          {isUploading && conversationId !== 'new' ? 'Uploading...' : 'Attach Files'}
        </Button>
      </div>
    </div>
  );
};

// Helper function (can be moved to a utility file if used elsewhere)
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default FileUploadManager;
