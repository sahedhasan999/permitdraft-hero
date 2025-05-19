import React, { useEffect } from "react";
import { HeroCarousel } from '@/components/home/HeroCarousel';
import Hero from '@/components/home/Hero';
import Services from '@/components/home/Services';
import Benefits from '@/components/home/Benefits';
import Testimonials from '@/components/home/Testimonials';
import CTASection from '@/components/home/CTASection';
import Navbar from "../components/layout/Navbar";

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "PermitDraft Pro | Outdoor Designs, Approved Results";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <HeroCarousel />
        <Services />
        <Benefits />
        <Testimonials />
        <CTASection />
      </main>
    </div>
  );
};

export default Index;
