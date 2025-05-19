import React, { useState, useEffect } from 'react';
import { useFirebase } from '@/contexts/FirebaseContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { 
  Bell,
  ChevronRight,
  LogOut,
  LayoutDashboard,
  FileText,
  ShoppingCart,
  MessageSquare,
  Settings,
  Menu,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { getUserOrders, Order } from '@/services/orderService';

const ClientOrders = () => {
  const { currentUser, signOut } = useFirebase();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
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

  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) {
        navigate('/login');
        return;
      }

      try {
        const userOrders = await getUserOrders(currentUser.uid);
        setOrders(userOrders);
      } catch (error) {
        toast({
          title: "Error fetching orders",
          description: "Could not load your orders. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser, navigate, toast]);

  const navigation = [
    { name: 'Overview', icon: LayoutDashboard, path: '/client/dashboard' },
    { name: 'Orders', icon: ShoppingCart, path: '/client/orders' },
    { name: 'Documents', icon: FileText, path: '/client/documents' },
    { name: 'Messages', icon: MessageSquare, path: '/client/messages' },
    { name: 'Settings', icon: Settings, path: '/client/settings' },
  ];

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-blue-500" />;
    }
  };

  const getPaymentStatusBadge = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'paid':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Paid</span>;
      case 'failed':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Failed</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">Pending</span>;
    }
  };

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
                        variant={item.name === 'Orders' ? 'default' : 'ghost'}
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
                        variant={item.name === 'Orders' ? 'default' : 'ghost'}
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
                    <h1 className="text-2xl font-bold">My Orders</h1>
                    <p className="text-muted-foreground">Manage and track all your orders</p>
                  </div>
                </div>

                <Tabs defaultValue="all">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">All Orders</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="space-y-4">
                    {isLoading ? (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent"></div>
                        <p className="mt-2 text-muted-foreground">Loading your orders...</p>
                      </div>
                    ) : orders.length === 0 ? (
                      <Card>
                        <CardContent className="text-center py-8">
                          <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">No Orders Found</h3>
                          <p className="text-muted-foreground mb-4">You don't have any orders yet.</p>
                          <Button onClick={() => navigate('/order')}>Start a New Project</Button>
                        </CardContent>
                      </Card>
                    ) : (
                      orders.map(order => (
                        <Card key={order.id} className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="flex items-center p-4 border-b">
                              <div className="mr-4">
                                {getStatusIcon(order.status)}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <div>
                                    <h3 className="font-medium">{order.projectType} - {order.squareFootage} sq ft</h3>
                                    <p className="text-sm text-muted-foreground">
                                      Order #{order.id.slice(-8)} • {order.createdAt.toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">${order.totalPrice}</p>
                                    <div className="mt-1">
                                      {getPaymentStatusBadge(order.paymentStatus)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-4 bg-gray-50">
                              <div className="text-sm space-y-2">
                                <div className="flex">
                                  <span className="font-medium w-32">Status:</span>
                                  <span className="capitalize">{order.status}</span>
                                </div>
                                <div className="flex">
                                  <span className="font-medium w-32">Project Type:</span>
                                  <span>{order.projectType}</span>
                                </div>
                                <div className="flex">
                                  <span className="font-medium w-32">Square Footage:</span>
                                  <span>{order.squareFootage} sq ft</span>
                                </div>
                                <div className="flex">
                                  <span className="font-medium w-32">Additional Services:</span>
                                  <span>
                                    {order.additionalServices.sitePlan ? 'Site Plan, ' : ''}
                                    {order.additionalServices.materialList ? 'Material List, ' : ''}
                                    {order.additionalServices.render3D ? '3D Rendering' : ''}
                                    {!order.additionalServices.sitePlan && 
                                     !order.additionalServices.materialList && 
                                     !order.additionalServices.render3D && 'None'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </TabsContent>
                  
                  <TabsContent value="active" className="space-y-4">
                    {isLoading ? (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent"></div>
                        <p className="mt-2 text-muted-foreground">Loading your orders...</p>
                      </div>
                    ) : orders.filter(o => o.status === 'pending' || o.status === 'in-progress').length === 0 ? (
                      <Card>
                        <CardContent className="text-center py-8">
                          <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">No Active Orders</h3>
                          <p className="text-muted-foreground mb-4">You don't have any active orders at the moment.</p>
                          <Button onClick={() => navigate('/order')}>Start a New Project</Button>
                        </CardContent>
                      </Card>
                    ) : (
                      orders
                        .filter(o => o.status === 'pending' || o.status === 'in-progress')
                        .map(order => (
                          <Card key={order.id} className="overflow-hidden">
                            <CardContent className="p-0">
                              <div className="flex items-center p-4 border-b">
                                <div className="mr-4">
                                  {getStatusIcon(order.status)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between">
                                    <div>
                                      <h3 className="font-medium">{order.projectType} - {order.squareFootage} sq ft</h3>
                                      <p className="text-sm text-muted-foreground">
                                        Order #{order.id.slice(-8)} • {order.createdAt.toLocaleDateString()}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-medium">${order.totalPrice}</p>
                                      <div className="mt-1">
                                        {getPaymentStatusBadge(order.paymentStatus)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="p-4 bg-gray-50">
                                <div className="text-sm space-y-2">
                                  <div className="flex">
                                    <span className="font-medium w-32">Status:</span>
                                    <span className="capitalize">{order.status}</span>
                                  </div>
                                  <div className="flex">
                                    <span className="font-medium w-32">Project Type:</span>
                                    <span>{order.projectType}</span>
                                  </div>
                                  <div className="flex">
                                    <span className="font-medium w-32">Square Footage:</span>
                                    <span>{order.squareFootage} sq ft</span>
                                  </div>
                                  <div className="flex">
                                    <span className="font-medium w-32">Additional Services:</span>
                                    <span>
                                      {order.additionalServices.sitePlan ? 'Site Plan, ' : ''}
                                      {order.additionalServices.materialList ? 'Material List, ' : ''}
                                      {order.additionalServices.render3D ? '3D Rendering' : ''}
                                      {!order.additionalServices.sitePlan && 
                                       !order.additionalServices.materialList && 
                                       !order.additionalServices.render3D && 'None'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                    )}
                  </TabsContent>
                  
                  <TabsContent value="completed" className="space-y-4">
                    {isLoading ? (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent"></div>
                        <p className="mt-2 text-muted-foreground">Loading your orders...</p>
                      </div>
                    ) : orders.filter(o => o.status === 'completed').length === 0 ? (
                      <Card>
                        <CardContent className="text-center py-8">
                          <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">No Completed Orders</h3>
                          <p className="text-muted-foreground mb-4">You don't have any completed orders yet.</p>
                          <Button onClick={() => navigate('/order')}>Start a New Project</Button>
                        </CardContent>
                      </Card>
                    ) : (
                      orders
                        .filter(o => o.status === 'completed')
                        .map(order => (
                          <Card key={order.id} className="overflow-hidden">
                            <CardContent className="p-0">
                              <div className="flex items-center p-4 border-b">
                                <div className="mr-4">
                                  {getStatusIcon(order.status)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between">
                                    <div>
                                      <h3 className="font-medium">{order.projectType} - {order.squareFootage} sq ft</h3>
                                      <p className="text-sm text-muted-foreground">
                                        Order #{order.id.slice(-8)} • {order.createdAt.toLocaleDateString()}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-medium">${order.totalPrice}</p>
                                      <div className="mt-1">
                                        {getPaymentStatusBadge(order.paymentStatus)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="p-4 bg-gray-50">
                                <div className="text-sm space-y-2">
                                  <div className="flex">
                                    <span className="font-medium w-32">Status:</span>
                                    <span className="capitalize">{order.status}</span>
                                  </div>
                                  <div className="flex">
                                    <span className="font-medium w-32">Project Type:</span>
                                    <span>{order.projectType}</span>
                                  </div>
                                  <div className="flex">
                                    <span className="font-medium w-32">Square Footage:</span>
                                    <span>{order.squareFootage} sq ft</span>
                                  </div>
                                  <div className="flex">
                                    <span className="font-medium w-32">Additional Services:</span>
                                    <span>
                                      {order.additionalServices.sitePlan ? 'Site Plan, ' : ''}
                                      {order.additionalServices.materialList ? 'Material List, ' : ''}
                                      {order.additionalServices.render3D ? '3D Rendering' : ''}
                                      {!order.additionalServices.sitePlan && 
                                       !order.additionalServices.materialList && 
                                       !order.additionalServices.render3D && 'None'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClientOrders; 