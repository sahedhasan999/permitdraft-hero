
import React from 'react';
import { File, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FileAttachment } from '@/services/leadsService';

interface AttachmentItemProps {
  attachment: FileAttachment;
  index: number;
  onDelete: (index: number) => void;
}

const AttachmentItem: React.FC<AttachmentItemProps> = ({ 
  attachment, 
  index, 
  onDelete 
}) => {
  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <File className="h-5 w-5 text-red-500" />;
      case 'doc':
      case 'docx':
        return <File className="h-5 w-5 text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <File className="h-5 w-5 text-green-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'heic':
        return <File className="h-5 w-5 text-purple-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
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
    <div 
      className={cn(
        "flex items-center justify-between p-2 rounded-md",
        index % 2 === 0 ? "bg-muted/50" : "bg-transparent"
      )}
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {getFileIcon(attachment.type)}
        </div>
        <div className="flex-1 min-w-0">
          <a 
            href={attachment.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline truncate block"
          >
            {attachment.name}
          </a>
          <p className="text-xs text-gray-500">
            {formatFileSize(attachment.size)} • {attachment.uploadedAt instanceof Date 
              ? attachment.uploadedAt.toLocaleDateString() 
              : new Date(attachment.uploadedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <button
        onClick={() => onDelete(index)}
        className="text-gray-500 hover:text-red-500 p-1"
        aria-label="Delete attachment"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default AttachmentItem;
