import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ServiceManager } from './services/ServiceManager';
import { CarouselManager } from './carousel/CarouselManager';
import { LeadsManager } from './leads/LeadsManager';

export const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <Tabs defaultValue="services" className="space-y-4">
        <TabsList>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="carousel">Hero Carousel</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
        </TabsList>
        <TabsContent value="services">
          <ServiceManager />
        </TabsContent>
        <TabsContent value="carousel">
          <CarouselManager />
        </TabsContent>
        <TabsContent value="leads">
          <LeadsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}; 