
import { storage, db, handleStorageError } from '@/config/firebase';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { FileAttachment } from '@/services/leadsService';

export const fetchLeadAttachments = async (leadId: string): Promise<{
  attachments: FileAttachment[];
  corsStatus: 'unknown' | 'success' | 'failed';
}> => {
  try {
    // Try to get attachments from Firestore first
    const leadDocRef = doc(db, 'leads', leadId);
    const docSnap = await getDoc(leadDocRef);
    
    if (docSnap.exists() && docSnap.data().attachments) {
      return {
        attachments: docSnap.data().attachments,
        corsStatus: 'unknown'
      };
    }
    
    // If no attachments in Firestore, check storage
    try {
      console.log(`Checking storage folder: Clients_Attachement/${leadId}`);
      const storageRef = ref(storage, `Clients_Attachement/${leadId}`);
      const listResult = await listAll(storageRef).catch((err) => {
        const errorResult = handleStorageError(err);
        if (errorResult.type === 'cors') {
          throw new Error('CORS configuration issue detected');
        }
        return { items: [] };
      });
      
      console.log(`Found ${listResult.items.length} items in storage`);
      
      const fetchedAttachments: FileAttachment[] = [];
      
      for (const item of listResult.items) {
        try {
          const url = await getDownloadURL(item);
          fetchedAttachments.push({
            name: item.name,
            url,
            type: item.name.split('.').pop() || 'unknown',
            size: 0, // Size not available from listAll
            uploadedAt: new Date()
          });
        } catch (error) {
          const errorResult = handleStorageError(error);
          if (errorResult.type === 'cors') {
            throw new Error('CORS configuration issue detected');
          }
        }
      }
      
      // Save to Firestore for future reference if we found items
      if (fetchedAttachments.length > 0) {
        await updateDoc(leadDocRef, { attachments: fetchedAttachments });
      }
      
      return {
        attachments: fetchedAttachments,
        corsStatus: 'success'
      };
    } catch (error: any) {
      if (error.message && error.message.includes('CORS')) {
        return {
          attachments: [],
          corsStatus: 'failed'
        };
      }
      throw error;
    }
  } catch (err) {
    console.error("Error fetching attachments:", err);
    return {
      attachments: [],
      corsStatus: 'unknown'
    };
  }
};

export const uploadAttachmentFiles = async (
  files: FileList,
  leadId: string,
  existingAttachments: FileAttachment[]
): Promise<{
  newAttachments: FileAttachment[];
  corsStatus: 'success' | 'failed';
  error?: string;
}> => {
  const newAttachments: FileAttachment[] = [];
  let corsIssueDetected = false;
  
  for (let i = 0; i < files.length; i++) {
    try {
      const file = files[i];
      const fileName = `${Date.now()}-${file.name}`;
      
      console.log(`Attempting to upload to: Clients_Attachement/${leadId}/${fileName}`);
      const storageRef = ref(storage, `Clients_Attachement/${leadId}/${fileName}`);
      
      await uploadBytes(storageRef, file);
      console.log("File bytes uploaded successfully");
      
      const url = await getDownloadURL(storageRef);
      console.log("Download URL obtained successfully:", url.substring(0, 50) + "...");
      
      newAttachments.push({
        name: file.name,
        url,
        type: file.name.split('.').pop() || 'unknown',
        size: file.size,
        uploadedAt: new Date()
      });
    } catch (error) {
      const errorResult = handleStorageError(error);
      if (errorResult.type === 'cors') {
        corsIssueDetected = true;
      }
      console.error(`Failed to upload file: ${error}`);
    }
  }
  
  if (corsIssueDetected) {
    return {
      newAttachments,
      corsStatus: 'failed',
      error: 'CORS configuration issue detected. Some files may not have uploaded correctly.'
    };
  }
  
  // Update Firestore if any attachments were uploaded successfully
  if (newAttachments.length > 0) {
    try {
      const leadDocRef = doc(db, 'leads', leadId);
      const updatedAttachments = [...existingAttachments, ...newAttachments];
      await updateDoc(leadDocRef, { attachments: updatedAttachments });
    } catch (error) {
      console.error("Error updating Firestore with new attachments:", error);
    }
  }
  
  return {
    newAttachments,
    corsStatus: 'success'
  };
};

export const deleteAttachment = async (
  leadId: string,
  attachments: FileAttachment[],
  indexToDelete: number
): Promise<FileAttachment[]> => {
  const updatedAttachments = [...attachments];
  updatedAttachments.splice(indexToDelete, 1);
  
  // Update Firestore
  const leadDocRef = doc(db, 'leads', leadId);
  await updateDoc(leadDocRef, { attachments: updatedAttachments });
  
  return updatedAttachments;
};
