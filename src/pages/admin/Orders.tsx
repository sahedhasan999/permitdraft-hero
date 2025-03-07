
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Search, Filter, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

// Mock orders data
const mockOrders = [
  { 
    id: 'ORD-1234', 
    customer: 'John Smith', 
    email: 'john@example.com',
    phone: '(555) 123-4567',
    service: 'Deck Design', 
    amount: 499, 
    status: 'Completed', 
    date: '2023-09-01',
    address: '123 Main St, Anytown, CA',
  },
  { 
    id: 'ORD-1235', 
    customer: 'Sarah Johnson', 
    email: 'sarah@example.com',
    phone: '(555) 234-5678',
    service: 'Patio Design', 
    amount: 649, 
    status: 'Processing', 
    date: '2023-09-03',
    address: '456 Oak Ave, Someville, CA',
  },
  { 
    id: 'ORD-1236', 
    customer: 'Michael Brown', 
    email: 'michael@example.com',
    phone: '(555) 345-6789',
    service: 'Pergola Design', 
    amount: 399, 
    status: 'Pending', 
    date: '2023-09-05',
    address: '789 Pine Blvd, Othercity, CA',
  },
  { 
    id: 'ORD-1237', 
    customer: 'Emily Davis', 
    email: 'emily@example.com',
    phone: '(555) 456-7890',
    service: 'Outdoor Kitchen', 
    amount: 899, 
    status: 'Completed', 
    date: '2023-09-06',
    address: '101 Cedar Ln, Newtown, CA',
  },
  { 
    id: 'ORD-1238', 
    customer: 'David Wilson', 
    email: 'david@example.com',
    phone: '(555) 567-8901',
    service: 'Home Addition', 
    amount: 1299, 
    status: 'Processing', 
    date: '2023-09-08',
    address: '202 Elm St, Springfield, CA',
  },
  { 
    id: 'ORD-1239', 
    customer: 'Jessica Brown', 
    email: 'jessica@example.com',
    phone: '(555) 678-9012',
    service: 'Deck Design', 
    amount: 499, 
    status: 'Cancelled', 
    date: '2023-09-10',
    address: '303 Maple Dr, Riverside, CA',
  },
  { 
    id: 'ORD-1240', 
    customer: 'Thomas Johnson', 
    email: 'thomas@example.com',
    phone: '(555) 789-0123',
    service: 'Patio Design', 
    amount: 649, 
    status: 'Pending', 
    date: '2023-09-12',
    address: '404 Birch Ave, Hillside, CA',
  },
  { 
    id: 'ORD-1241', 
    customer: 'Lisa Garcia', 
    email: 'lisa@example.com',
    phone: '(555) 890-1234',
    service: 'Home Addition', 
    amount: 1299, 
    status: 'Processing', 
    date: '2023-09-14',
    address: '505 Walnut St, Lakeside, CA',
  },
  { 
    id: 'ORD-1242', 
    customer: 'Robert Martinez', 
    email: 'robert@example.com',
    phone: '(555) 901-2345',
    service: 'Pergola Design', 
    amount: 399, 
    status: 'Completed', 
    date: '2023-09-16',
    address: '606 Cherry Ln, Mountain View, CA',
  },
  { 
    id: 'ORD-1243', 
    customer: 'Jennifer Taylor', 
    email: 'jennifer@example.com',
    phone: '(555) 012-3456',
    service: 'Outdoor Kitchen', 
    amount: 899, 
    status: 'Completed', 
    date: '2023-09-18',
    address: '707 Aspen Blvd, Seaside, CA',
  },
];

const Orders = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Sort function
  const sortedOrders = React.useMemo(() => {
    let sortableOrders = [...orders];
    
    // Apply search filter
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      sortableOrders = sortableOrders.filter(
        order => 
          order.id.toLowerCase().includes(lowerCaseSearch) ||
          order.customer.toLowerCase().includes(lowerCaseSearch) ||
          order.email.toLowerCase().includes(lowerCaseSearch) ||
          order.service.toLowerCase().includes(lowerCaseSearch)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      sortableOrders = sortableOrders.filter(
        order => order.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    // Apply sorting
    if (sortConfig !== null) {
      sortableOrders.sort((a, b) => {
        if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortableOrders;
  }, [orders, searchTerm, sortConfig, statusFilter]);

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

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(
      orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const openOrderDetail = (order: typeof mockOrders[0]) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const closeOrderDetail = () => {
    setIsDetailOpen(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Orders Management</h1>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search orders..."
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
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted">
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('id')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Order ID</span>
                      {getSortDirectionIcon('id')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('customer')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Customer</span>
                      {getSortDirectionIcon('customer')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('service')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Service</span>
                      {getSortDirectionIcon('service')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('amount')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Amount</span>
                      {getSortDirectionIcon('amount')}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div>
                        <div className="font-medium">{order.customer}</div>
                        <div className="text-xs text-muted-foreground">{order.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{order.service}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">${order.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`px-2 py-1 rounded text-xs font-medium border-0 ${
                          order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => openOrderDetail(order)}
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
          
          {sortedOrders.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No orders found</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {isDetailOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center">
              <h2 className="text-xl font-semibold">Order Details: {selectedOrder.id}</h2>
              <button
                onClick={closeOrderDetail}
                className="text-muted-foreground hover:text-foreground"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Customer Information</h3>
                  <p className="font-medium">{selectedOrder.customer}</p>
                  <p className="text-sm">{selectedOrder.email}</p>
                  <p className="text-sm">{selectedOrder.phone}</p>
                  <p className="text-sm mt-2">{selectedOrder.address}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Order Information</h3>
                  <p><span className="font-medium">Date:</span> {selectedOrder.date}</p>
                  <p><span className="font-medium">Service:</span> {selectedOrder.service}</p>
                  <p><span className="font-medium">Amount:</span> ${selectedOrder.amount.toFixed(2)}</p>
                  <div className="mt-2">
                    <span className="font-medium">Status:</span>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                      className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                        selectedOrder.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        selectedOrder.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        selectedOrder.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-border pt-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Order Timeline</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-4 w-4 rounded-full bg-green-500 mt-1"></div>
                    <div className="ml-3">
                      <p className="text-sm">Order Placed</p>
                      <p className="text-xs text-muted-foreground">{selectedOrder.date}</p>
                    </div>
                  </li>
                  {selectedOrder.status !== 'Pending' && (
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-4 w-4 rounded-full bg-blue-500 mt-1"></div>
                      <div className="ml-3">
                        <p className="text-sm">Processing Started</p>
                        <p className="text-xs text-muted-foreground">{selectedOrder.date}</p>
                      </div>
                    </li>
                  )}
                  {selectedOrder.status === 'Completed' && (
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-4 w-4 rounded-full bg-green-500 mt-1"></div>
                      <div className="ml-3">
                        <p className="text-sm">Order Completed</p>
                        <p className="text-xs text-muted-foreground">{selectedOrder.date}</p>
                      </div>
                    </li>
                  )}
                  {selectedOrder.status === 'Cancelled' && (
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-4 w-4 rounded-full bg-red-500 mt-1"></div>
                      <div className="ml-3">
                        <p className="text-sm">Order Cancelled</p>
                        <p className="text-xs text-muted-foreground">{selectedOrder.date}</p>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-border flex justify-end">
              <button
                onClick={closeOrderDetail}
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

export default Orders;
