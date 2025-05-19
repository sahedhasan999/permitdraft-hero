
import React, { useEffect, useState } from 'react';
import { db } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import AttachmentUploader from './Attachments/AttachmentUploader';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

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

  if (loading) return (
    <div className="flex justify-center items-center p-8">
      <Loader2 className="animate-spin h-8 w-8 text-primary" />
    </div>
  );
  
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!lead) return null;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Lead Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div><strong>Name:</strong> {lead.name}</div>
          <div><strong>Email:</strong> {lead.email}</div>
          <div><strong>Phone:</strong> {lead.phone || 'N/A'}</div>
          <div><strong>Project Type:</strong> {lead.projectType}</div>
          <div><strong>Square Footage:</strong> {lead.squareFootage || 'N/A'}</div>
          <div><strong>Timeline:</strong> {lead.timeline || 'N/A'}</div>
        </div>
        
        <div className="space-y-2">
          <div><strong>Date Submitted:</strong> {lead.createdAt instanceof Date 
            ? lead.createdAt.toLocaleDateString() 
            : new Date(lead.createdAt).toLocaleDateString()}
          </div>
          <div><strong>Status:</strong> {lead.status}</div>
        </div>
      </div>
      
      {lead.additionalDetails && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Additional Details</h3>
          <div className="bg-muted/50 p-4 rounded-md whitespace-pre-wrap">
            {lead.additionalDetails}
          </div>
        </div>
      )}
      
      <div className="mt-6">
        <AttachmentUploader leadId={leadId} userId={userId} />
      </div>
    </div>
  );
};

export default LeadDetail;
