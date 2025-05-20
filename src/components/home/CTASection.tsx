
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const CTASection: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleStartProject = () => {
    if (user) {
      // If logged in, go directly to order page
      navigate('/order');
    } else {
      // If not logged in, redirect to login with a state that indicates to show signup
      // and where to go after signup
      navigate('/login', { 
        state: { 
          redirectTo: '/order',
          showSignUp: true
        } 
      });
    }
  };
  
  return (
    <section className="bg-primary py-16 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Start Your Outdoor Project?
        </h2>
        <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
          Our team of experts is ready to help you transform your outdoor space. Get started with a design that will get approved quickly.
        </p>
        <Button 
          onClick={handleStartProject}
          size="lg" 
          variant="secondary" 
          className="text-primary hover:text-primary-foreground font-bold px-8"
        >
          Start Your Project Now
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
