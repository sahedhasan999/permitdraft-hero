import React, { useState, useEffect } from 'react';
import { Lead, getLeads, updateLeadStatus } from '@/services/leadsService';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, Search, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'converted', label: 'Converted' },
  { value: 'lost', label: 'Lost' },
];

const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  qualified: 'bg-orange-100 text-orange-800',
  converted: 'bg-green-100 text-green-800',
  lost: 'bg-red-100 text-red-800',
  closed: 'bg-gray-100 text-gray-800'
};

export const LeadsManager: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    filterLeads();
  }, [leads, searchQuery, statusFilter]);

  const loadLeads = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Starting to load leads...');
      const fetchedLeads = await getLeads();
      console.log('Fetched leads from service:', fetchedLeads);
      
      // Validate and clean up each lead
      const validLeads = fetchedLeads.filter(lead => {
        if (!lead.id || !lead.name || !lead.email || !lead.projectType) {
          console.warn('Invalid lead data:', lead);
          return false;
        }
        return true;
      });

      console.log('Valid leads after filtering:', validLeads);
      setLeads(validLeads);
      setFilteredLeads(validLeads);
    } catch (error) {
      console.error('Error loading leads:', error);
      setError('Failed to load leads. Please try again.');
      toast.error('Failed to load leads');
    } finally {
      setIsLoading(false);
    }
  };

  const filterLeads = () => {
    console.log('Filtering leads with query:', searchQuery, 'and status:', statusFilter);
    let filtered = [...leads];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(lead => {
        const matches = 
          lead.name.toLowerCase().includes(query) ||
          lead.email.toLowerCase().includes(query) ||
          lead.projectType.toLowerCase().includes(query);
        if (!matches) {
          console.log('Lead filtered out by search:', lead);
        }
        return matches;
      });
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => {
        const matches = lead.status === statusFilter;
        if (!matches) {
          console.log('Lead filtered out by status:', lead);
        }
        return matches;
      });
    }

    console.log('Filtered leads:', filtered);
    setFilteredLeads(filtered);
  };

  const handleStatusChange = async (leadId: string, newStatus: Lead['status']) => {
    try {
      await updateLeadStatus(leadId, newStatus);
      setLeads(leads.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ));
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={loadLeads}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Lead Management</h1>
        <div className="text-sm text-gray-500">
          Total Leads: {leads.length}
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredLeads.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {leads.length === 0 ? (
            'No leads found in the database. New leads will appear here when they submit the quote form.'
          ) : (
            'No leads match your current filters. Try adjusting your search or status filter.'
          )}
        </div>
      ) : (
        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>NAME</TableHead>
                <TableHead>PROJECT</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>DATE</TableHead>
                <TableHead>FOLLOW UP</TableHead>
                <TableHead>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-sm text-gray-500">{lead.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{lead.projectType}</div>
                      {lead.squareFootage && (
                        <div className="text-sm text-gray-500">{lead.squareFootage} sq ft</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={lead.status}
                      onValueChange={(value) => handleStatusChange(lead.id, value as Lead['status'])}
                    >
                      <SelectTrigger className={`w-[140px] ${statusColors[lead.status]}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.filter(opt => opt.value !== 'all').map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {format(lead.createdAt instanceof Date ? lead.createdAt : new Date(lead.createdAt), 'yyyy-MM-dd')}
                    </div>
                  </TableCell>
                  <TableCell>
                    {lead.followUpDate ? (
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-yellow-500">
                          {format(new Date(lead.followUpDate), 'yyyy-MM-dd')}
                        </span>
                      </div>
                    ) : (
                      <span>-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="link" className="text-primary">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}; 