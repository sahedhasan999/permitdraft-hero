
import React from 'react';
import { Link } from 'react-router-dom';

// Mock data for recent leads
const recentLeads = [
  { id: 'LEAD-1001', name: 'Jennifer Williams', email: 'jennifer@example.com', project: 'Deck', status: 'New', date: '2023-09-08' },
  { id: 'LEAD-1002', name: 'Robert Taylor', email: 'robert@example.com', project: 'Patio', status: 'Contacted', date: '2023-09-07' },
  { id: 'LEAD-1003', name: 'Lisa Anderson', email: 'lisa@example.com', project: 'Pergola', status: 'Converted', date: '2023-09-06' },
  { id: 'LEAD-1004', name: 'James Martinez', email: 'james@example.com', project: 'Home Addition', status: 'New', date: '2023-09-05' },
];

const RecentLeads = () => {
  return (
    <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex justify-between items-center">
        <h2 className="text-xl font-semibold">Recent Leads</h2>
        <Link to="/admin/leads" className="text-primary text-sm hover:underline">
          View All
        </Link>
      </div>
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
            {recentLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-muted/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div>
                    <div className="font-medium">{lead.name}</div>
                    <div className="text-xs text-muted-foreground">{lead.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{lead.project}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                    lead.status === 'Contacted' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{lead.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentLeads;
