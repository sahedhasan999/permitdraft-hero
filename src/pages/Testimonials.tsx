
import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getActiveTestimonials, Testimonial } from "@/services/testimonialsService";

const Testimonials = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Testimonials | PermitDraft Pro";
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

  const handleStartProject = () => {
    if (user) {
      navigate('/quote');
    } else {
      navigate('/login', { 
        state: { 
          redirectTo: '/',
          showSignUp: true
        } 
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-28 lg:pt-32 pb-24">
          <div className="container px-4 mx-auto">
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 lg:pt-32 pb-24">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">What Our Clients Say</h1>
            <p className="text-lg text-muted-foreground">
              Don't just take our word for it. Hear directly from homeowners, contractors, and builders who have experienced the PermitDraft Pro difference.
            </p>
          </div>

          {testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4" 
                    />
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                  <div className="text-sm text-gray-500">
                    <p>{testimonial.project} • {testimonial.location}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No testimonials available at the moment.</p>
            </div>
          )}

          <div className="mt-16 bg-teal-50 rounded-lg p-8 md:p-12">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join our satisfied customers and get professional drafting services for your outdoor project today.
              </p>
              <AnimatedButton 
                variant="primary" 
                size="lg" 
                iconRight={<ArrowRight size={16} />}
                onClick={handleStartProject}
              >
                Get a Free Quote
              </AnimatedButton>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Testimonials;
