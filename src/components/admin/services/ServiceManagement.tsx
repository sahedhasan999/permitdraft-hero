import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCcw } from 'lucide-react';
import { Service, subscribeToServices, addService, updateService, deleteService, getServices } from '@/services/servicesService';
import ServiceFilter from './ServiceFilter';
import ServiceDialog from './ServiceDialog';
import DeleteServiceDialog from './DeleteServiceDialog';
import SeedServices from './SeedServices';

const ServiceManagement = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentService, setCurrentService] = useState<Partial<Service> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { toast } = useToast();

  // Function to manually fetch services for debugging
  const fetchServicesManually = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await getServices();
      setServices(data);
      toast({
        title: "Services fetched",
        description: `Found ${data.length} services in the database.`,
      });
    } catch (error) {
      console.error("Error fetching services:", error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      setErrorMessage(errorMsg);
      toast({
        title: "Error fetching services",
        description: "There was a problem loading the services.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Subscribe to real-time updates from Firestore
    setErrorMessage('');
    
    let unsubscribe: () => void;
    
    try {
      unsubscribe = subscribeToServices(
        (updatedServices) => {
          try {
            // Ensure services is always an array, even if undefined is returned
            const safeServices = Array.isArray(updatedServices) ? updatedServices : [];
            setServices(safeServices);
          } catch (err) {
            console.error("Error processing services update:", err);
            // Set services to empty array to prevent undefined errors
            setServices([]);
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          console.error("Error in subscription:", error);
          const errorMsg = error?.message || 'Unknown error occurred';
          setErrorMessage(errorMsg);
          
          toast({
            title: "Error fetching services",
            description: "There was a problem loading the services.",
            variant: "destructive",
          });
          setIsLoading(false);
          // Set services to empty array to prevent undefined errors
          setServices([]);
        }
      );
    } catch (error) {
      console.error("Error setting up subscription:", error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      setErrorMessage(errorMsg);
      setIsLoading(false);
      // Set services to empty array to prevent undefined errors
      setServices([]);
      
      // Set a default unsubscribe function
      unsubscribe = () => {};
      
      // Throw the error to be caught by the ErrorBoundary
      throw error;
    }

    // Cleanup subscription on component unmount
    return () => {
      try {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      } catch (error) {
        console.error("Error unsubscribing:", error);
      }
    };
  }, [toast]);

  useEffect(() => {
    // Add event listener for the custom event to update currentService
    const handleUpdateService = (e: CustomEvent) => {
      try {
        setCurrentService(e.detail);
      } catch (error) {
        console.error("Error updating current service:", error);
      }
    };

    window.addEventListener('updateCurrentService', handleUpdateService as EventListener);

    return () => {
      window.removeEventListener('updateCurrentService', handleUpdateService as EventListener);
    };
  }, []);

  const handleAddService = () => {
    try {
      setCurrentService({
        title: '',
        description: '',
        shortDescription: '',
        category: 'Outdoor',
        basePrice: 0,
        regularPrice: 0,
        discountPercentage: 0,
        features: [],
        active: true,
        image: '',
        cta: 'Get Started',
        link: '', // Will be auto-generated from title
        displayOrder: services.length + 1,
        showInNavigation: true,
        showOnHomepage: true
      });
      setIsEditing(false);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error in handleAddService:", error);
      toast({
        title: "Error",
        description: "There was a problem preparing the new service form.",
        variant: "destructive",
      });
    }
  };

  const handleEditService = (service: Service) => {
    try {
      setCurrentService({ ...service });
      setIsEditing(true);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error in handleEditService:", error);
      toast({
        title: "Error",
        description: "There was a problem preparing the edit form.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePrompt = (service: Service) => {
    try {
      setCurrentService(service);
      setIsDeleteDialogOpen(true);
    } catch (error) {
      console.error("Error in handleDeletePrompt:", error);
      toast({
        title: "Error",
        description: "There was a problem preparing the delete dialog.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteService = async () => {
    if (!currentService?.id) return;
    
    try {
      await deleteService(currentService.id);
      toast({
        title: "Service deleted",
        description: "The service has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting service:", error);
      toast({
        title: "Error deleting service",
        description: "There was a problem deleting the service.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSaveService = async () => {
    if (!currentService) return;
    
    // Validate required fields
    if (!currentService.title || !currentService.description || !currentService.shortDescription) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      if (isEditing && currentService.id) {
        // Update existing service
        const { id, ...serviceData } = currentService as Service;
        
        // Ensure regularPrice is set if not provided
        if (!serviceData.regularPrice && serviceData.basePrice) {
          serviceData.regularPrice = serviceData.basePrice;
        }
        
        // Calculate discounted price if not already set
        if (serviceData.regularPrice && serviceData.discountPercentage) {
          serviceData.basePrice = serviceData.regularPrice - (serviceData.regularPrice * (serviceData.discountPercentage / 100));
        }
        
        await updateService(id, serviceData);
        toast({
          title: "Service updated",
          description: "The service has been successfully updated.",
        });
      } else {
        // Add new service
        const serviceData = currentService as Omit<Service, 'id'>;
        
        // Auto-generate link if not set
        if (!serviceData.link && serviceData.title) {
          const slug = serviceData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          serviceData.link = `/services/${slug}`;
        }
        
        // Ensure regularPrice is set if not provided
        if (!serviceData.regularPrice && serviceData.basePrice) {
          serviceData.regularPrice = serviceData.basePrice;
        }
        
        // Calculate discounted price if not already set
        if (serviceData.regularPrice && serviceData.discountPercentage) {
          serviceData.basePrice = serviceData.regularPrice - (serviceData.regularPrice * (serviceData.discountPercentage / 100));
        }
        
        // Ensure CTA and link are set
        if (!serviceData.cta) {
          serviceData.cta = 'Get Started';
        }
        
        // Set display order if not provided
        if (!serviceData.displayOrder) {
          serviceData.displayOrder = services.length + 1;
        }
        
        await addService(serviceData);
        toast({
          title: "Service created",
          description: `The new service has been created with a page at ${serviceData.link}`,
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving service:", error);
      toast({
        title: "Error saving service",
        description: "There was a problem saving the service.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (service: Service) => {
    try {
      await updateService(service.id, { active: !service.active });
      toast({
        title: `Service ${service.active ? 'deactivated' : 'activated'}`,
        description: `"${service.title}" is now ${service.active ? 'inactive' : 'active'}.`,
      });
    } catch (error) {
      console.error("Error toggling active state:", error);
      toast({
        title: "Error updating service",
        description: "There was a problem updating the service status.",
        variant: "destructive",
      });
    }
  };

  const handleToggleNavigation = async (service: Service) => {
    try {
      await updateService(service.id, { showInNavigation: !service.showInNavigation });
      toast({
        title: `Navigation visibility updated`,
        description: `"${service.title}" ${!service.showInNavigation ? 'will now' : 'will no longer'} appear in navigation.`,
      });
    } catch (error) {
      console.error("Error toggling navigation visibility:", error);
      toast({
        title: "Error updating service",
        description: "There was a problem updating the service navigation visibility.",
        variant: "destructive",
      });
    }
  };

  const handleToggleHomepage = async (service: Service) => {
    try {
      await updateService(service.id, { showOnHomepage: !service.showOnHomepage });
      toast({
        title: `Homepage visibility updated`,
        description: `"${service.title}" ${!service.showOnHomepage ? 'will now' : 'will no longer'} appear on homepage.`,
      });
    } catch (error) {
      console.error("Error toggling homepage visibility:", error);
      toast({
        title: "Error updating service",
        description: "There was a problem updating the service homepage visibility.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Service Management</h1>
          <p className="text-muted-foreground mt-1">
            Add, edit, and manage service offerings
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchServicesManually} variant="outline">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh Services
          </Button>
          <Button onClick={handleAddService}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Service
          </Button>
        </div>
      </div>

      {/* Show seed services component if no services are found and not loading */}
      {!isLoading && services.length === 0 && (
        <SeedServices errorMessage={errorMessage} />
      )}

      <ServiceFilter 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        services={services}
        isLoading={isLoading}
        onEdit={handleEditService}
        onDelete={handleDeletePrompt}
        onToggleActive={handleToggleActive}
        onToggleNavigation={handleToggleNavigation}
        onToggleHomepage={handleToggleHomepage}
      />

      <ServiceDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        currentService={currentService}
        isEditing={isEditing}
        isSaving={isSaving}
        onSave={handleSaveService}
      />

      <DeleteServiceDialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        service={currentService}
        onConfirm={handleDeleteService}
      />
    </div>
  );
};

export default ServiceManagement;
