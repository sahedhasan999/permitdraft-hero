import React, { useEffect } from "react";
import Hero from '@/components/home/Hero';
import Services from '@/components/home/Services';
import Benefits from '@/components/home/Benefits';
import Testimonials from '@/components/home/Testimonials';
import CTASection from '@/components/home/CTASection';
import Navbar from "../components/layout/Navbar";
const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Deck & Patio Permit Drawings | Outdoor Space Design | PermitDraft Pro";
  }, []);
  return <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <div className="py-0">
          <Services />
        </div>
        <Benefits />
        <Testimonials />
        <div className="py-12">
          <CTASection />
        </div>
      </main>
    </div>;
};
export default Index;