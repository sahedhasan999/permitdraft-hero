
import React, { useState, useEffect } from "react";
import { GlassMorphismCard } from "./GlassMorphismCard";

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

  useEffect(() => {
    // Set up automatic image rotation
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

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
            src={image}
            alt={`Architectural design ${index + 1}`}
            className="rounded-lg shadow-lg w-full h-full object-cover"
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
