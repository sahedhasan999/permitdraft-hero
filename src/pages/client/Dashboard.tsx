
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useFirebase } from '@/contexts/FirebaseContext';
import { getUserOrders, Order } from '@/services/orderService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Package, DollarSign, Clock, FileText, Phone, Mail, MessageSquare } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ClientMessaging from '@/components/client/messaging/ClientMessaging';

const ClientDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { currentUser } = useFirebase();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Dashboard | PermitDraft Pro";
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) {
        setIsLoading(false);
        return;
      }

      try {
        const userOrders = await getUserOrders(currentUser.uid, currentUser.email);
        setOrders(userOrders);
      } catch (error) {
        console.log('Error fetching orders:', error);
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
  }, [currentUser, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-28 lg:pt-32 pb-24">
          <div className="container px-4 mx-auto">
            <div className="flex justify-center items-center h-full">
              <p>Loading...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 lg:pt-32 pb-24">
        <div className="container px-4 mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Your Dashboard</h1>

          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>
            
            <TabsContent value="orders" className="mt-6">
              {orders.length === 0 ? (
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle>No Orders Yet</CardTitle>
                    <CardDescription>Start a new project to see your orders here.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>You haven't placed any orders yet. Click the button below to get started.</p>
                    <Button asChild className="mt-4">
                      <a href="/order">Start a New Project</a>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {orders.map((order) => (
                    <Card key={order.id}>
                      <CardHeader>
                        <CardTitle>Order #{order.id.substring(0, 8).toUpperCase()}</CardTitle>
                        <CardDescription>
                          <Badge variant="secondary">{order.projectType}</Badge>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{order.createdAt.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4" />
                          <span>{order.squareFootage} sq ft</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4" />
                          <span>${order.totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>Status: {order.status}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="messages" className="mt-6">
              <ClientMessaging />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClientDashboard;
