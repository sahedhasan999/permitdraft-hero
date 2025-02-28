
import React, { useRef } from "react";
import { Check, ArrowRight, Tag } from "lucide-react";
import { AnimatedButton } from "../ui/AnimatedButton";
import { GlassMorphismCard } from "../ui/GlassMorphismCard";
import { Link } from "react-router-dom";

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
        <div className="bg-primary/10 p-3 inline-block rounded-lg mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        
        <div className="mb-4 flex items-baseline">
          <span className="text-2xl font-bold text-primary">${discountedPrice.toFixed(0)}</span>
          {discountPercentage > 0 && (
            <span className="ml-2 text-sm text-muted-foreground line-through">${regularPrice}</span>
          )}
        </div>
        
        <ul className="space-y-2 mb-6 flex-grow">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check size={18} className="text-primary mr-2 mt-0.5 flex-shrink-0" />
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
          >
            {cta}
          </AnimatedButton>
        </Link>
      </GlassMorphismCard>
    </div>
  );
};

const Services = () => {
  const servicesRef = useRef<HTMLDivElement>(null);

  const services: ServiceCardProps[] = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
      ),
      title: "Deck Drawing Services",
      description: "Professional deck design drawings with detailed specifications for permit approval.",
      regularPrice: 499,
      discountPercentage: 15,
      features: [
        "3D visualization of your deck",
        "Complete material specifications",
        "Detailed structural drawings",
        "Building code compliance check",
        "2 revisions included"
      ],
      cta: "Start Deck Project",
      link: "/services/deck",
      delay: 100
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      title: "Patio Design Plans",
      description: "Custom patio design drawings with detailed hardscaping and drainage specifications.",
      regularPrice: 449,
      discountPercentage: 10,
      features: [
        "Detailed paving pattern layout",
        "Drainage plan and elevations",
        "Material specifications list",
        "Construction detail drawings",
        "Unlimited digital revisions"
      ],
      cta: "Design Your Patio",
      link: "/services/patio",
      delay: 200
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
          <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
        </svg>
      ),
      title: "Pergola Blueprints",
      description: "Custom pergola design with detailed construction drawings and specifications.",
      regularPrice: 399,
      discountPercentage: 20,
      features: [
        "Customized pergola dimensions",
        "Structural connection details",
        "Material and hardware list",
        "Roof/shade option details",
        "3D rendering of final design"
      ],
      cta: "Get Pergola Plans",
      link: "/services/pergola",
      delay: 300
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
          <path d="M9 5H2v14h7M9 5v14M9 5h6.5a2.5 2.5 0 0 1 0 5H9M16 13h2a2 2 0 0 1 0 4h-2M18 13v-3M18 17v3" />
        </svg>
      ),
      title: "Outdoor Kitchen Plans",
      description: "Comprehensive outdoor kitchen design with utility planning and appliance layout.",
      regularPrice: 699,
      discountPercentage: 12,
      features: [
        "Detailed counter and cabinet drawings",
        "Utility line planning (gas, water, electric)",
        "Appliance specification and layout",
        "Construction and installation details",
        "Material selection guidance"
      ],
      cta: "Design Outdoor Kitchen",
      link: "/services/outdoor-kitchen",
      delay: 400
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      title: "Home Addition/ADU Plans",
      description: "Comprehensive home addition and ADU design documents ready for permit submission.",
      regularPrice: 1299,
      discountPercentage: 10,
      features: [
        "Complete architectural plans",
        "Structural engineering calculations",
        "Mechanical, electrical & plumbing",
        "Title 24 energy compliance",
        "Permit application assistance"
      ],
      cta: "Plan Your Addition",
      link: "/services/home-addition",
      delay: 500
    }
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>

        <div className="mt-16 text-center animate-fade-up" style={{ animationDelay: "600ms" }}>
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg inline-block">
            <div className="flex items-center text-amber-700">
              <Tag className="mr-2" size={18} />
              <span className="font-medium">Bundle multiple services and save up to 25%!</span>
            </div>
          </div>
          <Link to="/services">
            <AnimatedButton 
              variant="outline" 
              size="lg"
              iconRight={<ArrowRight size={16} />}
            >
              View All Services
            </AnimatedButton>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;
