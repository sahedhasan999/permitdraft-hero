
import React, { useEffect, useRef } from "react";
import { Check, ArrowRight } from "lucide-react";
import { AnimatedButton } from "../ui/AnimatedButton";
import { GlassMorphismCard } from "../ui/GlassMorphismCard";
import { Link } from "react-router-dom";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  cta: string;
  link: string;
  delay?: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  icon, title, description, features, cta, link, delay = 0 
}) => {
  return (
    <div 
      className="animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <GlassMorphismCard 
        variant="interactive" 
        className="h-full flex flex-col"
      >
        <div className="bg-primary/10 p-3 inline-block rounded-lg mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-muted-foreground mb-6">{description}</p>
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
          <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" />
          <line x1="8" y1="16" x2="8.01" y2="16" />
          <line x1="8" y1="20" x2="8.01" y2="20" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
          <line x1="12" y1="22" x2="12.01" y2="22" />
          <line x1="16" y1="16" x2="16.01" y2="16" />
          <line x1="16" y1="20" x2="16.01" y2="20" />
        </svg>
      ),
      title: "Outdoor Living Spaces",
      description: "Create stunning outdoor living areas with our detailed drafting services for patios, decks, and outdoor kitchens.",
      features: [
        "Custom patio and deck designs",
        "Outdoor kitchen and living room layouts",
        "Fireplace and fire pit installations",
        "Pergolas and shade structures"
      ],
      cta: "Explore Outdoor Living",
      link: "/services/outdoor-living",
      delay: 100
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
          <path d="M12 3 4 9v12h16V9l-8-6z" />
          <path d="M12 3v18" />
          <path d="M4 9h16" />
          <path d="M8 15h8" />
          <path d="M8 21h8" />
        </svg>
      ),
      title: "Landscape Planning",
      description: "Comprehensive landscape planning and drafting services that transform outdoor environments.",
      features: [
        "Garden layout and planting plans",
        "Hardscape and walkway designs",
        "Irrigation system layouts",
        "Terrain grading and drainage plans"
      ],
      cta: "View Landscape Solutions",
      link: "/services/landscape-planning",
      delay: 200
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
          <path d="M12 2v8" />
          <path d="m4.93 10.93 1.41 1.41" />
          <path d="M2 18h2" />
          <path d="M20 18h2" />
          <path d="m19.07 10.93-1.41 1.41" />
          <path d="M22 22H2" />
          <path d="M16 6 7 22" />
          <path d="m8 6 9 16" />
        </svg>
      ),
      title: "Swimming Pools & Water Features",
      description: "Detailed technical drawings for swimming pools, spas, and decorative water elements.",
      features: [
        "Swimming pool technical plans",
        "Spa and hot tub designs",
        "Water feature specifications",
        "Equipment and mechanical plans"
      ],
      cta: "Discover Water Features",
      link: "/services/pools-water-features",
      delay: 300
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
            Our drafting team specializes in creating precise, permit-ready drawings for all types of outdoor spaces, helping you transform ideas into approved reality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>

        <div className="mt-16 text-center animate-fade-up" style={{ animationDelay: "400ms" }}>
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
