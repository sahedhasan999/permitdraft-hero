import React, { useRef } from "react";
import { GlassMorphismCard } from "../ui/GlassMorphismCard";

interface BenefitProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const BenefitCard: React.FC<BenefitProps> = ({ icon, title, description, delay = 0 }) => {
  return (
    <div 
      className="animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <GlassMorphismCard variant="hover" className="h-full">
        <div className="flex flex-col">
          <div className="bg-primary/10 p-3 inline-block rounded-lg mb-4">
            {icon}
          </div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </GlassMorphismCard>
    </div>
  );
};

const Benefits = () => {
  const benefitsRef = useRef<HTMLDivElement>(null);

  const benefits: BenefitProps[] = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
          <path d="M12 2v20" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      title: "Cost-Effective Solutions",
      description: "Save up to 60% compared to US-based drafting services without compromising on quality or precision.",
      delay: 100
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      title: "Rapid Turnaround",
      description: "48-72 hour delivery on standard projects, with rush options available for time-sensitive needs.",
      delay: 200
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
          <path d="m9 12 2 2 4-4" />
          <path d="M12 2H2v10h3.55M22 10V2h-8" />
          <path d="m2 18 5.3-5.3a2.77 2.77 0 0 1 3.53-.06l.07.06.08-.08a2.82 2.82 0 0 1 3.92 0l4.1 4.1" />
          <path d="M8 16v6a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-5a1 1 0 0 0-1 1l.03 6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3l-3-3Z" />
        </svg>
      ),
      title: "Permit-Ready Drawings",
      description: "Our drawings are compliant with US building codes and designed to streamline permit approval processes.",
      delay: 300
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
          <path d="M12 2H2v10h10V2Z" />
          <path d="M12 12H2v10h10V12Z" />
          <path d="M22 2h-5v5h5V2Z" />
          <path d="M22 12h-5v10h5V12Z" />
          <path d="M22 7h-5v5h5V7Z" />
        </svg>
      ),
      title: "Comprehensive Service",
      description: "From initial sketches to final construction documents, we handle all aspects of the drafting process.",
      delay: 400
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
      title: "Unlimited Revisions",
      description: "Our service includes unlimited revisions during the design phase to ensure complete client satisfaction.",
      delay: 500
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
          <path d="M8 21h8" />
          <path d="M12 21v-4" />
          <path d="M20 3v4.3a1 1 0 0 1-.1.4L13 16" />
          <path d="m2 11 8-8 2 2" />
          <path d="m17 3 3 3" />
          <path d="M4 13v8" />
          <path d="M4 9v2" />
          <path d="M8 9H4" />
        </svg>
      ),
      title: "Experienced Team",
      description: "Our drafters have extensive experience working with US construction standards and permit requirements.",
      delay: 600
    },
  ];

  return (
    <section id="benefits" className="py-24 bg-background" ref={benefitsRef}>
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-16 animate-fade-up">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Why Choose PermitDraft Pro?
          </h2>
          <p className="text-muted-foreground">
            Delivering exceptional drafting services with precision, speed, and affordability for all your outdoor space design needs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} {...benefit} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
