
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { DollarSign, CheckCircle, Trash2, ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import { Service } from '@/services/servicesService';

interface ServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentService: Partial<Service> | null;
  isEditing: boolean;
  isSaving: boolean;
  onSave: () => void;
}

const ServiceDialog = ({ 
  isOpen, 
  onClose, 
  currentService, 
  isEditing, 
  isSaving, 
  onSave 
}: ServiceDialogProps) => {
  const [newFeature, setNewFeature] = useState('');

  const handleAddFeature = () => {
    if (newFeature.trim() && currentService) {
      const updatedService = {
        ...currentService,
        features: [...(currentService.features || []), newFeature.trim()]
      };
      
      // This is a prop update in the parent component
      window.dispatchEvent(new CustomEvent('updateCurrentService', { 
        detail: updatedService 
      }));
      
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    if (!currentService) return;
    
    const updatedService = {
      ...currentService,
      features: currentService.features?.filter((_, i) => i !== index) || []
    };
    
    // This is a prop update in the parent component
    window.dispatchEvent(new CustomEvent('updateCurrentService', { 
      detail: updatedService 
    }));
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
    
    const updatedService = {
      ...currentService,
      features: newFeatures
    };
    
    // This is a prop update in the parent component
    window.dispatchEvent(new CustomEvent('updateCurrentService', { 
      detail: updatedService 
    }));
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    if (!currentService) return;
    
    const updatedService = {
      ...currentService,
      [field]: value
    };
    
    // This is a prop update in the parent component
    window.dispatchEvent(new CustomEvent('updateCurrentService', { 
      detail: updatedService 
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g. Deck Design"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Input 
                id="category" 
                value={currentService?.category || ''} 
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="e.g. Outdoor"
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="shortDescription">Short Description (displayed in cards)</Label>
            <Input 
              id="shortDescription" 
              value={currentService?.shortDescription || ''} 
              onChange={(e) => handleInputChange('shortDescription', e.target.value)}
              placeholder="Brief description (30-60 characters)"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Full Description</Label>
            <Textarea 
              id="description" 
              rows={3}
              value={currentService?.description || ''} 
              onChange={(e) => handleInputChange('description', e.target.value)}
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
                onChange={(e) => handleInputChange('basePrice', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="image">Image URL</Label>
            <Input 
              id="image" 
              value={currentService?.image || ''} 
              onChange={(e) => handleInputChange('image', e.target.value)}
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
              onCheckedChange={(checked) => handleInputChange('active', checked)}
            />
            <Label htmlFor="active">Active (visible to customers)</Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={onSave} 
            disabled={!currentService?.title || isSaving}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Update' : 'Create'} Service
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDialog;
