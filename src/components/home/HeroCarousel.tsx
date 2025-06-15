
import React, { useState, useEffect, memo, useCallback } from 'react';
import { CarouselImage, subscribeToCarouselImages } from '@/services/carouselService';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

// Fallback images for when Firebase data isn't available
const fallbackImages: CarouselImage[] = [
  {
    id: 'fallback-1',
    src: '/lovable-uploads/66619c27-f30e-4e6c-b1c7-0f5ad695cee0.png',
    alt: 'Modern deck design',
    caption: 'Modern deck with built-in lighting',
    active: true,
    displayOrder: 0
  },
  {
    id: 'fallback-2',
    src: '/lovable-uploads/dd2d3de4-09ef-4eb5-a833-36fb407ca0ad.png',
    alt: 'Wooden deck with pergola',
    caption: 'Wooden deck with overhead pergola',
    active: true,
    displayOrder: 1
  },
  {
    id: 'fallback-3',
    src: '/lovable-uploads/741fe312-9ad4-4de6-833f-cb39ab80875c.png',
    alt: 'Custom patio design',
    caption: 'Custom stone patio with firepit',
    active: true,
    displayOrder: 2
  },
  {
    id: 'fallback-4',
    src: '/lovable-uploads/3a843a1c-f661-483d-8811-7db962bc1ae3.png',
    alt: 'Elevated deck with railing',
    caption: 'Elevated deck with glass railing',
    active: true,
    displayOrder: 3
  }
];

export const HeroCarousel: React.FC = memo(() => {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [firebaseError, setFirebaseError] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    
    try {
      // Try to subscribe to Firebase data
      unsubscribe = subscribeToCarouselImages((allImages) => {
        const activeImages = allImages.filter(img => img.active);
        if (activeImages.length > 0) {
          setImages(activeImages);
          setFirebaseError(false);
        } else {
          // If no active images, use fallback
          setImages(fallbackImages);
        }
        setIsLoading(false);
      });
    } catch (error) {
      console.log('Firebase not available for carousel, using fallback images');
      setFirebaseError(true);
      setImages(fallbackImages);
      setIsLoading(false);
    }

    // Fallback timeout - if Firebase doesn't respond in 2 seconds, use fallback
    const fallbackTimeout = setTimeout(() => {
      if (isLoading) {
        console.log('Firebase timeout, using fallback images');
        setImages(fallbackImages);
        setIsLoading(false);
        setFirebaseError(true);
      }
    }, 2000);

    return () => {
      if (unsubscribe) unsubscribe();
      clearTimeout(fallbackTimeout);
    };
  }, [isLoading]);

  // Preload images for smoother transitions
  useEffect(() => {
    if (images.length > 0) {
      const preloadImages = () => {
        images.forEach((image, index) => {
          if (!loadedImages.has(index)) {
            const img = new Image();
            img.onload = () => {
              setLoadedImages(prev => new Set([...prev, index]));
            };
            img.onerror = () => {
              console.log(`Failed to load image: ${image.src}`);
            };
            img.src = image.src;
          }
        });
      };

      preloadImages();
    }
  }, [images, loadedImages]);

  useEffect(() => {
    if (images.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(timer);
    }
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  if (isLoading) {
    return (
      <Skeleton className="w-full h-[400px]" />
    );
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-[400px] overflow-hidden">
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={cn(
              'absolute inset-0 transition-opacity duration-500',
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            )}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h2 className="text-3xl font-bold mb-3">{image.alt}</h2>
                <p className="text-lg">{image.caption}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
        onClick={goToNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={cn(
              'w-2 h-2 rounded-full transition-colors',
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            )}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
});

HeroCarousel.displayName = 'HeroCarousel';
