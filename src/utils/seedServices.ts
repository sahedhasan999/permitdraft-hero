import { addService } from '@/services/servicesService';

// Initial services data
const initialServices = [
  {
    title: "Deck Drawing Services",
    description: "Professional deck design drawings with detailed specifications for permit approval. Our expert drafters will create comprehensive plans that meet all local building codes and requirements, ensuring a smooth permit process.",
    shortDescription: "Professional deck design drawings for permit approval.",
    category: "Deck",
    basePrice: 424,
    regularPrice: 499,
    discountPercentage: 15,
    features: [
      "3D visualization of your deck",
      "Complete material specifications",
      "Detailed structural drawings",
      "Building code compliance check",
      "2 revisions included"
    ],
    active: true,
    image: "https://images.unsplash.com/photo-1591825729269-caeb344f6df2?q=80&w=2070&auto=format&fit=crop",
    cta: "Start Deck Project",
    link: "/services/deck",
    displayOrder: 1,
    showInNavigation: true,
    showOnHomepage: true
  },
  {
    title: "Patio Design Plans",
    description: "Custom patio design drawings with detailed hardscaping and drainage specifications. Our designs include precise measurements, material recommendations, and construction details to bring your outdoor living space to life.",
    shortDescription: "Custom patio design with hardscaping specifications.",
    category: "Patio",
    basePrice: 404,
    regularPrice: 449,
    discountPercentage: 10,
    features: [
      "Detailed paving pattern layout",
      "Drainage plan and elevations",
      "Material specifications list",
      "Construction detail drawings",
      "Unlimited digital revisions"
    ],
    active: true,
    image: "https://images.unsplash.com/photo-1598902108854-10e335adac99?q=80&w=2070&auto=format&fit=crop",
    cta: "Design Your Patio",
    link: "/services/patio",
    displayOrder: 2,
    showInNavigation: true,
    showOnHomepage: true
  },
  {
    title: "Pergola Blueprints",
    description: "Custom pergola design with detailed construction drawings and specifications. Our blueprints include all the information needed for DIY construction or professional installation, ensuring your pergola is both beautiful and structurally sound.",
    shortDescription: "Custom pergola design with construction drawings.",
    category: "Pergola",
    basePrice: 319,
    regularPrice: 399,
    discountPercentage: 20,
    features: [
      "Customized pergola dimensions",
      "Structural connection details",
      "Material and hardware list",
      "Roof/shade option details",
      "3D rendering of final design"
    ],
    active: true,
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2070&auto=format&fit=crop",
    cta: "Get Pergola Plans",
    link: "/services/pergola",
    displayOrder: 3,
    showInNavigation: true,
    showOnHomepage: true
  },
  {
    title: "Outdoor Kitchen Drafting Services",
    description: "Comprehensive outdoor kitchen design and drafting services. Our detailed plans include layout, utilities, appliance specifications, and construction details to create the perfect outdoor cooking and entertainment space.",
    shortDescription: "Detailed outdoor kitchen designs and plans.",
    category: "Kitchen",
    basePrice: 549,
    regularPrice: 649,
    discountPercentage: 15,
    features: [
      "Custom layout design",
      "Utility placement plans",
      "Appliance specifications",
      "Material selection guidance",
      "Construction-ready drawings"
    ],
    active: true,
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2070&auto=format&fit=crop",
    cta: "Plan Your Outdoor Kitchen",
    link: "/services/outdoor-kitchen",
    displayOrder: 4,
    showInNavigation: true,
    showOnHomepage: true
  },
  {
    title: "Home Addition & ADU Drafting Services",
    description: "Professional drafting services for home additions and Accessory Dwelling Units (ADUs). Our comprehensive plans include architectural drawings, structural details, and all documentation needed for permit approval.",
    shortDescription: "Professional drafting for home additions and ADUs.",
    category: "Addition",
    basePrice: 799,
    regularPrice: 999,
    discountPercentage: 20,
    features: [
      "Architectural floor plans",
      "Elevation drawings",
      "Structural details",
      "Utility and HVAC planning",
      "Permit application assistance"
    ],
    active: true,
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop",
    cta: "Start Your Addition Project",
    link: "/services/home-addition",
    displayOrder: 5,
    showInNavigation: true,
    showOnHomepage: true
  }
];

/**
 * Seeds the database with initial services
 * @returns Promise that resolves when all services have been added
 */
export const seedServices = async (): Promise<void> => {
  try {
    console.log('Starting to seed services...');
    
    for (const service of initialServices) {
      await addService(service);
      console.log(`Added service: ${service.title}`);
    }
    
    console.log('Successfully seeded all services!');
  } catch (error) {
    console.error('Error seeding services:', error);
    throw error;
  }
};

export default seedServices; 