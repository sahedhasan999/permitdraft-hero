
import React, { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { useAuth } from "@/contexts/AuthContext";

const projects = [
  {
    id: 1,
    title: "Modern Deck Design",
    category: "Deck",
    description: "A contemporary deck design with composite materials and glass railings.",
    image: "https://images.unsplash.com/photo-1591825729269-caeb344f6df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 2,
    title: "Paver Patio with Fire Pit",
    category: "Patio",
    description: "An elegant patio design featuring natural stone pavers and a built-in fire pit.",
    image: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 3,
    title: "Backyard Pergola",
    category: "Pergola",
    description: "A cedar pergola with retractable shade system and integrated lighting.",
    image: "https://images.unsplash.com/photo-1573742889082-5b8469aea25c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 4,
    title: "Luxury Outdoor Kitchen",
    category: "Outdoor Kitchen",
    description: "A complete outdoor kitchen with grill, refrigerator, and pizza oven.",
    image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 5,
    title: "Backyard ADU",
    category: "Home Addition/ADU",
    description: "A 600 sq ft accessory dwelling unit with modern finishes and full amenities.",
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 6,
    title: "Tiered Deck with Hot Tub",
    category: "Deck",
    description: "A multi-level deck featuring built-in seating and hot tub integration.",
    image: "https://images.unsplash.com/photo-1621631210617-5adc84567272?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
];

const Portfolio = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Portfolio | PermitDraft Pro";
  }, []);

  const handleStartProject = () => {
    if (user) {
      // If logged in, go directly to order page
      navigate('/quote');
    } else {
      // If not logged in, redirect to login with a state that indicates to show signup
      navigate('/login', { 
        state: { 
          redirectTo: '/quote',
          showSignUp: true
        } 
      });
    }
  };

  const handleSimilarDesign = (projectType: string) => {
    if (user) {
      // If logged in, go directly to quote page with prefilled project type
      navigate('/quote', { state: { prefillProjectType: projectType } });
    } else {
      // If not logged in, redirect to login with a state to show signup
      navigate('/login', { 
        state: { 
          redirectTo: '/quote',
          showSignUp: true,
          prefillData: { projectType }
        } 
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
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
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
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
