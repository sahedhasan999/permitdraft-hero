
import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { GlassMorphismCard } from "../ui/GlassMorphismCard";
import { AnimatedButton } from "../ui/AnimatedButton";

const CTASection = () => {
  return (
    <section className="py-20">
      <div className="container px-4 mx-auto">
        <div className="max-w-5xl mx-auto relative">
          <GlassMorphismCard
            className="overflow-hidden border-0 py-16 px-6 md:px-12 text-center backdrop-blur-xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10"
            padding="none"
          >
            {/* Decorative elements */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Get Your Project Approved?
              </h2>
              <p className="text-lg mb-8 text-muted-foreground">
                Start your outdoor space project with professional drafting services designed to speed up permit approvals.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/order">
                  <AnimatedButton 
                    variant="primary" 
                    size="lg" 
                    iconRight={<ArrowRight size={18} />}
                  >
                    Start Your Project
                  </AnimatedButton>
                </Link>
                <Link to="/contact">
                  <AnimatedButton 
                    variant="outline" 
                    size="lg"
                  >
                    Contact Us
                  </AnimatedButton>
                </Link>
              </div>
              
              <div className="mt-8 text-sm text-muted-foreground">
                <p>No commitment required. Free quote and consultation.</p>
              </div>
            </div>
          </GlassMorphismCard>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
