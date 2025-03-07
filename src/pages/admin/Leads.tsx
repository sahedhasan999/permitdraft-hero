
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Search, Filter, ChevronDown, ChevronUp, Calendar, Bell, MessageSquare, Plus } from 'lucide-react';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { useToast } from '@/hooks/use-toast';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  squareFootage: number;
  timeline: string;
  details: string;
  status: 'New' | 'Contacted' | 'Converted' | 'Closed';
  date: string;
  notes: Note[];
  followUp: string | null;
}

interface Note {
  id: string;
  content: string;
  date: string;
}

// Mock leads data
const mockLeads: Lead[] = [
  {
    id: 'LEAD-1001',
    name: 'Jennifer Williams',
    email: 'jennifer@example.com',
    phone: '(555) 123-4567',
    projectType: 'Deck',
    squareFootage: 450,
    timeline: 'asap',
    details: 'Looking for a modern design for a backyard deck',
    status: 'New',
    date: '2023-09-08',
    notes: [],
    followUp: null
  },
  {
    id: 'LEAD-1002',
    name: 'Robert Taylor',
    email: 'robert@example.com',
    phone: '(555) 234-5678',
    projectType: 'Patio',
    squareFootage: 300,
    timeline: '1-2-weeks',
    details: 'Interested in a stone patio with built-in fire pit',
    status: 'Contacted',
    date: '2023-09-07',
    notes: [
      {
        id: 'NOTE-001',
        content: 'Called and discussed project requirements. Sending quote by Friday.',
        date: '2023-09-07'
      }
    ],
    followUp: '2023-09-09'
  },
  {
    id: 'LEAD-1003',
    name: 'Lisa Anderson',
    email: 'lisa@example.com',
    phone: '(555) 345-6789',
    projectType: 'Pergola',
    squareFootage: 200,
    timeline: '1-month',
    details: 'Wants a pergola with retractable shade',
    status: 'Converted',
    date: '2023-09-06',
    notes: [
      {
        id: 'NOTE-002',
        content: 'Initial call completed, very enthusiastic about our designs.',
        date: '2023-09-06'
      },
      {
        id: 'NOTE-003',
        content: 'Sent quote for $599, client approved and payment received.',
        date: '2023-09-07'
      }
    ],
    followUp: null
  },
  {
    id: 'LEAD-1004',
    name: 'James Martinez',
    email: 'james@example.com',
    phone: '(555) 456-7890',
    projectType: 'Home Addition',
    squareFootage: 750,
    timeline: '2-3-months',
    details: 'Planning a sunroom addition to their home',
    status: 'New',
    date: '2023-09-05',
    notes: [],
    followUp: null
  },
  {
    id: 'LEAD-1005',
    name: 'Karen Wilson',
    email: 'karen@example.com',
    phone: '(555) 567-8901',
    projectType: 'Outdoor Kitchen',
    squareFootage: 350,
    timeline: 'planning',
    details: 'Interested in an outdoor kitchen with built-in grill and countertops',
    status: 'Contacted',
    date: '2023-09-04',
    notes: [
      {
        id: 'NOTE-004',
        content: 'Initial consultation scheduled for next week.',
        date: '2023-09-04'
      }
    ],
    followUp: '2023-09-11'
  },
  {
    id: 'LEAD-1006',
    name: 'Michael Scott',
    email: 'michael@example.com',
    phone: '(555) 678-9012',
    projectType: 'Deck',
    squareFootage: 550,
    timeline: '1-month',
    details: 'Wants a multi-level deck with built-in seating',
    status: 'Closed',
    date: '2023-09-03',
    notes: [
      {
        id: 'NOTE-005',
        content: 'Client decided to go with another company due to budget constraints.',
        date: '2023-09-03'
      }
    ],
    followUp: null
  },
  {
    id: 'LEAD-1007',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '(555) 789-0123',
    projectType: 'Patio',
    squareFootage: 400,
    timeline: 'asap',
    details: 'Looking for a covered patio design',
    status: 'Converted',
    date: '2023-09-02',
    notes: [
      {
        id: 'NOTE-006',
        content: 'Quote accepted, payment received.',
        date: '2023-09-02'
      }
    ],
    followUp: null
  },
];

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const { toast } = useToast();

  // Sort function
  const sortedLeads = React.useMemo(() => {
    let sortableLeads = [...leads];
    
    // Apply search filter
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      sortableLeads = sortableLeads.filter(
        lead => 
          lead.name.toLowerCase().includes(lowerCaseSearch) ||
          lead.email.toLowerCase().includes(lowerCaseSearch) ||
          lead.projectType.toLowerCase().includes(lowerCaseSearch)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      sortableLeads = sortableLeads.filter(
        lead => lead.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    // Apply sorting
    if (sortConfig !== null) {
      sortableLeads.sort((a, b) => {
        if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortableLeads;
  }, [leads, searchTerm, sortConfig, statusFilter]);

  // Request sort function
  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortDirectionIcon = (name: string) => {
    if (!sortConfig || sortConfig.key !== name) {
      return null;
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  const handleStatusChange = (leadId: string, newStatus: 'New' | 'Contacted' | 'Converted' | 'Closed') => {
    setLeads(
      leads.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      )
    );
    
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }
    
    toast({
      title: "Status updated",
      description: `Lead status changed to ${newStatus}`,
    });
  };

  const openLeadDetail = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailOpen(true);
    setFollowUpDate(lead.followUp || '');
  };

  const closeLeadDetail = () => {
    setIsDetailOpen(false);
    setNewNote('');
    setFollowUpDate('');
  };

  const addNote = () => {
    if (!newNote.trim() || !selectedLead) return;
    
    const noteId = `NOTE-${Date.now()}`;
    const currentDate = new Date().toISOString().split('T')[0];
    const note = {
      id: noteId,
      content: newNote,
      date: currentDate
    };
    
    const updatedLead = {
      ...selectedLead,
      notes: [...selectedLead.notes, note]
    };
    
    setLeads(
      leads.map(lead => 
        lead.id === selectedLead.id ? updatedLead : lead
      )
    );
    
    setSelectedLead(updatedLead);
    setNewNote('');
    
    toast({
      title: "Note added",
      description: "Your note has been added to the lead",
    });
  };

  const setFollowUpReminder = () => {
    if (!followUpDate || !selectedLead) return;
    
    const updatedLead = {
      ...selectedLead,
      followUp: followUpDate
    };
    
    setLeads(
      leads.map(lead => 
        lead.id === selectedLead.id ? updatedLead : lead
      )
    );
    
    setSelectedLead(updatedLead);
    
    toast({
      title: "Reminder set",
      description: `Follow-up reminder set for ${followUpDate}`,
    });
  };

  const clearFollowUpReminder = () => {
    if (!selectedLead) return;
    
    const updatedLead = {
      ...selectedLead,
      followUp: null
    };
    
    setLeads(
      leads.map(lead => 
        lead.id === selectedLead.id ? updatedLead : lead
      )
    );
    
    setSelectedLead(updatedLead);
    setFollowUpDate('');
    
    toast({
      title: "Reminder cleared",
      description: "Follow-up reminder has been removed",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Lead Management</h1>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search leads..."
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted">
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('name')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Name</span>
                      {getSortDirectionIcon('name')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('projectType')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Project</span>
                      {getSortDirectionIcon('projectType')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('status')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      {getSortDirectionIcon('status')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('date')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Date</span>
                      {getSortDirectionIcon('date')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    Follow Up
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortedLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-muted/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div>
                        <div className="font-medium">{lead.name}</div>
                        <div className="text-xs text-muted-foreground">{lead.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div>
                        <div>{lead.projectType}</div>
                        <div className="text-xs text-muted-foreground">{lead.squareFootage} sq ft</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value as any)}
                        className={`px-2 py-1 rounded text-xs font-medium border-0 ${
                          lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                          lead.status === 'Contacted' ? 'bg-purple-100 text-purple-800' :
                          lead.status === 'Converted' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Converted">Converted</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{lead.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {lead.followUp ? (
                        <div className="flex items-center text-amber-600">
                          <Bell className="h-4 w-4 mr-2" />
                          {lead.followUp}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => openLeadDetail(lead)}
                        className="text-primary hover:text-primary/80 font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {sortedLeads.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No leads found</p>
            </div>
          )}
        </div>
      </div>

      {/* Lead Detail Modal */}
      {isDetailOpen && selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center">
              <h2 className="text-xl font-semibold">Lead Details: {selectedLead.name}</h2>
              <button
                onClick={closeLeadDetail}
                className="text-muted-foreground hover:text-foreground"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Contact Information</h3>
                  <p className="font-medium">{selectedLead.name}</p>
                  <p className="text-sm">{selectedLead.email}</p>
                  <p className="text-sm">{selectedLead.phone}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Project Information</h3>
                  <p><span className="font-medium">Type:</span> {selectedLead.projectType}</p>
                  <p><span className="font-medium">Size:</span> {selectedLead.squareFootage} sq ft</p>
                  <p><span className="font-medium">Timeline:</span> {selectedLead.timeline}</p>
                  <p><span className="font-medium">Date Submitted:</span> {selectedLead.date}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Project Details</h3>
                <p className="text-sm bg-muted p-3 rounded">{selectedLead.details}</p>
              </div>
              
              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as any)}
                    className={`px-2 py-1 rounded text-xs font-medium border-0 ${
                      selectedLead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                      selectedLead.status === 'Contacted' ? 'bg-purple-100 text-purple-800' :
                      selectedLead.status === 'Converted' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Converted">Converted</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
              
              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Follow-up Reminder</h3>
                  {selectedLead.followUp && (
                    <button 
                      onClick={clearFollowUpReminder}
                      className="text-xs text-red-500 hover:text-red-600"
                    >
                      Clear Reminder
                    </button>
                  )}
                </div>
                
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <div className="relative flex items-center">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="date"
                        value={followUpDate}
                        onChange={(e) => setFollowUpDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      />
                    </div>
                  </div>
                  <AnimatedButton
                    variant="primary"
                    size="sm"
                    onClick={setFollowUpReminder}
                    disabled={!followUpDate}
                  >
                    Set Reminder
                  </AnimatedButton>
                </div>
              </div>
              
              <div className="border-t border-border pt-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
                {selectedLead.notes.length > 0 ? (
                  <div className="space-y-3 mb-4">
                    {selectedLead.notes.map((note) => (
                      <div key={note.id} className="bg-muted p-3 rounded">
                        <p className="text-sm">{note.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">{note.date}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mb-4">No notes yet.</p>
                )}
                
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <textarea
                        placeholder="Add a note..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        rows={3}
                        className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      ></textarea>
                    </div>
                  </div>
                  <AnimatedButton
                    variant="primary"
                    size="sm"
                    onClick={addNote}
                    iconLeft={<Plus className="h-4 w-4" />}
                    disabled={!newNote.trim()}
                  >
                    Add
                  </AnimatedButton>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-border flex justify-end">
              <button
                onClick={closeLeadDetail}
                className="text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Leads;
