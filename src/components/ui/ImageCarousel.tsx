
import React, { useState, useEffect, memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

interface ImageCarouselProps {
  images: string[];
  interval?: number;
  className?: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = memo(({ 
  images, 
  interval = 5000, 
  className 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Preload images efficiently
  useEffect(() => {
    if (images.length === 0) return;
    
    let loadedCount = 0;
    const newLoadedImages = new Set<number>();
    
    const preloadImages = () => {
      images.forEach((src, index) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          newLoadedImages.add(index);
          setLoadedImages(new Set(newLoadedImages));
          
          if (loadedCount === images.length) {
            setImagesLoaded(true);
          }
        };
        img.onerror = () => {
          console.warn(`Failed to load image: ${src}`);
          loadedCount++;
          if (loadedCount === images.length) {
            setImagesLoaded(true);
          }
        };
        img.src = src;
      });
    };

    preloadImages();
  }, [images]);

  useEffect(() => {
    // Only start the interval once images are loaded
    if (!imagesLoaded || images.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval, imagesLoaded]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Touch handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && images.length > 1) {
      goToNext();
    }
    if (isRightSwipe && images.length > 1) {
      goToPrevious();
    }
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div 
      className={`relative overflow-hidden rounded-lg group ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Render first image separately for LCP optimization */}
      {images.length > 0 && (
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentIndex === 0 ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={images[0]}
            alt="Architectural design 1"
            className="rounded-lg shadow-lg w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width={691}
            height={413}
          />
        </div>
      )}
      {/* Render remaining images with lazy loading */}
      {images.slice(1).map((image, index) => (
        <div
          key={index + 1}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index + 1 === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={image}
            alt={`Architectural design ${index + 2}`}
            className="rounded-lg shadow-lg w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            width={691}
            height={413}
          />
        </div>
      ))}
      
      {/* Navigation arrows - only show when there are multiple images */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-10 w-10"
            onClick={goToPrevious}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-10 w-10"
            onClick={goToNext}
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </>
      )}
      
      {/* Dots indicator - using min 24px touch targets for accessibility */}
      {images.length > 1 && (
        <div className="absolute bottom-1 left-0 right-0 z-20 flex justify-center gap-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="min-w-6 min-h-6 flex items-center justify-center p-2"
              aria-label={`Go to slide ${index + 1}`}
            >
              <span
                className={`block rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-white w-4 h-2"
                    : "bg-white/50 hover:bg-white/80 w-2 h-2"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

ImageCarousel.displayName = "ImageCarousel";

export { ImageCarousel };
