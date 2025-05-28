
import React, { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { useAuth } from "@/contexts/AuthContext";
import { usePortfolio } from "@/contexts/PortfolioContext";

const Portfolio = () => {
  const { user } = useAuth();
  const { portfolioItems } = usePortfolio();
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Portfolio | PermitDraft Pro";
  }, []);

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

  const handleSimilarDesign = (projectType: string) => {
    if (user) {
      navigate('/quote', { state: { prefillProjectType: projectType } });
    } else {
      navigate('/login', { 
        state: { 
          redirectTo: '/',
          showSignUp: true,
          prefillData: { projectType }
        } 
      });
    }
  };

  // Filter active portfolio items and sort by order
  const activePortfolioItems = portfolioItems
    .filter(item => item.active)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-background select-none">
      <Navbar />
      <main className="pt-28 lg:pt-32 pb-24">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Project Portfolio</h1>
            <p className="text-lg text-muted-foreground">
              Explore our collection of successful projects that showcase our expertise in creating detailed and permit-ready outdoor design drawings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activePortfolioItems.map((project) => (
              <div key={project.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 pointer-events-none"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 text-xs font-semibold bg-teal-100 text-teal-800 rounded-full mb-3">
                    {project.category}
                  </span>
                  <h2 className="text-xl font-bold mb-2">{project.title}</h2>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <button 
                    onClick={() => handleSimilarDesign(project.category)}
                    className="text-teal-600 font-medium hover:text-teal-800 inline-flex items-center"
                  >
                    Get a similar design
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {activePortfolioItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No portfolio items available at the moment.</p>
            </div>
          )}

          <div className="mt-16 text-center">
            <AnimatedButton 
              variant="primary" 
              size="lg" 
              iconRight={<ArrowRight size={16} />}
              onClick={handleStartProject}
            >
              Start Your Project
            </AnimatedButton>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Portfolio;
