
import { ConversationType } from '@/types/communications';

export const mockCommunications: ConversationType[] = [
  {
    id: 'conv-1',
    customer: 'John Smith',
    email: 'john@example.com',
    subject: 'Project Timeline Question',
    messages: [
      {
        id: 'msg-1',
        sender: 'customer',
        content: 'Hi, I wanted to check on the timeline for my deck project. Can you provide an update?',
        timestamp: '2024-01-15T10:30:00Z',
        attachments: [
          {
            name: 'deck_reference.jpg',
            url: '#',
            size: '2.3 MB',
            type: 'image/jpeg'
          }
        ]
      },
      {
        id: 'msg-2',
        sender: 'admin',
        content: 'Thank you for reaching out! Your deck project is currently in the design phase. We expect to have the initial plans ready by next Friday.',
        timestamp: '2024-01-15T11:00:00Z',
        attachments: []
      },
      {
        id: 'msg-3',
        sender: 'customer',
        content: 'That sounds great! I have some additional requirements I\'d like to discuss.',
        timestamp: '2024-01-15T11:15:00Z',
        attachments: [
          {
            name: 'additional_requirements.pdf',
            url: '#',
            size: '1.1 MB',
            type: 'application/pdf'
          }
        ]
      }
    ],
    status: 'active',
    lastUpdated: '2024-01-15T11:15:00Z'
  },
  {
    id: 'conv-2',
    customer: 'Sarah Johnson',
    email: 'sarah@example.com',
    subject: 'Permit Status Inquiry',
    messages: [
      {
        id: 'msg-4',
        sender: 'customer',
        content: 'Hello, I was wondering about the status of my building permit application.',
        timestamp: '2024-01-14T14:20:00Z',
        attachments: []
      },
      {
        id: 'msg-5',
        sender: 'admin',
        content: 'Hi Sarah! Your permit application was submitted last week and is currently under review by the city planning department. The typical review time is 2-3 weeks.',
        timestamp: '2024-01-14T14:45:00Z',
        attachments: [
          {
            name: 'permit_application_status.pdf',
            url: '#',
            size: '156 KB',
            type: 'application/pdf'
          }
        ]
      }
    ],
    status: 'active',
    lastUpdated: '2024-01-14T14:45:00Z'
  },
  {
    id: 'conv-3',
    customer: 'Mike Davis',
    email: 'mike@example.com',
    subject: 'Design Revision Request',
    messages: [
      {
        id: 'msg-6',
        sender: 'customer',
        content: 'I reviewed the plans and would like to make some changes to the kitchen layout.',
        timestamp: '2024-01-13T09:00:00Z',
        attachments: []
      },
      {
        id: 'msg-7',
        sender: 'admin',
        content: 'Of course! Design revisions are part of our service. Could you please specify what changes you\'d like to make?',
        timestamp: '2024-01-13T09:30:00Z',
        attachments: []
      }
    ],
    status: 'closed',
    lastUpdated: '2024-01-13T09:30:00Z'
  }
];
