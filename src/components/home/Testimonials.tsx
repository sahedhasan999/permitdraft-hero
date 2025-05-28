
import React, { useState, useEffect, useRef } from "react";
import { GlassMorphismCard } from "../ui/GlassMorphismCard";
import { AnimatedButton } from "../ui/AnimatedButton";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { getActiveTestimonials, Testimonial } from "@/services/testimonialsService";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const [loading, setLoading] = useState(true);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const activeTestimonials = await getActiveTestimonials();
      setTestimonials(activeTestimonials);
    } catch (error) {
      console.error('Failed to load testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToPrevious = () => {
    setSlideDirection('left');
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setSlideDirection('right');
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    if (testimonials.length > 0) {
      const interval = setInterval(() => {
        goToNext();
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [testimonials.length, currentIndex]);

  if (loading) {
    return (
      <section id="testimonials" className="section-padding bg-zinc-50">
        <div className="container px-4 mx-auto">
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section id="testimonials" className="section-padding bg-zinc-50" ref={testimonialsRef}>
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-16 animate-fade-up">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Trusted by Professionals and Homeowners
          </h2>
          <p className="text-muted-foreground">
            Hear what our clients have to say about their experience working with PermitDraft Pro.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto animate-fade-up" style={{ animationDelay: "200ms" }}>
          <GlassMorphismCard variant="default" className="relative overflow-hidden p-0">
            <div className="absolute top-4 left-4 text-primary opacity-50">
              <Quote size={52} />
            </div>
            
            <div className="relative z-10 p-8 md:p-12">
              <div 
                className={`transition-all duration-500 transform ${
                  slideDirection === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left'
                }`}
                key={currentIndex}
              >
                <blockquote className="text-lg md:text-xl italic mb-6 relative z-10">
                  "{currentTestimonial.content}"
                </blockquote>
                
                <div className="flex items-center">
                  <img 
                    src={currentTestimonial.image} 
                    alt={currentTestimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                  />
                  <div className="ml-4">
                    <div className="font-semibold">{currentTestimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {currentTestimonial.role}, {currentTestimonial.company}
                    </div>
                  </div>
                  <div className="ml-auto flex">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i}
                        className={`w-5 h-5 ${i < currentTestimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </GlassMorphismCard>
          
          <div className="flex justify-between mt-8">
            <AnimatedButton 
              variant="outline" 
              size="sm" 
              onClick={goToPrevious}
              className="rounded-full p-3"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} />
            </AnimatedButton>
            
            <div className="flex space-x-2 items-center">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-primary' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <AnimatedButton 
              variant="outline" 
              size="sm" 
              onClick={goToNext}
              className="rounded-full p-3"
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} />
            </AnimatedButton>
          </div>
        </div>
        
        <div className="mt-10 text-center animate-fade-up" style={{ animationDelay: "400ms" }}>
          <Link to="/testimonials">
            <AnimatedButton variant="ghost" size="md">
              View All Testimonials
            </AnimatedButton>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
