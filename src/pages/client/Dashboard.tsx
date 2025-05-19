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
  Menu
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
import { cn } from '@/lib/utils';
import { getUserOrders, Order } from '@/services/orderService';

const ClientDashboard = () => {
  const { currentUser, signOut } = useFirebase();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user orders from Firestore
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

  const navigation = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Orders', icon: ShoppingCart },
    { name: 'Documents', icon: FileText },
    { name: 'Messages', icon: MessageSquare },
    { name: 'Settings', icon: Settings },
  ];

  // Use real order data
  const recentOrders = orders.slice(0, 3).map(order => ({
    id: order.id.substring(0, 8),
    name: `${order.projectType} Project`,
    status: order.status,
    date: order.createdAt.toLocaleDateString(),
    amount: `$${order.totalPrice}`
  }));

  const activeServices = [
    { id: 'SRV-001', name: 'Deck Maintenance Plan', nextService: '2023-08-15', status: 'Active' },
    { id: 'SRV-002', name: 'Garden Design Consultation', nextService: '2023-07-25', status: 'Pending' },
  ];

  const recentMessages = [
    { id: 'MSG-001', subject: 'Deck Installation Update', date: '2023-06-18', isUnread: true },
    { id: 'MSG-002', subject: 'Quote Request Response', date: '2023-06-15', isUnread: false },
  ];

  const renderContent = () => {
    switch (activeTab.toLowerCase()) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your latest project orders</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map(order => (
                      <div key={order.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{order.name}</p>
                          <p className="text-sm text-muted-foreground">{order.date}</p>
                        </div>
                        <span className="text-sm font-medium">{order.amount}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>No orders yet</p>
                    <Button variant="link" onClick={() => navigate('/order')} className="mt-2">
                      Start your first project
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" onClick={() => setActiveTab('orders')}>
                  View All Orders <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Services</CardTitle>
                <CardDescription>Your ongoing services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeServices.map(service => (
                    <div key={service.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">Next: {service.nextService}</p>
                      </div>
                      <span className="text-sm font-medium">{service.status}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" onClick={() => setActiveTab('documents')}>
                  Manage Services <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Messages</CardTitle>
                <CardDescription>Latest communications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMessages.map(message => (
                    <div key={message.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{message.subject}</p>
                        <p className="text-sm text-muted-foreground">{message.date}</p>
                      </div>
                      {message.isUnread && (
                        <span className="h-2 w-2 bg-primary rounded-full"></span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" onClick={() => setActiveTab('messages')}>
                  View All Messages <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        );
      case 'orders':
        return (
          <Card>
            <CardHeader>
              <CardTitle>All Orders</CardTitle>
              <CardDescription>View and manage all your orders</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{order.projectType} Project</p>
                        <p className="text-sm text-muted-foreground">{order.createdAt.toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.totalPrice}</p>
                        <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p>No orders yet</p>
                  <Button variant="link" onClick={() => navigate('/order')} className="mt-2">
                    Start your first project
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      case 'documents':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Documents & Services</CardTitle>
              <CardDescription>Access your documents and manage services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeServices.map(service => (
                  <div key={service.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">Next Service: {service.nextService}</p>
                    </div>
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary">
                      {service.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      case 'messages':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>Your communication history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMessages.map(message => (
                  <div key={message.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{message.subject}</p>
                      <p className="text-sm text-muted-foreground">{message.date}</p>
                    </div>
                    {message.isUnread && (
                      <span className="px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary">
                        New
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      case 'settings':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold">
                    {currentUser?.displayName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-medium">{currentUser?.displayName || 'User'}</p>
                    <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-20">
        <div className="flex h-[calc(100vh-5rem)]">
          <div className="hidden lg:flex w-64 flex-col fixed left-0 top-20 h-[calc(100vh-5rem)] border-r bg-background">
            <div className="flex-1 py-4">
              <nav className="space-y-1 px-2">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    className={cn(
                      "flex items-center w-full px-4 py-2 text-sm font-medium rounded-md",
                      activeTab === item.name.toLowerCase()
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                    onClick={() => setActiveTab(item.name.toLowerCase())}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="lg:hidden absolute left-4 top-4">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex-1 py-4">
                <nav className="space-y-1 px-2">
                  {navigation.map((item) => (
                    <button
                      key={item.name}
                      className={cn(
                        "flex items-center w-full px-4 py-2 text-sm font-medium rounded-md",
                        activeTab === item.name.toLowerCase()
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                      onClick={() => {
                        setActiveTab(item.name.toLowerCase());
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </button>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex-1 lg:pl-64">
            <header className="bg-background border-b sticky top-20 z-10">
              <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold">Client Dashboard</h1>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="relative p-2 rounded-full hover:bg-muted">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
                  </button>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                      {currentUser?.displayName?.charAt(0) || 'U'}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleSignOut}
                    title="Sign Out"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </header>

            <main className="container mx-auto px-4 py-8">
              {renderContent()}
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ClientDashboard;

