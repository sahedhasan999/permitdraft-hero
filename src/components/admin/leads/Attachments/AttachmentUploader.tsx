
import React, { useRef, useState, useEffect } from 'react';
import { FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FileAttachment } from '@/services/leadsService';
import AttachmentList from './AttachmentList';
import { 
  fetchLeadAttachments, 
  uploadAttachmentFiles, 
  deleteAttachment 
} from './utils/attachmentUtils';

interface AttachmentUploaderProps {
  leadId: string;
  userId: string;
}

const AttachmentUploader: React.FC<AttachmentUploaderProps> = ({ leadId, userId }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [corsStatus, setCorsStatus] = useState<'unknown' | 'success' | 'failed'>('unknown');
  const { toast } = useToast();

  useEffect(() => {
    loadAttachments();
  }, [leadId]);

  const loadAttachments = async () => {
    setLoading(true);
    try {
      const result = await fetchLeadAttachments(leadId);
      setAttachments(result.attachments);
      setCorsStatus(result.corsStatus);
    } catch (err) {
      console.error("Error loading attachments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await uploadAttachmentFiles(files, leadId, attachments);
      
      if (result.error) {
        setError(result.error);
        toast({
          title: "Upload Issue",
          description: result.error,
          variant: "destructive"
        });
      } else if (result.newAttachments.length > 0) {
        setAttachments([...attachments, ...result.newAttachments]);
        setSuccess('Attachments uploaded successfully!');
        toast({
          title: "Success",
          description: `${result.newAttachments.length} file(s) uploaded successfully.`,
        });
      }
      
      setCorsStatus(result.corsStatus);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      toast({
        title: "Error",
        description: "Failed to upload attachments.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAttachment = async (index: number) => {
    try {
      const updatedAttachments = await deleteAttachment(leadId, attachments, index);
      setAttachments(updatedAttachments);
      toast({
        title: "Success",
        description: "Attachment deleted successfully.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete attachment.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Attachments</h3>
        {corsStatus === 'failed' && (
          <div className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">
            CORS issues detected
          </div>
        )}
        {corsStatus === 'success' && (
          <div className="text-xs text-green-500 bg-green-50 px-2 py-1 rounded">
            Storage connection OK
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          multiple
          accept="*"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <FileUp className="h-4 w-4" />
          {uploading ? 'Uploading...' : 'Upload Files'}
        </Button>
      </div>
      
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
      
      <AttachmentList 
        attachments={attachments} 
        onDeleteAttachment={handleDeleteAttachment} 
        loading={loading} 
      />
    </div>
  );
};

export default AttachmentUploader;
