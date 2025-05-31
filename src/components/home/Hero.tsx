import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Heart, Clock, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnimatedButton } from "../ui/AnimatedButton";
import { GlassMorphismCard } from "../ui/GlassMorphismCard";
import { ImageCarousel } from "../ui/ImageCarousel";
import { scrollParallax } from "@/utils/transitions";
import { useAuth } from "@/contexts/AuthContext";
import { subscribeToCarouselImages, CarouselImage } from "@/services/carouselService";

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const decorativeElement1 = useRef<HTMLDivElement>(null);
  const decorativeElement2 = useRef<HTMLDivElement>(null);
  const decorativeElement3 = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Get carousel images from Firebase instead of context
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);
  
  useEffect(() => {
    // Subscribe to real-time updates from Firebase
    const unsubscribe = subscribeToCarouselImages((images) => {
      setCarouselImages(images);
    });

    return unsubscribe;
  }, []);
  
  // Filter out inactive images and extract just the image URLs
  const heroImages = carouselImages
    .filter(img => img.active)
    .map(img => img.src);

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
  
  const handleStartProject = () => {
    if (user) {
      // If logged in, go directly to order page
      navigate('/order');
    } else {
      // If not logged in, redirect to login with state that indicates to show signup immediately
      navigate('/login', { 
        state: { 
          redirectTo: '/',
          showSignUp: true
        } 
      });
    }
  };

  return (
    <div 
      ref={heroRef}
      className="relative pt-20 lg:pt-24 pb-12 lg:pb-16 overflow-hidden"
    >
      {/* Decorative elements */}
      <div 
        ref={decorativeElement1}
        className="absolute -right-20 top-10 w-64 h-64 rounded-full bg-teal-100 opacity-50 blur-3xl"
      />
      <div 
        ref={decorativeElement2}
        className="absolute -left-24 top-20 w-80 h-80 rounded-full bg-teal-200 opacity-40 blur-3xl"
      />
      <div 
        ref={decorativeElement3}
        className="absolute right-1/4 bottom-0 w-72 h-72 rounded-full bg-teal-50 opacity-60 blur-3xl"
      />

      <div className="container relative px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-6 items-center">
          {/* Hero Content */}
          <div className="order-2 lg:order-1 animate-fade-up">
            <div className="inline-block mb-4">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                Architectural Drafting Services
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
              Outdoor Designs, <br />
              <span className="text-primary">Approved Results</span>
            </h1>
            <p className="text-base text-muted-foreground mb-6 max-w-lg">
              Professional architectural drafting services specializing in outdoor space designs for US permit applications. High-quality drawings at competitive prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <AnimatedButton 
                variant="primary" 
                size="lg" 
                iconRight={<ArrowRight size={16} />}
                onClick={() => navigate('/quote')}
              >
                Get a Quote
              </AnimatedButton>
              <AnimatedButton 
                variant="outline" 
                size="lg" 
                iconRight={<ArrowUpRight size={16} />}
                onClick={handleStartProject}
              >
                Start Your Project
              </AnimatedButton>
            </div>
            <div className="mt-6 flex items-center text-muted-foreground">
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
                  {heroImages.length > 0 ? (
                    <ImageCarousel 
                      images={heroImages} 
                      interval={6000}
                      className="aspect-[4/3] w-full" 
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-muted/20 rounded-lg">
                      <p className="text-muted-foreground">No images available</p>
                    </div>
                  )}
                </div>
              </GlassMorphismCard>
              
              {/* Satisfaction tag */}
              <div className="absolute -bottom-6 -left-6 z-20">
                <GlassMorphismCard className="px-4 py-2 shadow-lg" fadeIn>
                  <div className="flex items-center space-x-3">
                    <div className="bg-teal-100 p-2 rounded-full">
                      <Heart size={16} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">100% Satisfaction</h3>
                      <p className="text-xs text-muted-foreground">30-day guarantee</p>
                    </div>
                  </div>
                </GlassMorphismCard>
              </div>
              
              {/* Fast delivery tag */}
              <div className="absolute -top-6 -right-6 z-20">
                <GlassMorphismCard className="px-4 py-2 shadow-lg" fadeIn>
                  <div className="flex items-center space-x-3">
                    <div className="bg-teal-100 p-2 rounded-full">
                      <Clock size={16} className="text-primary" />
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
