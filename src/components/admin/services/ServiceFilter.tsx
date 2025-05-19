import React from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Loader2, Package } from 'lucide-react';
import { Service } from '@/services/servicesService';
import ServiceCard from './ServiceCard';

interface ServiceFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  services: Service[];
  isLoading: boolean;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  onToggleActive: (service: Service) => void;
  onToggleNavigation: (service: Service) => void;
  onToggleHomepage: (service: Service) => void;
}

const ServiceFilter = ({
  searchTerm,
  setSearchTerm,
  activeTab,
  setActiveTab,
  services,
  isLoading,
  onEdit,
  onDelete,
  onToggleActive,
  onToggleNavigation,
  onToggleHomepage
}: ServiceFilterProps) => {
  const filteredServices = services.filter(service => {
    const title = service?.title || '';
    const description = service?.description || '';
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    const matchesSearch = 
      title.toLowerCase().includes(lowerSearchTerm) || 
      description.toLowerCase().includes(lowerSearchTerm);
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'active') return matchesSearch && service.active;
    if (activeTab === 'inactive') return matchesSearch && !service.active;
    if (activeTab === 'navigation') return matchesSearch && service.active && service.showInNavigation;
    if (activeTab === 'homepage') return matchesSearch && service.active && service.showOnHomepage;
    
    return matchesSearch;
  });

  return (
    <>
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            className="pl-9" 
            placeholder="Search services..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 md:w-auto md:inline-flex">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="homepage">Homepage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4 mt-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onEdit={() => onEdit(service)}
                  onDelete={() => onDelete(service)}
                  onToggleActive={() => onToggleActive(service)}
                  onToggleNavigation={() => onToggleNavigation(service)}
                  onToggleHomepage={() => onToggleHomepage(service)}
                />
              ))}
            </div>
          )}
          
          {!isLoading && filteredServices.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-medium">No services found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting your search or create a new service
              </p>
            </div>
          )}
        </TabsContent>
        
        {/* Active tab content */}
        <TabsContent value="active" className="space-y-4 mt-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices
                .filter(service => service.active)
                .map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onEdit={() => onEdit(service)}
                    onDelete={() => onDelete(service)}
                    onToggleActive={() => onToggleActive(service)}
                    onToggleNavigation={() => onToggleNavigation(service)}
                    onToggleHomepage={() => onToggleHomepage(service)}
                  />
                ))
              }
            </div>
          )}
          
          {!isLoading && filteredServices.filter(s => s.active).length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-medium">No active services found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting your search or create a new service
              </p>
            </div>
          )}
        </TabsContent>
        
        {/* Inactive tab content */}
        <TabsContent value="inactive" className="space-y-4 mt-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices
                .filter(service => !service.active)
                .map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onEdit={() => onEdit(service)}
                    onDelete={() => onDelete(service)}
                    onToggleActive={() => onToggleActive(service)}
                    onToggleNavigation={() => onToggleNavigation(service)}
                    onToggleHomepage={() => onToggleHomepage(service)}
                  />
                ))
              }
            </div>
          )}
          
          {!isLoading && filteredServices.filter(s => !s.active).length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-medium">No inactive services found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                All your services are currently active
              </p>
            </div>
          )}
        </TabsContent>
        
        {/* Navigation tab content */}
        <TabsContent value="navigation" className="space-y-4 mt-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices
                .filter(service => service.active && service.showInNavigation)
                .map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onEdit={() => onEdit(service)}
                    onDelete={() => onDelete(service)}
                    onToggleActive={() => onToggleActive(service)}
                    onToggleNavigation={() => onToggleNavigation(service)}
                    onToggleHomepage={() => onToggleHomepage(service)}
                  />
                ))
              }
            </div>
          )}
          
          {!isLoading && filteredServices.filter(s => s.active && s.showInNavigation).length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-medium">No navigation services found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No services are currently set to appear in navigation
              </p>
            </div>
          )}
        </TabsContent>
        
        {/* Homepage tab content */}
        <TabsContent value="homepage" className="space-y-4 mt-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices
                .filter(service => service.active && service.showOnHomepage)
                .map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onEdit={() => onEdit(service)}
                    onDelete={() => onDelete(service)}
                    onToggleActive={() => onToggleActive(service)}
                    onToggleNavigation={() => onToggleNavigation(service)}
                    onToggleHomepage={() => onToggleHomepage(service)}
                  />
                ))
              }
            </div>
          )}
          
          {!isLoading && filteredServices.filter(s => s.active && s.showOnHomepage).length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-medium">No homepage services found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No services are currently set to appear on the homepage
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default ServiceFilter;
