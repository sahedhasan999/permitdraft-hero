
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the image type
export interface CarouselImage {
  id: string;
  src: string;
  alt: string;
  caption: string;
  active: boolean;
}

// Define the context value type
interface ContentContextType {
  carouselImages: CarouselImage[];
  setCarouselImages: React.Dispatch<React.SetStateAction<CarouselImage[]>>;
}

// Define initial carousel images
const initialCarouselImages: CarouselImage[] = [
  {
    id: 'img-1',
    src: '/lovable-uploads/66619c27-f30e-4e6c-b1c7-0f5ad695cee0.png',
    alt: 'Modern deck design',
    caption: 'Modern deck with built-in lighting',
    active: true
  },
  {
    id: 'img-2',
    src: '/lovable-uploads/dd2d3de4-09ef-4eb5-a833-36fb407ca0ad.png',
    alt: 'Wooden deck with pergola',
    caption: 'Wooden deck with overhead pergola',
    active: true
  },
  {
    id: 'img-3',
    src: '/lovable-uploads/741fe312-9ad4-4de6-833f-cb39ab80875c.png',
    alt: 'Custom patio design',
    caption: 'Custom stone patio with firepit',
    active: true
  },
  {
    id: 'img-4',
    src: '/lovable-uploads/3a843a1c-f661-483d-8811-7db962bc1ae3.png',
    alt: 'Elevated deck with railing',
    caption: 'Elevated deck with glass railing',
    active: true
  },
  {
    id: 'img-5',
    src: '/lovable-uploads/9f01866a-b5d5-4500-b848-661b05f806fc.png',
    alt: 'Outdoor kitchen area',
    caption: 'Luxury outdoor kitchen and dining area',
    active: true
  },
  {
    id: 'img-6',
    src: '/lovable-uploads/6f8495a1-edcb-490a-96bd-74de3ccd30ab.png',
    alt: 'Backyard transformation',
    caption: 'Complete backyard transformation',
    active: true
  },
  {
    id: 'img-7',
    src: '/lovable-uploads/12407047-f591-4871-b433-89be31d5efd4.png',
    alt: 'Multi-level deck',
    caption: 'Multi-level deck with integrated planters',
    active: true
  },
  {
    id: 'img-8',
    src: '/lovable-uploads/2f66816d-eb2c-415b-97e2-3a4797161b8d.png',
    alt: 'Covered patio design',
    caption: 'Covered patio with outdoor living room',
    active: true
  },
  {
    id: 'img-9',
    src: '/lovable-uploads/bcbbc964-b88c-4788-98b5-67f72c5652c5.png',
    alt: 'Modern deck with scenery',
    caption: 'Modern deck with mountain views',
    active: true
  }
];

// Create context with default value
const ContentContext = createContext<ContentContextType | undefined>(undefined);

// Provider component
export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>(() => {
    // Try to get stored images from localStorage
    const storedImages = localStorage.getItem('carouselImages');
    return storedImages ? JSON.parse(storedImages) : initialCarouselImages;
  });

  // Save images to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('carouselImages', JSON.stringify(carouselImages));
  }, [carouselImages]);

  return (
    <ContentContext.Provider value={{ carouselImages, setCarouselImages }}>
      {children}
    </ContentContext.Provider>
  );
};

// Custom hook to use the content context
export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
