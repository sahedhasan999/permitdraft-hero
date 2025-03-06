
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import { AnimatedButton } from "../ui/AnimatedButton";

interface ServiceLayoutProps {
  title: string;
  description: string;
  image: string;
  features: string[];
  children?: React.ReactNode;
}

const ServiceLayout: React.FC<ServiceLayoutProps> = ({
  title,
  description,
  image,
  features,
  children
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 lg:pt-32 pb-24">
        <div className="container px-4 mx-auto">
          {/* Service Header */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
            <div className="animate-fade-up">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{title}</h1>
              <p className="text-lg text-muted-foreground mb-8">{description}</p>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 bg-teal-100 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-base">{feature}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link to="/quote">
                  <AnimatedButton 
                    variant="primary" 
                    size="lg" 
                    iconRight={<ArrowRight size={16} />}
                  >
                    Get a Quote
                  </AnimatedButton>
                </Link>
              </div>
            </div>
            <div className="animate-fade-in order-first lg:order-last">
              <img 
                src={image} 
                alt={title}
                className="rounded-lg shadow-lg w-full object-cover aspect-[4/3]" 
              />
            </div>
          </div>
          
          {/* Additional Service Content */}
          {children}
          
          {/* CTA Section */}
          <div className="mt-16 bg-teal-50 rounded-lg p-8 md:p-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Get professional drafting services for your {title.toLowerCase()} project today. Fast turnaround, competitive pricing, and guaranteed permit approval.
              </p>
              <Link to="/quote">
                <AnimatedButton 
                  variant="primary" 
                  size="lg" 
                  iconRight={<ArrowRight size={16} />}
                >
                  Request a Quote Now
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceLayout;
