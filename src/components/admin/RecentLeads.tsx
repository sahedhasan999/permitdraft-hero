
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { getRecentLeads, Lead } from '@/services/leadsService';

const RecentLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await getRecentLeads(5);
        setLeads(data);
      } catch (error) {
        console.error("Error fetching recent leads:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeads();
  }, []);

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex justify-between items-center">
        <h2 className="text-xl font-semibold">Recent Leads</h2>
        <Link to="/admin/leads" className="text-primary text-sm hover:underline">
          View All
        </Link>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted">
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div>
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-xs text-muted-foreground">{lead.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{lead.projectType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                      lead.status === 'contacted' ? 'bg-purple-100 text-purple-800' :
                      lead.status === 'converted' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {leads.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No recent leads found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecentLeads;
