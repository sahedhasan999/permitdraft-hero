
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Service, getServices } from '@/services/servicesService';
import ServiceLayout from '@/components/services/ServiceLayout';
import NotFound from '@/pages/NotFound';
import { Skeleton } from '@/components/ui/skeleton';

const DynamicService = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      if (!serviceId) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const services = await getServices();
        const foundService = services.find(s => s.id === serviceId || s.title.toLowerCase().replace(/\s+/g, '-') === serviceId);
        
        if (foundService && foundService.active) {
          setService(foundService);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error fetching service:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-28 lg:pt-32 pb-24">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
            <div>
              <Skeleton className="h-12 w-3/4 mb-6" />
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-4 w-5/6 mb-8" />
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            </div>
            <Skeleton className="h-80 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !service) {
    return <NotFound />;
  }

  return (
    <ServiceLayout
      title={service.title}
      description={service.description}
      image={service.image}
      features={service.features}
    >
      {/* Additional service-specific content can be added here */}
      <div className="mt-12">
        <div className="bg-gray-50 rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4">What's Included</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Professional Design</h4>
              <p className="text-muted-foreground">
                Expert architectural drawings that meet local building codes and permit requirements.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Fast Turnaround</h4>
              <p className="text-muted-foreground">
                Quick delivery without compromising on quality or accuracy.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Permit Ready</h4>
              <p className="text-muted-foreground">
                All drawings are designed to meet local building department requirements.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Unlimited Revisions</h4>
              <p className="text-muted-foreground">
                We'll work with you until you're completely satisfied with the design.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ServiceLayout>
  );
};

export default DynamicService;
