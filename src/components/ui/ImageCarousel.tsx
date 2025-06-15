
import React, { useState, useEffect, useRef, useCallback } from "react";

interface ImageCarouselProps {
  images: string[];
  interval?: number;
  className?: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ 
  images, 
  interval = 5000, 
  className 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);

  // Intersection Observer for lazy loading
  const [imageObserver, setImageObserver] = useState<IntersectionObserver | null>(null);

  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(index);
      
      // If current and next image are loaded, consider ready
      const nextIndex = (index + 1) % images.length;
      if (newSet.has(currentIndex) && (newSet.has(nextIndex) || images.length === 1)) {
        setImagesLoaded(true);
      }
      
      return newSet;
    });
  }, [currentIndex, images.length]);

  // Set up intersection observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const index = parseInt(img.dataset.index || '0');
            
            if (!img.src && img.dataset.src) {
              img.src = img.dataset.src;
              img.onload = () => handleImageLoad(index);
            }
          }
        });
      },
      { rootMargin: '50px' }
    );
    
    setImageObserver(observer);
    return () => observer.disconnect();
  }, [handleImageLoad]);

  // Preload current and next image immediately
  useEffect(() => {
    const preloadImage = (index: number) => {
      if (imgRefs.current[index] && !loadedImages.has(index)) {
        const img = imgRefs.current[index];
        if (img && img.dataset.src && !img.src) {
          img.src = img.dataset.src;
          img.onload = () => handleImageLoad(index);
        }
      }
    };

    // Preload current image
    preloadImage(currentIndex);
    
    // Preload next image
    const nextIndex = (currentIndex + 1) % images.length;
    preloadImage(nextIndex);
  }, [currentIndex, images.length, loadedImages, handleImageLoad]);

  useEffect(() => {
    // Only start the interval once images are loaded
    if (!imagesLoaded) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval, imagesLoaded]);

  if (!imagesLoaded) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 rounded-lg animate-pulse`}>
        <div className="text-center p-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading images...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            ref={(el) => {
              imgRefs.current[index] = el;
              if (el && imageObserver) {
                imageObserver.observe(el);
              }
            }}
            data-src={image}
            data-index={index}
            alt={`Architectural design ${index + 1}`}
            className="rounded-lg shadow-lg w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ))}
      
      {/* Dots indicator */}
      <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? "bg-white w-4"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export { ImageCarousel };
