
import React, { useRef, useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { GlassMorphismCard } from "../ui/GlassMorphismCard";
import { subscribeToTestimonials, Testimonial } from "@/services/testimonialsService";

const TestimonialCard: React.FC<{ testimonial: Testimonial; index: number }> = ({ testimonial, index }) => {
  return (
    <div 
      className="animate-fade-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <GlassMorphismCard variant="hover" className="h-full">
        <div className="flex flex-col h-full">
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={`mr-1 ${i < testimonial.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
              />
            ))}
          </div>
          <blockquote className="text-muted-foreground mb-4 flex-grow italic">
            "{testimonial.content}"
          </blockquote>
          <div className="flex items-center">
            <div className="bg-teal-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
              <span className="text-teal-600 font-semibold text-sm">
                {testimonial.name.charAt(0)}
              </span>
            </div>
            <div>
              <div className="font-semibold text-sm">{testimonial.name}</div>
              <div className="text-xs text-muted-foreground">{testimonial.location}</div>
            </div>
          </div>
        </div>
      </GlassMorphismCard>
    </div>
  );
};

const Testimonials = () => {
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToTestimonials((data) => {
      // Filter active testimonials and sort by order
      const activeTestimonials = data
        .filter(testimonial => testimonial.active)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      
      setTestimonials(activeTestimonials);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  // Auto-advance testimonials
  useEffect(() => {
    if (testimonials.length > 1) {
      const interval = setInterval(nextTestimonial, 5000);
      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  if (isLoading) {
    return (
      <section className="py-24 bg-zinc-50">
        <div className="container px-4 mx-auto">
          <div className="flex justify-center">
            <div className="h-8 w-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="py-24 bg-zinc-50" ref={testimonialsRef}>
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-16 animate-fade-up">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Trusted by Professionals and Homeowners
          </h2>
          <p className="text-muted-foreground">
            Hear what our clients have to say about their experience working with PermitDraft Pro.
          </p>
        </div>

        {/* Desktop View - Grid Layout */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 6).map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </div>

        {/* Mobile View - Carousel */}
        <div className="md:hidden">
          <div className="relative">
            <TestimonialCard testimonial={testimonials[currentIndex]} index={0} />
            
            {testimonials.length > 1 && (
              <div className="flex justify-center items-center mt-6 space-x-4">
                <button
                  onClick={prevTestimonial}
                  className="p-2 rounded-full bg-white/80 border border-gray-200 shadow-sm hover:bg-white transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft size={16} />
                </button>
                
                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentIndex ? "bg-teal-600" : "bg-gray-300"
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={nextTestimonial}
                  className="p-2 rounded-full bg-white/80 border border-gray-200 shadow-sm hover:bg-white transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
