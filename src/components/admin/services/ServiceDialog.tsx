import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { DollarSign, CheckCircle, Trash2, ChevronUp, ChevronDown, Loader2, Tag } from 'lucide-react';
import { Service } from '@/services/servicesService';
import { ImageSelector } from '../shared/ImageSelector';

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
    
    let updatedService = {
      ...currentService,
      [field]: value
    };

    // Auto-generate link when title changes for new services
    if (field === 'title' && typeof value === 'string' && !isEditing) {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      updatedService.link = `/services/${slug}`;
    }
    
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
            {isEditing ? 'Update service details below.' : 'Enter the details for the new service. A page will be automatically generated.'}
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
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="basePrice">Base Price ($)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="basePrice" 
                  type="number"
                  className="pl-9"
                  value={currentService?.basePrice || ''} 
                  onChange={(e) => handleInputChange('basePrice', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="regularPrice">Regular Price ($)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="regularPrice" 
                  type="number"
                  className="pl-9"
                  value={currentService?.regularPrice || ''} 
                  onChange={(e) => handleInputChange('regularPrice', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="discountPercentage">Discount Percentage (%)</Label>
            <div className="relative">
              <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                id="discountPercentage" 
                type="number"
                className="pl-9"
                value={currentService?.discountPercentage || ''} 
                onChange={(e) => handleInputChange('discountPercentage', parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="cta">Call to Action Text</Label>
              <Input 
                id="cta" 
                value={currentService?.cta || ''} 
                onChange={(e) => handleInputChange('cta', e.target.value)}
                placeholder="e.g. Get Started"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="link">Service Page Link</Label>
              <Input 
                id="link" 
                value={currentService?.link || ''} 
                onChange={(e) => handleInputChange('link', e.target.value)}
                placeholder="Auto-generated from title"
                disabled={!isEditing}
              />
              {!isEditing && (
                <p className="text-xs text-muted-foreground">
                  The page link will be automatically generated from the service title
                </p>
              )}
            </div>
          </div>
          
          <ImageSelector
            value={currentService?.image || ''}
            onChange={(image) => handleInputChange('image', image)}
            label="Service Image"
            placeholder="Select image from gallery or enter URL"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="showInNavigation"
                checked={currentService?.showInNavigation || false}
                onCheckedChange={(checked) => handleInputChange('showInNavigation', checked)}
              />
              <Label htmlFor="showInNavigation">Show in Navigation</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="showOnHomepage"
                checked={currentService?.showOnHomepage || false}
                onCheckedChange={(checked) => handleInputChange('showOnHomepage', checked)}
              />
              <Label htmlFor="showOnHomepage">Show on Homepage</Label>
            </div>
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
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMoveFeature(index, 'down')}
                        disabled={index === (currentService?.features?.length || 0) - 1}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveFeature(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a new feature"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddFeature}
                  disabled={!newFeature.trim()}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
          
          {/* Display Order */}
          <div className="grid gap-2">
            <Label htmlFor="displayOrder">Display Order</Label>
            <Input
              id="displayOrder"
              type="number"
              min="1"
              value={currentService?.displayOrder || ''}
              onChange={(e) => handleInputChange('displayOrder', parseInt(e.target.value) || 0)}
              placeholder="Enter display order"
            />
            <p className="text-sm text-muted-foreground">
              Lower numbers will be displayed first
            </p>
          </div>
          
          {/* Visibility Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="active">Active Status</Label>
                <p className="text-sm text-muted-foreground">
                  Inactive services won't be visible to customers
                </p>
              </div>
              <Switch
                id="active"
                checked={currentService?.active || false}
                onCheckedChange={(checked) => handleInputChange('active', checked)}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Service'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDialog;
