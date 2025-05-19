import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Package, ListChecks, CheckCircle, Edit, Trash2, Navigation, Home } from 'lucide-react';
import { Service } from '@/services/servicesService';
import { Badge } from '@/components/ui/badge';

interface ServiceCardProps {
  service: Service;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
  onToggleNavigation: () => void;
  onToggleHomepage: () => void;
}

const ServiceCard = ({ 
  service, 
  onEdit, 
  onDelete, 
  onToggleActive,
  onToggleNavigation,
  onToggleHomepage
}: ServiceCardProps) => {
  // Add default values for potentially undefined properties
  const {
    title = 'Untitled Service',
    shortDescription = '',
    description = '',
    active = false,
    showInNavigation = false,
    showOnHomepage = false,
    image = '',
    basePrice = 0,
    features = []
  } = service || {};

  return (
    <Card className={active ? '' : 'opacity-60'}>
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
          {title}
          {!active && (
            <span className="ml-2 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
              Inactive
            </span>
          )}
        </CardTitle>
        <CardDescription>{shortDescription}</CardDescription>
        <div className="flex gap-1 mt-2">
          {active && showInNavigation && (
            <Badge variant="outline" className="flex items-center gap-1 text-xs">
              <Navigation className="h-3 w-3" />
              Navigation
            </Badge>
          )}
          {active && showOnHomepage && (
            <Badge variant="outline" className="flex items-center gap-1 text-xs">
              <Home className="h-3 w-3" />
              Homepage
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-40 mb-4 bg-muted rounded-md overflow-hidden">
          {image ? (
            <img 
              src={image} 
              alt={title} 
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
            {basePrice}
          </div>
          <div className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </div>
          <div>
            <h4 className="text-sm font-medium flex items-center">
              <ListChecks className="h-4 w-4 mr-1" />
              <span>Key Features ({features.length})</span>
            </h4>
            <ul className="mt-1 space-y-1">
              {features.slice(0, 3).map((feature: string, index: number) => (
                <li key={index} className="text-sm flex items-start">
                  <CheckCircle className="h-3 w-3 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span className="line-clamp-1">{feature}</span>
                </li>
              ))}
              {features.length > 3 && (
                <li className="text-xs text-muted-foreground">
                  +{features.length - 3} more features
                </li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full space-y-2">
          <div className="flex justify-between">
            <Button size="sm" variant="outline" onClick={onEdit}>
              Edit Details
            </Button>
            <Button 
              size="sm" 
              variant={active ? "ghost" : "default"}
              onClick={onToggleActive}
            >
              {active ? 'Deactivate' : 'Activate'}
            </Button>
          </div>
          {active && (
            <div className="flex justify-between gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={onToggleNavigation}
              >
                <Navigation className="h-3 w-3 mr-1" />
                {showInNavigation ? 'Hide from Nav' : 'Show in Nav'}
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={onToggleHomepage}
              >
                <Home className="h-3 w-3 mr-1" />
                {showOnHomepage ? 'Hide from Home' : 'Show on Home'}
              </Button>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
