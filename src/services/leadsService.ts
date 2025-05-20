
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  squareFootage?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  followUpDate?: string;
  createdAt: Date;
  updatedAt: Date;
  notes?: Note[];
  attachments?: FileAttachment[];
  additionalDetails?: string;
  userId?: string; // Add this line
}
