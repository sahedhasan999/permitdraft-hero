
import React, { useRef, useState, useEffect } from 'react';
import { storage, db } from '@/config/firebase';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { FileUp, File, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface AttachmentUploaderProps {
  leadId: string;
  userId: string;
}

interface FileAttachment {
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

const AttachmentUploader: React.FC<AttachmentUploaderProps> = ({ leadId, userId }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAttachments();
  }, [leadId]);

  const fetchAttachments = async () => {
    try {
      setLoading(true);
      // Try to get attachments from Firestore first
      const leadDocRef = doc(db, 'leads', leadId);
      const docSnap = await getDoc(leadDocRef);
      
      if (docSnap.exists() && docSnap.data().attachments) {
        setAttachments(docSnap.data().attachments);
        setLoading(false);
        return;
      }
      
      // If no attachments in Firestore, check storage
      const storageRef = ref(storage, `attachments/lead-${leadId}`);
      const listResult = await listAll(storageRef).catch(() => ({ items: [] }));
      
      const fetchedAttachments: FileAttachment[] = [];
      
      for (const item of listResult.items) {
        const url = await getDownloadURL(item);
        fetchedAttachments.push({
          name: item.name,
          url,
          type: item.name.split('.').pop() || 'unknown',
          size: 0, // Size not available from listAll
          uploadedAt: new Date()
        });
      }
      
      // Save to Firestore for future reference if we found items
      if (fetchedAttachments.length > 0) {
        await updateDoc(leadDocRef, { attachments: fetchedAttachments });
      }
      
      setAttachments(fetchedAttachments);
    } catch (err) {
      console.error("Error fetching attachments:", err);
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
      const newAttachments: FileAttachment[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = `${Date.now()}-${file.name}`;
        const storageRef = ref(storage, `attachments/lead-${leadId}/${fileName}`);
        
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        
        newAttachments.push({
          name: file.name,
          url,
          type: file.name.split('.').pop() || 'unknown',
          size: file.size,
          uploadedAt: new Date()
        });
      }
      
      // Update Firestore with all attachments
      const leadDocRef = doc(db, 'leads', leadId);
      const updatedAttachments = [...attachments, ...newAttachments];
      await updateDoc(leadDocRef, { attachments: updatedAttachments });
      
      setAttachments(updatedAttachments);
      setSuccess('Attachments uploaded successfully!');
      toast({
        title: "Success",
        description: `${newAttachments.length} file(s) uploaded successfully.`,
      });
      
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

  const deleteAttachment = async (index: number) => {
    try {
      const updatedAttachments = [...attachments];
      updatedAttachments.splice(index, 1);
      
      // Update Firestore
      const leadDocRef = doc(db, 'leads', leadId);
      await updateDoc(leadDocRef, { attachments: updatedAttachments });
      
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
      
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading attachments...</div>
      ) : attachments.length > 0 ? (
        <div className="space-y-2 max-h-[300px] overflow-y-auto border rounded-md p-2">
          {attachments.map((attachment, index) => (
            <div 
              key={index} 
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
                onClick={() => deleteAttachment(index)}
                className="text-gray-500 hover:text-red-500 p-1"
                aria-label="Delete attachment"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">No attachments uploaded yet.</div>
      )}
    </div>
  );
};

export default AttachmentUploader;
