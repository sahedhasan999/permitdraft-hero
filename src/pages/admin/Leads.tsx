import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Search, Filter, ChevronDown, ChevronUp, Calendar, Bell, MessageSquare, Plus } from 'lucide-react';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { useToast } from '@/hooks/use-toast';
import { Lead, getLeads, updateLeadStatus, updateLead } from '@/services/leadsService';
import LeadDetail from '@/components/admin/leads/LeadDetail';

interface Note {
  id: string;
  content: string;
  date: string;
}

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    setIsLoading(true);
    try {
      const fetchedLeads = await getLeads();
      console.log('Fetched leads:', fetchedLeads);
      setLeads(fetchedLeads);
    } catch (error) {
      console.error('Error loading leads:', error);
      toast({
        title: "Error",
        description: "Failed to load leads. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleStatusChange = async (leadId: string, newStatus: Lead['status']) => {
    try {
      await updateLeadStatus(leadId, newStatus);
      setLeads(leads.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ));
      
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
      
      toast({
        title: "Status updated",
        description: `Lead status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const openLeadDetail = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailOpen(true);
    setFollowUpDate(lead.followUpDate || '');
  };

  const closeLeadDetail = () => {
    setIsDetailOpen(false);
    setNewNote('');
    setFollowUpDate('');
  };

  const addNote = async () => {
    if (!newNote.trim() || !selectedLead) return;
    
    const currentDate = new Date().toISOString().split('T')[0];
    const noteToAdd = {
      id: `NOTE-${Date.now()}`,
      content: newNote,
      date: currentDate
    };
    
    const updatedNotes = [...(selectedLead.notes || []), noteToAdd];
    
    try {
      await updateLead(selectedLead.id, { notes: updatedNotes });
      
      const updatedLead = {
        ...selectedLead,
        notes: updatedNotes
      };
      
      setLeads(leads.map(lead => 
        lead.id === selectedLead.id ? updatedLead : lead
      ));
      
      setSelectedLead(updatedLead);
      setNewNote('');
      
      toast({
        title: "Note added",
        description: "Your note has been added to the lead",
      });
    } catch (error) {
      console.error('Error adding note:', error);
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive"
      });
    }
  };

  const setFollowUpReminder = async () => {
    if (!followUpDate || !selectedLead) return;
    
    try {
      await updateLead(selectedLead.id, { followUpDate });
      
      const updatedLead = {
        ...selectedLead,
        followUpDate
      };
      
      setLeads(leads.map(lead => 
        lead.id === selectedLead.id ? updatedLead : lead
      ));
      
      setSelectedLead(updatedLead);
      
      toast({
        title: "Reminder set",
        description: `Follow-up reminder set for ${followUpDate}`,
      });
    } catch (error) {
      console.error('Error setting follow-up:', error);
      toast({
        title: "Error",
        description: "Failed to set follow-up reminder",
        variant: "destructive"
      });
    }
  };

  const clearFollowUpReminder = async () => {
    if (!selectedLead) return;
    
    try {
      await updateLead(selectedLead.id, { followUpDate: null });
      
      const updatedLead = {
        ...selectedLead,
        followUpDate: null
      };
      
      setLeads(leads.map(lead => 
        lead.id === selectedLead.id ? updatedLead : lead
      ));
      
      setSelectedLead(updatedLead);
      setFollowUpDate('');
      
      toast({
        title: "Reminder cleared",
        description: "Follow-up reminder has been removed",
      });
    } catch (error) {
      console.error('Error clearing follow-up:', error);
      toast({
        title: "Error",
        description: "Failed to clear follow-up reminder",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

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
              <option value="lost">Lost</option>
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
                    onClick={() => requestSort('createdAt')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Date</span>
                      {getSortDirectionIcon('createdAt')}
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
                        {lead.squareFootage && (
                          <div className="text-xs text-muted-foreground">{lead.squareFootage} sq ft</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead['status'])}
                        className={`px-2 py-1 rounded text-xs font-medium border-0 ${
                          lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                          lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                          lead.status === 'converted' ? 'bg-green-100 text-green-800' :
                          lead.status === 'lost' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                        <option value="lost">Lost</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {lead.followUpDate ? (
                        <div className="flex items-center text-amber-600">
                          <Bell className="h-4 w-4 mr-2" />
                          {lead.followUpDate}
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
          <div className="bg-card rounded-lg shadow-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center">
              <h2 className="text-xl font-semibold">Lead Details: {selectedLead.name}</h2>
              <button
                onClick={closeLeadDetail}
                className="text-muted-foreground hover:text-foreground"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6">
              <LeadDetail leadId={selectedLead.id} userId="admin" />
            </div>
            
            <div className="px-6 py-4 border-t border-border flex justify-between">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Status</h3>
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as Lead['status'])}
                  className={`px-2 py-1 rounded text-xs font-medium border-0 ${
                    selectedLead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                    selectedLead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                    selectedLead.status === 'converted' ? 'bg-green-100 text-green-800' :
                    selectedLead.status === 'lost' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="converted">Converted</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
              
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
