
import React, { useEffect, useRef } from "react";
import { ArrowRight, Heart, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatedButton } from "../ui/AnimatedButton";
import { GlassMorphismCard } from "../ui/GlassMorphismCard";
import { ImageCarousel } from "../ui/ImageCarousel";
import { scrollParallax } from "@/utils/transitions";

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const decorativeElement1 = useRef<HTMLDivElement>(null);
  const decorativeElement2 = useRef<HTMLDivElement>(null);
  const decorativeElement3 = useRef<HTMLDivElement>(null);

  const heroImages = [
    "/lovable-uploads/66619c27-f30e-4e6c-b1c7-0f5ad695cee0.png",
    "/lovable-uploads/dd2d3de4-09ef-4eb5-a833-36fb407ca0ad.png",
    "/lovable-uploads/741fe312-9ad4-4de6-833f-cb39ab80875c.png",
    "/lovable-uploads/3a843a1c-f661-483d-8811-7db962bc1ae3.png",
    "/lovable-uploads/9f01866a-b5d5-4500-b848-661b05f806fc.png",
    "/lovable-uploads/6f8495a1-edcb-490a-96bd-74de3ccd30ab.png",
    "/lovable-uploads/12407047-f591-4871-b433-89be31d5efd4.png",
    "/lovable-uploads/2f66816d-eb2c-415b-97e2-3a4797161b8d.png",
    "/lovable-uploads/bcbbc964-b88c-4788-98b5-67f72c5652c5.png"
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (decorativeElement1.current) {
        scrollParallax(e, decorativeElement1.current, 0.03);
      }
      if (decorativeElement2.current) {
        scrollParallax(e, decorativeElement2.current, 0.05);
      }
      if (decorativeElement3.current) {
        scrollParallax(e, decorativeElement3.current, 0.02);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={heroRef}
      className="relative pt-28 lg:pt-32 pb-24 lg:pb-32 overflow-hidden"
    >
      {/* Decorative elements */}
      <div 
        ref={decorativeElement1}
        className="absolute -right-20 top-20 w-64 h-64 rounded-full bg-teal-100 opacity-50 blur-3xl"
      />
      <div 
        ref={decorativeElement2}
        className="absolute -left-24 top-40 w-80 h-80 rounded-full bg-teal-200 opacity-40 blur-3xl"
      />
      <div 
        ref={decorativeElement3}
        className="absolute right-1/4 bottom-0 w-72 h-72 rounded-full bg-teal-50 opacity-60 blur-3xl"
      />

      <div className="container relative px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Hero Content */}
          <div className="order-2 lg:order-1 animate-fade-up">
            <div className="inline-block mb-6">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                Architectural Drafting Services
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              Outdoor Designs, <br />
              <span className="text-primary">Approved Results</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Professional architectural drafting services specializing in outdoor space designs for US permit applications. High-quality drawings at competitive prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
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
            <div className="mt-8 flex items-center text-muted-foreground">
              <div className="flex -space-x-2 mr-3">
                <img
                  src="https://randomuser.me/api/portraits/men/1.jpg"
                  alt="Customer"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <img
                  src="https://randomuser.me/api/portraits/women/2.jpg"
                  alt="Customer"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <img
                  src="https://randomuser.me/api/portraits/men/3.jpg"
                  alt="Customer"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              </div>
              <span className="text-sm">
                Trusted by <span className="text-foreground font-medium">2,000+</span> clients in the US
              </span>
            </div>
          </div>

          {/* Hero Image */}
          <div className="order-1 lg:order-2 animate-fade-in">
            <div className="relative max-w-xl mx-auto lg:ml-auto">
              <GlassMorphismCard 
                className="relative p-3"
                variant="interactive"
              >
                <div className="relative aspect-[4/3] w-full">
                  <ImageCarousel 
                    images={heroImages} 
                    interval={6000}
                    className="aspect-[4/3] w-full" 
                  />
                </div>
              </GlassMorphismCard>
              
              {/* Satisfaction tag */}
              <div className="absolute -bottom-8 -left-8 z-20">
                <GlassMorphismCard className="px-4 py-3 shadow-lg" fadeIn>
                  <div className="flex items-center space-x-3">
                    <div className="bg-teal-100 p-2 rounded-full">
                      <Heart size={18} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">100% Satisfaction</h3>
                      <p className="text-xs text-muted-foreground">30-day guarantee</p>
                    </div>
                  </div>
                </GlassMorphismCard>
              </div>
              
              {/* Fast delivery tag */}
              <div className="absolute -top-8 -right-8 z-20">
                <GlassMorphismCard className="px-4 py-3 shadow-lg" fadeIn>
                  <div className="flex items-center space-x-3">
                    <div className="bg-teal-100 p-2 rounded-full">
                      <Clock size={18} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">Fast Turnaround</h3>
                      <p className="text-xs text-muted-foreground">48-72 hour delivery</p>
                    </div>
                  </div>
                </GlassMorphismCard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
