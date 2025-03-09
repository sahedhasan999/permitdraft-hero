
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Service, getServices, addService, updateService, deleteService } from '@/services/servicesService';
import ServiceFilter from './ServiceFilter';
import ServiceDialog from './ServiceDialog';
import DeleteServiceDialog from './DeleteServiceDialog';

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
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    // Add event listener for the custom event to update currentService
    const handleUpdateService = (e: CustomEvent) => {
      setCurrentService(e.detail);
    };

    window.addEventListener('updateCurrentService', handleUpdateService as EventListener);

    return () => {
      window.removeEventListener('updateCurrentService', handleUpdateService as EventListener);
    };
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      toast({
        title: "Error fetching services",
        description: "There was a problem loading the services.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddService = () => {
    setCurrentService({
      title: '',
      description: '',
      shortDescription: '',
      category: 'Outdoor',
      basePrice: 0,
      features: [],
      active: true,
      image: ''
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEditService = (service: Service) => {
    setCurrentService({ ...service });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDeletePrompt = (service: Service) => {
    setCurrentService(service);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteService = async () => {
    if (!currentService?.id) return;
    
    try {
      await deleteService(currentService.id);
      setServices(services.filter(s => s.id !== currentService.id));
      toast({
        title: "Service deleted",
        description: "The service has been successfully deleted.",
      });
    } catch (error) {
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
        await updateService(id, serviceData);
        setServices(services.map(s => s.id === id ? { ...serviceData, id } as Service : s));
        toast({
          title: "Service updated",
          description: "The service has been successfully updated.",
        });
      } else {
        // Add new service
        const serviceData = currentService as Omit<Service, 'id'>;
        const id = await addService(serviceData);
        setServices([...services, { ...serviceData, id }]);
        toast({
          title: "Service created",
          description: "The new service has been successfully created.",
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
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
      setServices(services.map(s => {
        if (s.id === service.id) {
          return { ...s, active: !s.active };
        }
        return s;
      }));
      toast({
        title: `Service ${service.active ? 'deactivated' : 'activated'}`,
        description: `"${service.title}" is now ${service.active ? 'inactive' : 'active'}.`,
      });
    } catch (error) {
      toast({
        title: "Error updating service",
        description: "There was a problem updating the service status.",
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
        <Button onClick={handleAddService}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Service
        </Button>
      </div>

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
