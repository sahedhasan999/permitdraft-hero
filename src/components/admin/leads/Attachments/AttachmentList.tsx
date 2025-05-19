
import React from 'react';
import { FileAttachment } from '@/services/leadsService';
import AttachmentItem from './AttachmentItem';

interface AttachmentListProps {
  attachments: FileAttachment[];
  onDeleteAttachment: (index: number) => void;
  loading: boolean;
}

const AttachmentList: React.FC<AttachmentListProps> = ({ 
  attachments, 
  onDeleteAttachment,
  loading
}) => {
  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading attachments...</div>;
  }
  
  if (attachments.length === 0) {
    return <div className="text-sm text-muted-foreground">No attachments uploaded yet.</div>;
  }
  
  return (
    <div className="space-y-2 max-h-[300px] overflow-y-auto border rounded-md p-2">
      {attachments.map((attachment, index) => (
        <AttachmentItem 
          key={index}
          attachment={attachment}
          index={index}
          onDelete={onDeleteAttachment}
        />
      ))}
    </div>
  );
};

export default AttachmentList;
