
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import DashboardStats from '@/components/admin/DashboardStats';
import RecentOrders from '@/components/admin/RecentOrders';
import RecentLeads from '@/components/admin/RecentLeads';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.displayName || 'Admin'}
          </p>
        </div>

        {/* Stats Overview */}
        <DashboardStats />

        {/* Main Content Tabs */}
        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="recent">Recent Activity</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent" className="space-y-6 pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentOrders />
              <RecentLeads />
            </div>
          </TabsContent>
          
          <TabsContent value="orders" className="pt-4">
            <iframe src="/admin/orders" className="w-full h-[70vh] border-0" />
          </TabsContent>
          
          <TabsContent value="leads" className="pt-4">
            <iframe src="/admin/leads" className="w-full h-[70vh] border-0" />
          </TabsContent>
          
          <TabsContent value="content" className="pt-4">
            <div className="bg-card border rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4">Content Management</h3>
              <p className="text-muted-foreground mb-6">
                Manage your website content, including carousel images, services, and more.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CarouselManagementCard />
                <ServicesManagementCard />
                <TestimonialsManagementCard />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

// Card components for content management section
const CarouselManagementCard = () => (
  <div className="bg-background border rounded-md p-4 hover:shadow-md transition-shadow">
    <h4 className="font-medium mb-2">Hero Carousel</h4>
    <p className="text-sm text-muted-foreground mb-3">
      Manage images that appear in the homepage carousel
    </p>
    <button className="text-primary text-sm font-medium hover:underline">
      Manage Images →
    </button>
  </div>
);

const ServicesManagementCard = () => (
  <div className="bg-background border rounded-md p-4 hover:shadow-md transition-shadow">
    <h4 className="font-medium mb-2">Services</h4>
    <p className="text-sm text-muted-foreground mb-3">
      Edit service descriptions, pricing and features
    </p>
    <button className="text-primary text-sm font-medium hover:underline">
      Manage Services →
    </button>
  </div>
);

const TestimonialsManagementCard = () => (
  <div className="bg-background border rounded-md p-4 hover:shadow-md transition-shadow">
    <h4 className="font-medium mb-2">Testimonials</h4>
    <p className="text-sm text-muted-foreground mb-3">
      Add or edit customer testimonials
    </p>
    <button className="text-primary text-sm font-medium hover:underline">
      Manage Testimonials →
    </button>
  </div>
);

export default Dashboard;
