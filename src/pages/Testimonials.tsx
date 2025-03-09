import React, { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Michael Johnson",
    role: "Homeowner",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    content: "Working with PermitDraft Pro was a game-changer for my deck project. Their detailed plans helped me get my permit approved on the first submission. The contractors loved how clear the drawings were too!",
    rating: 5,
    project: "Deck Project",
    location: "Portland, OR"
  },
  {
    id: 2,
    name: "Sarah Williams",
    role: "Landscape Contractor",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    content: "As a contractor, I've worked with many drafting services, but PermitDraft Pro consistently delivers the best plans. Their attention to detail and quick turnaround time have made them my go-to recommendation for clients.",
    rating: 5,
    project: "Multiple Projects",
    location: "Seattle, WA"
  },
  {
    id: 3,
    name: "David Thompson",
    role: "DIY Enthusiast",
    image: "https://randomuser.me/api/portraits/men/68.jpg",
    content: "I'm a hands-on homeowner who wanted to build my own pergola. The plans from PermitDraft Pro were so detailed that even as a first-timer, I felt confident throughout the entire building process.",
    rating: 5,
    project: "Pergola Construction",
    location: "Austin, TX"
  },
  {
    id: 4,
    name: "Jennifer Martinez",
    role: "Real Estate Developer",
    image: "https://randomuser.me/api/portraits/women/28.jpg",
    content: "The ADU plans we received were comprehensive and helped streamline our permitting process. PermitDraft Pro understands local codes and requirements, which saved us a lot of time and headaches.",
    rating: 5,
    project: "ADU Development",
    location: "San Diego, CA"
  },
  {
    id: 5,
    name: "Robert Chen",
    role: "Homeowner",
    image: "https://randomuser.me/api/portraits/men/52.jpg",
    content: "Our outdoor kitchen design exceeded expectations. The 3D renderings helped us visualize the space perfectly, and the detailed plans made construction smooth. Highly recommended!",
    rating: 5,
    project: "Outdoor Kitchen",
    location: "Denver, CO"
  },
  {
    id: 6,
    name: "Amanda Wilson",
    role: "General Contractor",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    content: "We've completed several patio projects using PermitDraft Pro's services. Their plans are always accurate, detailed, and code-compliant, which makes our job much easier and keeps clients happy.",
    rating: 4,
    project: "Patio Installations",
    location: "Chicago, IL"
  },
];

const Testimonials = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Testimonials | PermitDraft Pro";
  }, []);

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

          <div className="mt-16 bg-teal-50 rounded-lg p-8 md:p-12">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join our satisfied customers and get professional drafting services for your outdoor project today.
              </p>
              <Link to="/quote">
                <AnimatedButton 
                  variant="primary" 
                  size="lg" 
                  iconRight={<ArrowRight size={16} />}
                >
                  Get a Free Quote
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Testimonials;
