
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { PortfolioItem } from '@/contexts/PortfolioContext';

interface PortfolioPopupProps {
  item: PortfolioItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PortfolioPopup: React.FC<PortfolioPopupProps> = ({ item, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!item) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + item.images.length) % item.images.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden select-none">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{item.title}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            <span className="inline-block px-3 py-1 text-xs font-semibold bg-teal-100 text-teal-800 rounded-full">
              {item.category}
            </span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Image Gallery */}
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden rounded-lg bg-muted">
              <img 
                src={item.images[currentImageIndex]} 
                alt={`${item.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 pointer-events-none"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
            
            {/* Navigation arrows */}
            {item.images.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
            
            {/* Image counter */}
            {item.images.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                {currentImageIndex + 1} / {item.images.length}
              </div>
            )}
          </div>
          
          {/* Thumbnail navigation */}
          {item.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {item.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                    index === currentImageIndex ? 'border-teal-500' : 'border-transparent'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover pointer-events-none"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </button>
              ))}
            </div>
          )}
          
          {/* Description */}
          <div>
            <p className="text-muted-foreground">{item.description}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
