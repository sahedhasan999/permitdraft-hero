import React, { useRef, useState } from 'react';
import { storage, db } from '@/config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';

interface AttachmentUploaderProps {
  leadId: string;
  userId: string;
}

const AttachmentUploader: React.FC<AttachmentUploaderProps> = ({ leadId, userId }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    setSuccess(null);
    try {
      const ext = file.name.split('.').pop();
      const storageRef = ref(storage, `attachments/lead-${leadId}-user-${userId}.${ext}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      // Save URL to Firestore
      const leadDocRef = doc(db, 'leads', leadId);
      await updateDoc(leadDocRef, { attachmentUrl: url });
      setSuccess('Attachment uploaded successfully!');
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept="*"
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        variant="outline"
      >
        {uploading ? 'Uploading...' : 'Upload Attachment'}
      </Button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {success && <div className="text-green-600 mt-2">{success}</div>}
    </div>
  );
};

export default AttachmentUploader; 