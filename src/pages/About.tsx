
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GlassMorphismCard } from "@/components/ui/GlassMorphismCard";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-2 text-center">About Us</h1>
            <p className="text-muted-foreground text-center mb-12">
              Professional architectural drafting services for outdoor spaces
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-2xl font-bold mb-4">Our Story</h2>
                <p className="text-muted-foreground mb-4">
                  PermitDraftPro was founded in 2024 by a team of experienced engineers and designers who recognized a gap in the market for specialized outdoor space drafting services.
                </p>
                <p className="text-muted-foreground mb-4">
                  With the increasing popularity of outdoor living spaces, we saw homeowners and contractors struggling with the complex permitting process required for these projects.
                </p>
                <p className="text-muted-foreground">
                  Our mission is to simplify the permit application process by providing high-quality drawings that meet or exceed local code requirements, helping our clients get their projects approved faster.
                </p>
              </div>
              <div>
                <GlassMorphismCard className="p-4">
                  <img 
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                    alt="Our team at work" 
                    className="rounded-lg w-full h-auto"
                  />
                </GlassMorphismCard>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-6 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <GlassMorphismCard className="p-6 text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="M22 12h-4"></path>
                    <path d="M6 12H2"></path>
                    <path d="M12 6V2"></path>
                    <path d="M12 22v-4"></path>
                  </svg>
                </div>
                <h3 className="font-bold mb-2">Precision</h3>
                <p className="text-muted-foreground">We pay attention to every detail to ensure our drawings are accurate and compliant with local codes.</p>
              </GlassMorphismCard>
              
              <GlassMorphismCard className="p-6 text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
                    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                    <line x1="16" y1="8" x2="2" y2="22"></line>
                    <line x1="17.5" y1="15" x2="9" y2="15"></line>
                  </svg>
                </div>
                <h3 className="font-bold mb-2">Creativity</h3>
                <p className="text-muted-foreground">We blend technical expertise with creative solutions to design beautiful and functional outdoor spaces.</p>
              </GlassMorphismCard>
              
              <GlassMorphismCard className="p-6 text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                </div>
                <h3 className="font-bold mb-2">Reliability</h3>
                <p className="text-muted-foreground">We deliver on time, every time, because we understand that delays cost our clients time and money.</p>
              </GlassMorphismCard>
            </div>
            
            <h2 className="text-2xl font-bold mb-6 text-center">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <img 
                  src="https://randomuser.me/api/portraits/men/32.jpg" 
                  alt="Team member" 
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-bold">Michael Johnson</h3>
                <p className="text-sm text-muted-foreground">Principal Architect</p>
              </div>
              
              <div className="text-center">
                <img 
                  src="https://randomuser.me/api/portraits/women/44.jpg" 
                  alt="Team member" 
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-bold">Sarah Williams</h3>
                <p className="text-sm text-muted-foreground">Senior Designer</p>
              </div>
              
              <div className="text-center">
                <img 
                  src="https://randomuser.me/api/portraits/men/62.jpg" 
                  alt="Team member" 
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-bold">David Chen</h3>
                <p className="text-sm text-muted-foreground">CAD Specialist</p>
              </div>
              
              <div className="text-center">
                <img 
                  src="https://randomuser.me/api/portraits/women/59.jpg" 
                  alt="Team member" 
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-bold">Jennifer Lopez</h3>
                <p className="text-sm text-muted-foreground">Project Manager</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
