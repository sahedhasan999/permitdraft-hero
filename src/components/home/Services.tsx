import React, { useRef, useState, useEffect } from "react";
import { Check, ArrowRight, Tag } from "lucide-react";
import { AnimatedButton } from "../ui/AnimatedButton";
import { GlassMorphismCard } from "../ui/GlassMorphismCard";
import { Link } from "react-router-dom";
import { getServicesForHomepage, Service } from "@/services/servicesService";
import { useToast } from "@/hooks/use-toast";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  regularPrice: number;
  discountPercentage: number;
  cta: string;
  link: string;
  delay?: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  icon, title, description, features, regularPrice, discountPercentage, cta, link, delay = 0 
}) => {
  const discountedPrice = regularPrice - (regularPrice * (discountPercentage / 100));
  
  return (
    <div 
      className="animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <GlassMorphismCard 
        variant="interactive" 
        className="h-full flex flex-col relative overflow-hidden"
      >
        {discountPercentage > 0 && (
          <div className="absolute -right-8 top-6 bg-red-500 text-white py-1 px-10 transform rotate-45 shadow-md text-xs font-bold">
            {discountPercentage}% OFF
          </div>
        )}
        <div className="bg-teal-50 p-3 inline-block rounded-lg mb-4 w-fit">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        
        <div className="mb-4 flex items-baseline">
          <span className="text-2xl font-bold text-teal-600">${discountedPrice.toFixed(0)}</span>
          {discountPercentage > 0 && (
            <span className="ml-2 text-sm text-muted-foreground line-through">${regularPrice}</span>
          )}
        </div>
        
        <ul className="space-y-2 mb-6 flex-grow">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check size={18} className="text-teal-600 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        <Link to={link}>
          <AnimatedButton 
            variant="primary" 
            size="md" 
            fullWidth
            iconRight={<ArrowRight size={16} />}
            className="bg-teal-600 hover:bg-teal-700 text-white border-0"
          >
            {cta}
          </AnimatedButton>
        </Link>
      </GlassMorphismCard>
    </div>
  );
};

const getServiceIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'deck':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-teal-600">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
      );
    case 'patio':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-teal-600">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    case 'pergola':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-teal-600">
          <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
        </svg>
      );
    case 'kitchen':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-teal-600">
          <path d="M9 5H2v14h7M9 5v14M9 5h6.5a2.5 2.5 0 0 1 0 5H9M16 13h2a2 2 0 0 1 0 4h-2M18 13v-3M18 17v3" />
        </svg>
      );
    case 'addition':
    case 'adu':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-teal-600">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-teal-600">
          <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
        </svg>
      );
  }
};

const Services = () => {
  const servicesRef = useRef<HTMLDivElement>(null);
  const [services, setServices] = useState<ServiceCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const data = await getServicesForHomepage();
        
        if (data && data.length > 0) {
          // Transform the service data to match the ServiceCardProps format
          const transformedServices = data.map((service, index) => {
            return {
              icon: getServiceIcon(service.category),
              title: service.title,
              description: service.shortDescription,
              regularPrice: service.regularPrice || service.basePrice,
              discountPercentage: service.discountPercentage || 0,
              features: service.features || [],
              cta: service.cta || "Learn More",
              link: service.link || `/services/${service.id}`,
              delay: index * 100
            };
          });
          
          setServices(transformedServices);
        } else {
          // Use fallback services if no data is returned
          setServices([]);
          toast({
            title: "No services available",
            description: "There are no services configured to display on the homepage.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        toast({
          title: "Error loading services",
          description: "There was a problem loading the services.",
          variant: "destructive",
        });
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [toast]);

  return (
    <section id="services" className="section-padding bg-zinc-50" ref={servicesRef}>
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-16 animate-fade-up">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Specialized Outdoor Design Services
          </h2>
          <p className="text-muted-foreground">
            Expert drafting services for your outdoor projects with competitive pricing and guaranteed permit approval.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No services available at the moment.</p>
          </div>
        )}

        <div className="mt-16 text-center animate-fade-up" style={{ animationDelay: "600ms" }}>
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg inline-block">
            <div className="flex items-center text-amber-700">
              <Tag className="mr-2" size={18} />
              <span className="text-sm">
                All services include free consultation and 30-day satisfaction guarantee
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
