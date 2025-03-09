
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Package, ListChecks, CheckCircle, Edit, Trash2 } from 'lucide-react';
import { Service } from '@/services/servicesService';

interface ServiceCardProps {
  service: Service;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
}

const ServiceCard = ({ service, onEdit, onDelete, onToggleActive }: ServiceCardProps) => {
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

export default ServiceCard;
