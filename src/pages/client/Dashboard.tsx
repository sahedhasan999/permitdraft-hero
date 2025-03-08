
import React, { useState } from 'react';
import { useFirebase } from '@/contexts/FirebaseContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  Package, 
  MessageSquare, 
  User, 
  CreditCard, 
  Star, 
  Settings, 
  LogOut,
  Bell,
  ShoppingCart,
  ClipboardList,
  Calendar,
  RefreshCw,
  FileText,
  ChevronRight
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

const ClientDashboard = () => {
  const { currentUser, signOut } = useFirebase();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been successfully logged out of your account."
      });
      navigate('/admin/login');
    } catch (error) {
      toast({
        title: "Error signing out",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };

  // Mock data for demonstration
  const recentOrders = [
    { id: 'ORD-1234', name: 'Deck Installation', status: 'In Progress', date: '2023-06-15', amount: '$2,500' },
    { id: 'ORD-1235', name: 'Outdoor Kitchen Design', status: 'Completed', date: '2023-05-20', amount: '$3,800' },
    { id: 'ORD-1236', name: 'Patio Extension', status: 'Scheduled', date: '2023-07-10', amount: '$1,750' },
  ];

  const activeServices = [
    { id: 'SRV-001', name: 'Deck Maintenance Plan', nextService: '2023-08-15', status: 'Active' },
    { id: 'SRV-002', name: 'Garden Design Consultation', nextService: '2023-07-25', status: 'Pending' },
  ];

  const recentMessages = [
    { id: 'MSG-001', subject: 'Deck Installation Update', date: '2023-06-18', isUnread: true },
    { id: 'MSG-002', subject: 'Quote Request Response', date: '2023-06-15', isUnread: false },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b sticky top-0 z-10">
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
              <span className="hidden md:inline text-sm font-medium">
                {currentUser?.displayName || 'User'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-1/4 lg:w-1/5 space-y-2">
          <Button 
            variant={activeTab === 'overview' ? 'default' : 'ghost'} 
            className="w-full justify-start"
            onClick={() => setActiveTab('overview')}
          >
            <Package className="mr-2 h-4 w-4" />
            Overview
          </Button>
          <Button 
            variant={activeTab === 'orders' ? 'default' : 'ghost'} 
            className="w-full justify-start"
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Orders
          </Button>
          <Button 
            variant={activeTab === 'services' ? 'default' : 'ghost'} 
            className="w-full justify-start"
            onClick={() => setActiveTab('services')}
          >
            <ClipboardList className="mr-2 h-4 w-4" />
            Services
          </Button>
          <Button 
            variant={activeTab === 'communication' ? 'default' : 'ghost'} 
            className="w-full justify-start"
            onClick={() => setActiveTab('communication')}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Messages
          </Button>
          <Button 
            variant={activeTab === 'feedback' ? 'default' : 'ghost'} 
            className="w-full justify-start"
            onClick={() => setActiveTab('feedback')}
          >
            <Star className="mr-2 h-4 w-4" />
            Feedback
          </Button>
          <Button 
            variant={activeTab === 'profile' ? 'default' : 'ghost'} 
            className="w-full justify-start"
            onClick={() => setActiveTab('profile')}
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
          <Button 
            variant={activeTab === 'billing' ? 'default' : 'ghost'} 
            className="w-full justify-start"
            onClick={() => setActiveTab('billing')}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </Button>
          <Button 
            variant={activeTab === 'settings' ? 'default' : 'ghost'} 
            className="w-full justify-start"
            onClick={() => setActiveTab('settings')}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </aside>

        <main className="flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">Welcome back, {currentUser?.displayName || 'User'}!</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                    <CardDescription>
                      <span className="text-2xl font-bold">2</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">+5% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Active Services</CardTitle>
                    <CardDescription>
                      <span className="text-2xl font-bold">3</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">No change from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                    <CardDescription>
                      <span className="text-2xl font-bold">1</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">2 new since yesterday</p>
                  </CardContent>
                </Card>
              </div>

              <h3 className="text-xl font-semibold mt-8">Recent Orders</h3>
              <div className="space-y-4">
                {recentOrders.map(order => (
                  <Card key={order.id} className="overflow-hidden">
                    <div className={`h-1 ${
                      order.status === 'Completed' ? 'bg-green-500' : 
                      order.status === 'In Progress' ? 'bg-blue-500' : 'bg-orange-500'
                    }`}></div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{order.name}</h4>
                          <p className="text-sm text-muted-foreground">{order.id} • {order.date}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                            order.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                          }`}>
                            {order.status}
                          </span>
                          <p className="text-sm font-semibold mt-1">{order.amount}</p>
                        </div>
                      </div>
                      <Button variant="link" className="pl-0 mt-2 h-auto p-0 text-primary">
                        View Details <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Active Services</h3>
                  {activeServices.map(service => (
                    <Card key={service.id} className="mb-4">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold">{service.name}</h4>
                            <div className="flex items-center mt-1">
                              <Calendar className="h-3 w-3 text-muted-foreground mr-1" />
                              <p className="text-xs text-muted-foreground">Next service: {service.nextService}</p>
                            </div>
                          </div>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            service.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {service.status}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Recent Messages</h3>
                  {recentMessages.map(message => (
                    <Card key={message.id} className="mb-4">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-start space-x-2">
                            {message.isUnread && (
                              <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                            )}
                            <div>
                              <h4 className={`font-semibold ${message.isUnread ? '' : 'text-muted-foreground'}`}>{message.subject}</h4>
                              <p className="text-xs text-muted-foreground">{message.date}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button variant="outline" className="w-full">
                    View All Messages
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Orders</h2>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Orders</CardTitle>
                    <CardDescription>Track and manage all your orders in one place</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* For brevity, just showing a message */}
                      <p className="text-center text-muted-foreground py-8">
                        Order tracking functionality would be implemented here with filtering options,
                        detailed order views, and action buttons.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {(activeTab === 'services' || activeTab === 'communication' || 
            activeTab === 'feedback' || activeTab === 'profile' || 
            activeTab === 'billing' || activeTab === 'settings') && (
            <div>
              <h2 className="text-2xl font-bold mb-6">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
              <Card>
                <CardHeader>
                  <CardTitle>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Center</CardTitle>
                  <CardDescription>This section is under development</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-12">
                  <RefreshCw className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-2">
                    This feature is coming soon. Check back later for updates.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    We're working hard to bring you the best experience possible.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;
