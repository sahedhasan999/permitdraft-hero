
import { ConversationType } from '@/types/communications';

// Mock data for AI communications
export const mockCommunications: ConversationType[] = [
  {
    id: 'comm-001',
    customer: 'John Doe',
    email: 'john@example.com',
    subject: 'Deck Design Questions',
    messages: [
      { id: 'm1', sender: 'customer', content: 'I have some questions about your deck design services.', timestamp: '2023-09-10T10:30:00Z' },
      { id: 'm2', sender: 'ai', content: 'Thank you for your interest! I\'d be happy to help with any questions about our deck design services. What would you like to know?', timestamp: '2023-09-10T10:32:00Z' },
      { id: 'm3', sender: 'customer', content: 'What materials do you typically use for decks?', timestamp: '2023-09-10T10:35:00Z' },
      { id: 'm4', sender: 'ai', content: 'We offer a variety of materials including pressure-treated lumber, cedar, composite, and PVC. Each has its own benefits in terms of cost, maintenance, and appearance. Would you like more details on any specific material?', timestamp: '2023-09-10T10:37:00Z' },
    ],
    status: 'active',
    lastUpdated: '2023-09-10T10:37:00Z'
  },
  {
    id: 'comm-002',
    customer: 'Jane Smith',
    email: 'jane@example.com',
    subject: 'Pricing for Patio Installation',
    messages: [
      { id: 'm1', sender: 'customer', content: 'Can you provide pricing for a 12x15 patio installation?', timestamp: '2023-09-09T14:20:00Z' },
      { id: 'm2', sender: 'ai', content: 'Thanks for your inquiry about a 12x15 patio installation. The cost typically ranges from $3,600 to $7,200 depending on the materials and complexity. Would you like a more detailed quote based on specific materials?', timestamp: '2023-09-09T14:25:00Z' },
    ],
    status: 'active',
    lastUpdated: '2023-09-09T14:25:00Z'
  },
  {
    id: 'comm-003',
    customer: 'Robert Johnson',
    email: 'robert@example.com',
    subject: 'Home Addition Timeline',
    messages: [
      { id: 'm1', sender: 'customer', content: 'What\'s the typical timeline for a small home addition?', timestamp: '2023-09-08T09:15:00Z' },
      { id: 'm2', sender: 'ai', content: 'For a small home addition, the timeline typically ranges from 6-12 weeks from design approval to completion. This includes permitting (2-3 weeks), construction (3-8 weeks), and finishing work (1-2 weeks). Would you like more details about a specific type of addition?', timestamp: '2023-09-08T09:20:00Z' },
      { id: 'm3', sender: 'customer', content: 'Yes, I\'m interested in adding a bedroom and bathroom.', timestamp: '2023-09-08T09:25:00Z' },
      { id: 'm4', sender: 'ai', content: 'A bedroom and bathroom addition typically falls on the longer end of the timeline, around 8-12 weeks due to the plumbing work involved. The permitting process might also take a bit longer. Would you like to schedule a consultation to discuss your specific requirements?', timestamp: '2023-09-08T09:30:00Z' },
    ],
    status: 'closed',
    lastUpdated: '2023-09-08T09:30:00Z'
  },
];
