import React, { useEffect, useState } from 'react';
import { db } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import AttachmentUploader from './Attachments/AttachmentUploader';

interface LeadDetailProps {
  leadId: string;
  userId: string;
}

const LeadDetail: React.FC<LeadDetailProps> = ({ leadId, userId }) => {
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLead = async () => {
      setLoading(true);
      setError(null);
      try {
        const docRef = doc(db, 'leads', leadId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLead({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Lead not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch lead');
      } finally {
        setLoading(false);
      }
    };
    fetchLead();
  }, [leadId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!lead) return null;

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Lead Details</h2>
      <div><strong>Name:</strong> {lead.name}</div>
      <div><strong>Email:</strong> {lead.email}</div>
      <div><strong>Project Type:</strong> {lead.projectType}</div>
      {/* Add more fields as needed */}
      <div className="mt-4">
        <AttachmentUploader leadId={leadId} userId={userId} />
      </div>
      {lead.attachmentUrl && (
        <div className="mt-4">
          <a href={lead.attachmentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            View Attachment
          </a>
        </div>
      )}
    </div>
  );
};

export default LeadDetail; 