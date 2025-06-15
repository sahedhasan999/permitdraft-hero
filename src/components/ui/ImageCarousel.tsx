
import React, { useState, useEffect, memo } from "react";

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

  if (images.length === 0) {
    return null;
  }

  if (!imagesLoaded) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 rounded-lg`}>
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
          {loadedImages.has(index) && (
            <img
              src={image}
              alt={`Architectural design ${index + 1}`}
              className="rounded-lg shadow-lg w-full h-full object-cover"
              loading="lazy"
            />
          )}
        </div>
      ))}
      
      {/* Dots indicator */}
      {images.length > 1 && (
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
      )}
    </div>
  );
});

ImageCarousel.displayName = "ImageCarousel";

export { ImageCarousel };
