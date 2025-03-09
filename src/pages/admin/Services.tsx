
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { PlusCircle, Edit, Trash2, CheckCircle, Search, DollarSign, Package, ListChecks, ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import { Service, getServices, addService, updateService, deleteService } from '@/services/servicesService';

const ServiceManagement = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentService, setCurrentService] = useState<Partial<Service> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [newFeature, setNewFeature] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
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

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'active') return matchesSearch && service.active;
    if (activeTab === 'inactive') return matchesSearch && !service.active;
    
    return matchesSearch;
  });

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

  const handleAddFeature = () => {
    if (newFeature.trim() && currentService) {
      setCurrentService({
        ...currentService,
        features: [...(currentService.features || []), newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    if (!currentService) return;
    setCurrentService({
      ...currentService,
      features: currentService.features?.filter((_, i) => i !== index) || []
    });
  };

  const handleMoveFeature = (index: number, direction: 'up' | 'down') => {
    if (!currentService || !currentService.features) return;
    
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === currentService.features.length - 1)) {
      return;
    }

    const newFeatures = [...currentService.features];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newFeatures[index], newFeatures[newIndex]] = [newFeatures[newIndex], newFeatures[index]];
    
    setCurrentService({
      ...currentService,
      features: newFeatures
    });
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
    <AdminLayout>
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

        <div className="flex items-center space-x-4">
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
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
            <TabsTrigger value="all">All Services</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
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
                    onEdit={() => handleEditService(service)}
                    onDelete={() => handleDeletePrompt(service)}
                    onToggleActive={() => handleToggleActive(service)}
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
                      onEdit={() => handleEditService(service)}
                      onDelete={() => handleDeletePrompt(service)}
                      onToggleActive={() => handleToggleActive(service)}
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
                      onEdit={() => handleEditService(service)}
                      onDelete={() => handleDeletePrompt(service)}
                      onToggleActive={() => handleToggleActive(service)}
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
        </Tabs>
      </div>

      {/* Edit/Add Service Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Service' : 'Add New Service'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update service details below.' : 'Enter the details for the new service.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Service Title</Label>
                <Input 
                  id="title" 
                  value={currentService?.title || ''} 
                  onChange={(e) => setCurrentService({...currentService, title: e.target.value})}
                  placeholder="e.g. Deck Design"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input 
                  id="category" 
                  value={currentService?.category || ''} 
                  onChange={(e) => setCurrentService({...currentService, category: e.target.value})}
                  placeholder="e.g. Outdoor"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="shortDescription">Short Description (displayed in cards)</Label>
              <Input 
                id="shortDescription" 
                value={currentService?.shortDescription || ''} 
                onChange={(e) => setCurrentService({...currentService, shortDescription: e.target.value})}
                placeholder="Brief description (30-60 characters)"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Full Description</Label>
              <Textarea 
                id="description" 
                rows={3}
                value={currentService?.description || ''} 
                onChange={(e) => setCurrentService({...currentService, description: e.target.value})}
                placeholder="Detailed service description"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="price">Base Price ($)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="price" 
                  type="number"
                  className="pl-9"
                  value={currentService?.basePrice || ''} 
                  onChange={(e) => setCurrentService({...currentService, basePrice: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="image">Image URL</Label>
              <Input 
                id="image" 
                value={currentService?.image || ''} 
                onChange={(e) => setCurrentService({...currentService, image: e.target.value})}
                placeholder="URL of service image"
              />
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="features">Features</Label>
                <div className="text-xs text-muted-foreground">{currentService?.features?.length || 0} items</div>
              </div>
              
              <div className="border rounded-md p-4">
                <div className="space-y-2">
                  {currentService?.features?.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center justify-between group">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMoveFeature(index, 'up')}
                          disabled={index === 0}
                          className="h-8 w-8 p-0"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMoveFeature(index, 'down')}
                          disabled={index === (currentService.features?.length || 0) - 1}
                          className="h-8 w-8 p-0"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveFeature(index)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {!currentService?.features?.length && (
                  <div className="text-center text-sm text-muted-foreground py-2">
                    No features added yet
                  </div>
                )}
                
                <div className="mt-4 flex space-x-2">
                  <Input
                    placeholder="Add a feature..."
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                  />
                  <Button onClick={handleAddFeature} size="sm">Add</Button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={currentService?.active}
                onCheckedChange={(checked) => 
                  setCurrentService({...currentService, active: checked})
                }
              />
              <Label htmlFor="active">Active (visible to customers)</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSaveService} 
              disabled={!currentService?.title || isSaving}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update' : 'Create'} Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{currentService?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteService}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

const ServiceCard = ({ service, onEdit, onDelete, onToggleActive }: { 
  service: Service; 
  onEdit: () => void; 
  onDelete: () => void; 
  onToggleActive: () => void;
}) => {
  return (
    <Card className={service.active ? '' : 'opacity-60'}>
      <CardHeader className="relative pb-2">
        <div className="absolute right-4 top-4 flex space-x-1">
          <Button size="sm" variant="ghost" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive/90" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <CardTitle className="flex items-center">
          {service.title}
          {!service.active && (
            <span className="ml-2 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
              Inactive
            </span>
          )}
        </CardTitle>
        <CardDescription>{service.shortDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-40 mb-4 bg-muted rounded-md overflow-hidden">
          {service.image ? (
            <img 
              src={service.image} 
              alt={service.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Package className="h-8 w-8" />
            </div>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center text-lg font-semibold">
            <DollarSign className="h-4 w-4 mr-1" />
            {service.basePrice}
          </div>
          <div className="text-sm text-muted-foreground line-clamp-2">
            {service.description}
          </div>
          <div>
            <h4 className="text-sm font-medium flex items-center">
              <ListChecks className="h-4 w-4 mr-1" />
              <span>Key Features ({service.features.length})</span>
            </h4>
            <ul className="mt-1 space-y-1">
              {service.features.slice(0, 3).map((feature: string, index: number) => (
                <li key={index} className="text-sm flex items-start">
                  <CheckCircle className="h-3 w-3 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span className="line-clamp-1">{feature}</span>
                </li>
              ))}
              {service.features.length > 3 && (
                <li className="text-xs text-muted-foreground">
                  +{service.features.length - 3} more features
                </li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex justify-between">
          <Button size="sm" variant="outline" onClick={onEdit}>
            Edit Details
          </Button>
          <Button 
            size="sm" 
            variant={service.active ? "ghost" : "default"}
            onClick={onToggleActive}
          >
            {service.active ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ServiceManagement;
