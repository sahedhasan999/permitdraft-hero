
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, Paperclip } from 'lucide-react';
import { FileAttachment } from '@/types/communications';
import { uploadFile } from '@/services/firebaseMessagingService';
import { useToast } from '@/hooks/use-toast';

interface FileUploadManagerProps {
  attachments: FileAttachment[];
  onAttachmentsChange: (attachments: FileAttachment[]) => void;
  conversationId: string;
  inputId: string;
}

const FileUploadManager: React.FC<FileUploadManagerProps> = ({
  attachments,
  onAttachmentsChange,
  conversationId,
  inputId
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || conversationId === 'new') return;

    setIsUploading(true);
    
    try {
      const newAttachments: FileAttachment[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const attachment = await uploadFile(file, conversationId);
        newAttachments.push(attachment);
      }
      
      onAttachmentsChange([...attachments, ...newAttachments]);
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

  const removeAttachment = (index: number) => {
    onAttachmentsChange(attachments.filter((_, i) => i !== index));
  };

  return (
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
          id={inputId}
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => document.getElementById(inputId)?.click()}
          disabled={isUploading}
        >
          <Upload className="h-4 w-4 mr-1" />
          {isUploading ? 'Uploading...' : 'Attach Files'}
        </Button>
      </div>
    </div>
  );
};

export default FileUploadManager;
