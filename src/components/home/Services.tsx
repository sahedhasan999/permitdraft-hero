import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatedButton } from '../ui/AnimatedButton';
import { GlassMorphismCard } from '../ui/GlassMorphismCard';

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: 'Deck Drawing Services',
      description: 'Professional deck designs with detailed specifications for permit applications.',
      price: 'Starting at $159',
      features: [
        'Detailed structural drawings',
        'Foundation and framing specifications',
        'Building code compliance check',
        'Revision support included'
      ],
      href: '/services/deck'
    },
    {
      title: 'Patio Drawing Services',
      description: 'Custom patio designs that enhance your outdoor living space and comply with local regulations.',
      price: 'Starting at $129',
      features: [
        'Layout and dimension plans',
        'Material selection guidance',
        'Drainage and grading solutions',
        '3D visualization available'
      ],
      href: '/services/patio'
    },
    {
      title: 'Pergola Drawing Services',
      description: 'Elegant pergola designs that provide shade and architectural interest to your property.',
      price: 'Starting at $99',
      features: [
        'Detailed construction blueprints',
        'Material and hardware specifications',
        'Custom design options',
        'Engineering review optional'
      ],
      href: '/services/pergola'
    },
    {
      title: 'Outdoor Kitchen Drawing Services',
      description: 'Functional and stylish outdoor kitchen designs tailored to your cooking and entertaining needs.',
      price: 'Starting at $249',
      features: [
        'Appliance layout and utility plans',
        'Countertop and cabinet details',
        'Ventilation and safety considerations',
        'Plumbing and electrical diagrams'
      ],
      href: '/services/outdoor-kitchen'
    },
    {
      title: 'Home Addition Drawing Services',
      description: 'Seamless home addition designs that blend with your existing structure and meet your expanding needs.',
      price: 'Starting at $399',
      features: [
        'Floor plans and elevations',
        'Structural engineering',
        'Energy efficiency analysis',
        'Permit submission assistance'
      ],
      href: '/services/home-addition'
    },
  ];

  return (
    <section id="services" className="py-6 bg-background">
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-12 animate-fade-up">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Specialized Outdoor Design Services
          </h2>
          <p className="text-muted-foreground">
            Expert drafting services for your outdoor projects with competitive pricing and fast turnaround times guaranteed.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div 
              key={index}
              className="animate-fade-up"
              style={{ animationDelay: `${(index % 6) * 100}ms` }}
            >
              <GlassMorphismCard variant="hover" className="h-full">
                <div className="flex flex-col h-full">
                  <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                  <ul className="list-disc pl-5 mb-4 text-sm text-muted-foreground flex-grow">
                    {service.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                  <div className="mt-auto">
                    <div className="text-primary font-semibold">{service.price}</div>
                    <AnimatedButton 
                      variant="secondary" 
                      size="sm" 
                      className="mt-2 w-full justify-center"
                      onClick={() => navigate(service.href)}
                    >
                      Learn More <ArrowRight size={16} />
                    </AnimatedButton>
                  </div>
                </div>
              </GlassMorphismCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
