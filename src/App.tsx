
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Portfolio from "./pages/Portfolio";
import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Quote from "./pages/Quote";
import Deck from "./pages/services/Deck";
import Patio from "./pages/services/Patio";
import Pergola from "./pages/services/Pergola"; 
import OutdoorKitchen from "./pages/services/OutdoorKitchen";
import HomeAddition from "./pages/services/HomeAddition";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Add mousemove event listener for parallax effects
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--parallax-slow', `${e.clientY * 0.01}px`);
      document.documentElement.style.setProperty('--parallax-medium', `${e.clientY * 0.02}px`);
      document.documentElement.style.setProperty('--parallax-fast', `${e.clientY * 0.03}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Preload critical images
    const preloadImages = () => {
      const images = [
        "https://images.unsplash.com/photo-1431576901776-e539bd916ba2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
      ];
      
      images.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    };

    preloadImages();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/quote" element={<Quote />} />
            <Route path="/services/deck" element={<Deck />} />
            <Route path="/services/patio" element={<Patio />} />
            <Route path="/services/pergola" element={<Pergola />} />
            <Route path="/services/outdoor-kitchen" element={<OutdoorKitchen />} />
            <Route path="/services/home-addition" element={<HomeAddition />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
