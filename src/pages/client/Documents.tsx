import React, { useState, useEffect } from 'react';
import { useFirebase } from '@/contexts/FirebaseContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { 
  LogOut,
  LayoutDashboard,
  FileText,
  ShoppingCart,
  MessageSquare,
  Settings,
  Menu,
  Download,
  Eye,
  FileIcon,
  FolderIcon
} from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { getUserOrders, Order } from '@/services/orderService';

// Temporary document type until we implement document service
interface Document {
  id: string;
  name: string;
  type: string;
  createdAt: Date;
  size: string;
  url: string;
  orderId: string;
}

const ClientDocuments = () => {
  const { currentUser, signOut } = useFirebase();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been successfully logged out of your account."
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error signing out",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };

  // Fetch orders and documents on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        navigate('/login');
        return;
      }

      try {
        const userOrders = await getUserOrders(currentUser.uid);
        setOrders(userOrders);
        
        // Mock document data based on orders
        // In a real implementation, this would be fetched from Firestore
        const mockDocuments: Document[] = [];
        userOrders.forEach(order => {
          // For each order, create some mock documents
          if (order.status === 'in-progress' || order.status === 'completed') {
            mockDocuments.push({
              id: `doc-${Math.random().toString(36).substring(2, 9)}`,
              name: `${order.projectType} - Draft Plans.pdf`,
              type: 'pdf',
              createdAt: new Date(order.createdAt.getTime() + 86400000), // One day after order
              size: '2.4 MB',
              url: '#',
              orderId: order.id
            });
            
            mockDocuments.push({
              id: `doc-${Math.random().toString(36).substring(2, 9)}`,
              name: `${order.projectType} - Specifications.docx`,
              type: 'docx',
              createdAt: new Date(order.createdAt.getTime() + 172800000), // Two days after order
              size: '1.2 MB',
              url: '#',
              orderId: order.id
            });
            
            if (order.additionalServices.sitePlan) {
              mockDocuments.push({
                id: `doc-${Math.random().toString(36).substring(2, 9)}`,
                name: `${order.projectType} - Site Plan.pdf`,
                type: 'pdf',
                createdAt: new Date(order.createdAt.getTime() + 259200000), // Three days after order
                size: '3.1 MB',
                url: '#',
                orderId: order.id
              });
            }
            
            if (order.additionalServices.materialList) {
              mockDocuments.push({
                id: `doc-${Math.random().toString(36).substring(2, 9)}`,
                name: `${order.projectType} - Material List.xlsx`,
                type: 'xlsx',
                createdAt: new Date(order.createdAt.getTime() + 345600000), // Four days after order
                size: '0.8 MB',
                url: '#',
                orderId: order.id
              });
            }
            
            if (order.additionalServices.render3D) {
              mockDocuments.push({
                id: `doc-${Math.random().toString(36).substring(2, 9)}`,
                name: `${order.projectType} - 3D Rendering.png`,
                type: 'png',
                createdAt: new Date(order.createdAt.getTime() + 432000000), // Five days after order
                size: '4.7 MB',
                url: '#',
                orderId: order.id
              });
            }
          }
        });
        
        setDocuments(mockDocuments);
      } catch (error) {
        console.log('Error fetching data:', error);
        toast({
          title: "Error fetching data",
          description: "Could not load your documents. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUser, navigate, toast]);

  const navigation = [
    { name: 'Overview', icon: LayoutDashboard, path: '/client/dashboard' },
    { name: 'Orders', icon: ShoppingCart, path: '/client/orders' },
    { name: 'Documents', icon: FileText, path: '/client/documents' },
    { name: 'Messages', icon: MessageSquare, path: '/client/messages' },
    { name: 'Settings', icon: Settings, path: '/client/settings' },
  ];

  const getDocumentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'docx':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'xlsx':
        return <FileText className="h-5 w-5 text-green-500" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
        return <FileIcon className="h-5 w-5 text-purple-500" />;
      default:
        return <FileIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  // Group documents by order
  const documentsByOrder = orders.reduce((acc, order) => {
    const orderDocs = documents.filter(doc => doc.orderId === order.id);
    if (orderDocs.length > 0) {
      acc.push({
        order,
        documents: orderDocs
      });
    }
    return acc;
  }, [] as { order: Order; documents: Document[] }[]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-28 lg:pt-32 pb-24">
        <div className="container px-4 mx-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row">
              {/* Sidebar (Desktop) */}
              <aside className="hidden md:flex flex-col w-64 shrink-0 mr-8">
                <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
                  <div className="mb-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold">
                        {currentUser?.displayName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-medium">{currentUser?.displayName}</p>
                        <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
                      </div>
                    </div>
                    <Button onClick={handleSignOut} variant="outline" size="sm" className="w-full">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                  
                  <nav className="space-y-1">
                    {navigation.map((item) => (
                      <Button
                        key={item.name}
                        variant={item.name === 'Documents' ? 'default' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => navigate(item.path)}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.name}
                      </Button>
                    ))}
                  </nav>
                </div>
              </aside>

              {/* Sidebar (Mobile) */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden mb-4">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <div className="mb-6 mt-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold">
                        {currentUser?.displayName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-medium">{currentUser?.displayName}</p>
                        <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
                      </div>
                    </div>
                    <Button onClick={handleSignOut} variant="outline" size="sm" className="w-full">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                  
                  <nav className="space-y-1">
                    {navigation.map((item) => (
                      <Button
                        key={item.name}
                        variant={item.name === 'Documents' ? 'default' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => {
                          navigate(item.path);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.name}
                      </Button>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>

              {/* Main Content */}
              <div className="flex-1">
                <div className="bg-white rounded-lg shadow-sm mb-6">
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">My Documents</h1>
                    <p className="text-muted-foreground">Access all your project documents</p>
                  </div>
                </div>

                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent"></div>
                    <p className="mt-2 text-muted-foreground">Loading your documents...</p>
                  </div>
                ) : documentsByOrder.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Documents Found</h3>
                      <p className="text-muted-foreground mb-4">You don't have any documents available yet.</p>
                      <Button onClick={() => navigate('/order')}>Start a New Project</Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-8">
                    {documentsByOrder.map(({ order, documents }) => (
                      <div key={order.id}>
                        <div className="flex items-center mb-3">
                          <FolderIcon className="h-5 w-5 text-amber-500 mr-2" />
                          <h2 className="text-lg font-medium">
                            {order.projectType} - {order.squareFootage} sq ft
                            <span className="text-sm font-normal text-muted-foreground ml-2">
                              Project #{order.id.slice(-8)}
                            </span>
                          </h2>
                        </div>
                        
                        <Card>
                          <CardContent className="p-0">
                            <table className="w-full">
                              <thead className="bg-gray-50 border-b">
                                <tr>
                                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Name</th>
                                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 hidden md:table-cell">Date</th>
                                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 hidden sm:table-cell">Size</th>
                                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y">
                                {documents.map(doc => (
                                  <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6">
                                      <div className="flex items-center">
                                        {getDocumentIcon(doc.type)}
                                        <span className="ml-2">{doc.name}</span>
                                      </div>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-500 hidden md:table-cell">
                                      {doc.createdAt.toLocaleDateString()}
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-500 hidden sm:table-cell">
                                      {doc.size}
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                      <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => window.open(doc.url, '_blank')}>
                                          <Eye className="h-4 w-4" />
                                          <span className="sr-only">View</span>
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => window.open(doc.url, '_blank')}>
                                          <Download className="h-4 w-4" />
                                          <span className="sr-only">Download</span>
                                        </Button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClientDocuments;
