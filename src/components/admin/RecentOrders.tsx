
import React from 'react';
import { Link } from 'react-router-dom';

// Mock data for recent orders
const recentOrders = [
  { id: 'ORD-1234', customer: 'John Smith', service: 'Deck Design', amount: '$499', status: 'Completed', date: '2023-09-01' },
  { id: 'ORD-1235', customer: 'Sarah Johnson', service: 'Patio Design', amount: '$649', status: 'Processing', date: '2023-09-03' },
  { id: 'ORD-1236', customer: 'Michael Brown', service: 'Pergola Design', amount: '$399', status: 'Pending', date: '2023-09-05' },
  { id: 'ORD-1237', customer: 'Emily Davis', service: 'Outdoor Kitchen', amount: '$899', status: 'Completed', date: '2023-09-06' },
  { id: 'ORD-1238', customer: 'David Wilson', service: 'Home Addition', amount: '$1,299', status: 'Processing', date: '2023-09-08' },
];

const RecentOrders = () => {
  return (
    <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex justify-between items-center">
        <h2 className="text-xl font-semibold">Recent Orders</h2>
        <Link to="/admin/orders" className="text-primary text-sm hover:underline">
          View All
        </Link>
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
  );
};

export default RecentOrders;
