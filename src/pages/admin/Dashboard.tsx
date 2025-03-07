
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  ShoppingCart, 
  Users, 
  MessageSquare, 
  ArrowUp, 
  ArrowDown, 
  Clock, 
  CheckCircle 
} from 'lucide-react';

// Mock data
const stats = [
  {
    title: 'Total Orders',
    value: '124',
    icon: ShoppingCart,
    change: '+12%',
    changeType: 'positive',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-500',
  },
  {
    title: 'New Leads',
    value: '42',
    icon: Users,
    change: '+18%',
    changeType: 'positive',
    bgColor: 'bg-teal-50 dark:bg-teal-900/20',
    iconColor: 'text-teal-500',
  },
  {
    title: 'Communications',
    value: '89',
    icon: MessageSquare,
    change: '-5%',
    changeType: 'negative',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    iconColor: 'text-purple-500',
  },
  {
    title: 'Completed Projects',
    value: '76',
    icon: CheckCircle,
    change: '+8%',
    changeType: 'positive',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    iconColor: 'text-green-500',
  }
];

const recentOrders = [
  { id: 'ORD-1234', customer: 'John Smith', service: 'Deck Design', amount: '$499', status: 'Completed', date: '2023-09-01' },
  { id: 'ORD-1235', customer: 'Sarah Johnson', service: 'Patio Design', amount: '$649', status: 'Processing', date: '2023-09-03' },
  { id: 'ORD-1236', customer: 'Michael Brown', service: 'Pergola Design', amount: '$399', status: 'Pending', date: '2023-09-05' },
  { id: 'ORD-1237', customer: 'Emily Davis', service: 'Outdoor Kitchen', amount: '$899', status: 'Completed', date: '2023-09-06' },
  { id: 'ORD-1238', customer: 'David Wilson', service: 'Home Addition', amount: '$1,299', status: 'Processing', date: '2023-09-08' },
];

const recentLeads = [
  { id: 'LEAD-1001', name: 'Jennifer Williams', email: 'jennifer@example.com', project: 'Deck', status: 'New', date: '2023-09-08' },
  { id: 'LEAD-1002', name: 'Robert Taylor', email: 'robert@example.com', project: 'Patio', status: 'Contacted', date: '2023-09-07' },
  { id: 'LEAD-1003', name: 'Lisa Anderson', email: 'lisa@example.com', project: 'Pergola', status: 'Converted', date: '2023-09-06' },
  { id: 'LEAD-1004', name: 'James Martinez', email: 'james@example.com', project: 'Home Addition', status: 'New', date: '2023-09-05' },
];

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || 'Admin'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-card rounded-lg shadow-sm p-6 border border-border"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-muted-foreground">{stat.title}</h3>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold">{stat.value}</p>
                <div className={`flex items-center text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.changeType === 'positive' ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center">
              <h2 className="text-xl font-semibold">Recent Orders</h2>
              <a href="/admin/orders" className="text-primary text-sm hover:underline">
                View All
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted">
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{order.customer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{order.service}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{order.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Leads */}
          <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center">
              <h2 className="text-xl font-semibold">Recent Leads</h2>
              <a href="/admin/leads" className="text-primary text-sm hover:underline">
                View All
              </a>
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
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
