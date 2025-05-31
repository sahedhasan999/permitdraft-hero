
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Paperclip, X, Upload } from 'lucide-react';
import { FileAttachment } from '@/types/communications';
import { formatFileSize } from '@/utils/fileUtils';

interface FileAttachmentProps {
  onAttachmentsChange: (attachments: FileAttachment[]) => void;
  attachments: FileAttachment[];
}

const FileAttachmentComponent: React.FC<FileAttachmentProps> = ({
  onAttachmentsChange,
  attachments
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);
    
    try {
      const newAttachments: FileAttachment[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Create a mock URL for demo purposes
        // In a real app, you'd upload to Firebase Storage
        const mockUrl = URL.createObjectURL(file);
        
        const attachment: FileAttachment = {
          name: file.name,
          url: mockUrl,
          size: formatFileSize(file.size),
          type: file.type
        };
        
        newAttachments.push(attachment);
      }
      
      onAttachmentsChange([...attachments, ...newAttachments]);
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setIsUploading(false);
      // Reset input
      event.target.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    const updated = attachments.filter((_, i) => i !== index);
    onAttachmentsChange(updated);
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
  );
};

export default FileAttachmentComponent;
