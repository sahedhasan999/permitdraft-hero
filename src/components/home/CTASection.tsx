
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight } from 'lucide-react';

const CTASection: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
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
    <section className="bg-teal-600 py-16 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Start Your Outdoor Project?
        </h2>
        <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
          Our team of experts is ready to help you transform your outdoor space. Get started with a design that will get approved quickly.
        </p>
        <AnimatedButton 
          onClick={handleStartProject}
          size="lg" 
          variant="secondary" 
          className="bg-white text-teal-600 hover:bg-gray-100 font-bold px-8 border-0"
        >
          Start Your Project Now
        </AnimatedButton>
      </div>
    </section>
  );
};

export default CTASection;
