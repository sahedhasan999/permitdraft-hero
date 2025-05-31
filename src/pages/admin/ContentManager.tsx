
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PortfolioManager } from '@/components/admin/portfolio/PortfolioManager';
import { TestimonialsManager } from '@/components/admin/testimonials/TestimonialsManager';
import { CarouselManager } from '@/components/admin/carousel/CarouselManager';

const ContentManager = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Content Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage website content and images
            </p>
          </div>
        </div>

        <Tabs defaultValue="hero-carousel" className="w-full">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="hero-carousel">Hero Carousel</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hero-carousel" className="space-y-6 mt-6">
            <CarouselManager />
          </TabsContent>
          
          <TabsContent value="portfolio" className="pt-4">
            <PortfolioManager />
          </TabsContent>
          
          <TabsContent value="testimonials" className="pt-4">
            <TestimonialsManager />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ContentManager;
