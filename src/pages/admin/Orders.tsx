import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Search, Filter, ChevronDown, ChevronUp, Loader2, Download, FileText, Image, FileIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getOrders, updateOrderStatus, Order } from '@/services/orderService';

const getFileIconComponent = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return <FileText className="h-4 w-4 mr-2 text-red-500" />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return <Image className="h-4 w-4 mr-2 text-blue-500" />;
    default:
      return <FileIcon className="h-4 w-4 mr-2 text-gray-500" />;
  }
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Order; direction: 'asc' | 'desc' } | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      toast({
        title: "Error fetching orders",
        description: "There was a problem loading the orders.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Sort function
  const sortedOrders = React.useMemo(() => {
    let sortableOrders = [...orders];
    
    // Apply search filter
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      sortableOrders = sortableOrders.filter(
        order => 
          order.id.toLowerCase().includes(lowerCaseSearch) ||
          order.name.toLowerCase().includes(lowerCaseSearch) ||
          order.email.toLowerCase().includes(lowerCaseSearch) ||
          order.projectType.toLowerCase().includes(lowerCaseSearch)
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
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortableOrders;
  }, [orders, searchTerm, sortConfig, statusFilter]);

  // Request sort function
  const requestSort = (key: keyof Order) => {
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

  const getSortDirectionIcon = (name: keyof Order) => {
    if (!sortConfig || sortConfig.key !== name) {
      return null;
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    setIsUpdating(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      
      setOrders(
        orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      
      toast({
        title: "Order status updated",
        description: `Order ${orderId.substring(0, 8).toUpperCase()} status changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error updating order status",
        description: "There was a problem updating the order status.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const openOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const closeOrderDetail = () => {
    setIsDetailOpen(false);
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
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
                      onClick={() => requestSort('name')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Customer</span>
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
                      onClick={() => requestSort('totalPrice')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Amount</span>
                        {getSortDirectionIcon('totalPrice')}
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sortedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{order.id.substring(0, 8).toUpperCase()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div>
                          <div className="font-medium">{order.name}</div>
                          <div className="text-xs text-muted-foreground">{order.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{order.projectType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">${order.totalPrice.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                          disabled={isUpdating}
                          className={`px-2 py-1 rounded text-xs font-medium border-0 ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-amber-100 text-amber-800'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(order.createdAt)}</td>
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
          )}
          
          {!isLoading && sortedOrders.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No orders found</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {isDetailOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center">
              <h2 className="text-xl font-semibold">Order Details: {selectedOrder.id.substring(0, 8).toUpperCase()}</h2>
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
                  <p className="font-medium">{selectedOrder.name}</p>
                  <p className="text-sm">{selectedOrder.email}</p>
                  <p className="text-sm">{selectedOrder.phone}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Order Information</h3>
                  <p><span className="font-medium">Date:</span> {formatDate(selectedOrder.createdAt)}</p>
                  <p><span className="font-medium">Project:</span> {selectedOrder.projectType}</p>
                  <p><span className="font-medium">Square Feet:</span> {selectedOrder.squareFootage}</p>
                  <p><span className="font-medium">Amount:</span> ${selectedOrder.totalPrice.toFixed(2)}</p>
                  <div className="mt-2">
                    <span className="font-medium">Status:</span>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as Order['status'])}
                      disabled={isUpdating}
                      className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                        selectedOrder.status === 'completed' ? 'bg-green-100 text-green-800' :
                        selectedOrder.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        selectedOrder.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Additional Details Section */}
              {selectedOrder.additionalDetails && (
                <div className="border-t border-border pt-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Additional Details</h3>
                  <div className="bg-muted/50 p-4 rounded-md whitespace-pre-wrap text-sm">
                    {selectedOrder.additionalDetails}
                  </div>
                </div>
              )}

              {/* Attachments Section */}
              {selectedOrder.attachments && selectedOrder.attachments.length > 0 && (
                <div className="border-t border-border pt-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Project Documents</h3>
                  <div className="space-y-2">
                    {selectedOrder.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-border rounded-md bg-muted/30">
                        <div className="flex items-center">
                          {getFileIconComponent(attachment.name)}
                          <div className="ml-2">
                            <p className="text-sm font-medium">{attachment.name}</p>
                            <p className="text-xs text-muted-foreground">{attachment.size}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => window.open(attachment.url, '_blank')}
                          className="flex items-center px-3 py-1 bg-primary text-primary-foreground rounded text-xs hover:bg-primary/90"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="border-t border-border pt-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Additional Services</h3>
                <ul className="mt-2 space-y-1 text-sm">
                  {selectedOrder.additionalServices.sitePlan && (
                    <li className="flex items-center">
                      <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                      Site Plan
                    </li>
                  )}
                  {selectedOrder.additionalServices.materialList && (
                    <li className="flex items-center">
                      <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                      Material List
                    </li>
                  )}
                  {selectedOrder.additionalServices.render3D && (
                    <li className="flex items-center">
                      <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                      3D Rendering
                    </li>
                  )}
                  {!selectedOrder.additionalServices.sitePlan && 
                   !selectedOrder.additionalServices.materialList && 
                   !selectedOrder.additionalServices.render3D && (
                    <li>No additional services selected</li>
                  )}
                </ul>
              </div>
              
              <div className="border-t border-border pt-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Order Timeline</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-4 w-4 rounded-full bg-green-500 mt-1"></div>
                    <div className="ml-3">
                      <p className="text-sm">Order Placed</p>
                      <p className="text-xs text-muted-foreground">{formatDate(selectedOrder.createdAt)}</p>
                    </div>
                  </li>
                  {selectedOrder.status !== 'pending' && (
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-4 w-4 rounded-full bg-blue-500 mt-1"></div>
                      <div className="ml-3">
                        <p className="text-sm">Processing Started</p>
                        <p className="text-xs text-muted-foreground">{formatDate(selectedOrder.updatedAt)}</p>
                      </div>
                    </li>
                  )}
                  {selectedOrder.status === 'completed' && (
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-4 w-4 rounded-full bg-green-500 mt-1"></div>
                      <div className="ml-3">
                        <p className="text-sm">Order Completed</p>
                        <p className="text-xs text-muted-foreground">{formatDate(selectedOrder.updatedAt)}</p>
                      </div>
                    </li>
                  )}
                  {selectedOrder.status === 'cancelled' && (
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-4 w-4 rounded-full bg-red-500 mt-1"></div>
                      <div className="ml-3">
                        <p className="text-sm">Order Cancelled</p>
                        <p className="text-xs text-muted-foreground">{formatDate(selectedOrder.updatedAt)}</p>
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
