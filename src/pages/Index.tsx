import React, { useEffect } from "react";
import Hero from '@/components/home/Hero';
import Services from '@/components/home/Services';
import Benefits from '@/components/home/Benefits';
import Testimonials from '@/components/home/Testimonials';
import CTASection from '@/components/home/CTASection';
import Navbar from "../components/layout/Navbar";
import { SEOManager, PerformanceOptimizer } from '@/utils/seo';

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Advanced SEO optimization
    SEOManager.updatePageSEO({
      title: "Professional Deck & Patio Permit Drawings | Fast Turnaround | PermitDraft Pro",
      description: "Get professional permit drawings for decks, patios, pergolas & outdoor spaces. Expert architectural drafting services with 3-5 day delivery. Compliant with all US building codes. Get your permit approved faster!",
      keywords: "deck permit drawings, patio permit drawings, pergola permits, outdoor space permits, architectural drafting, building permits, construction drawings, permit applications, deck construction plans, patio design plans",
      canonicalUrl: "https://permitdraftpro.com/",
      ogImage: "/og-image.png",
      structuredData: {
        "@context": "https://schema.org",
        "@graph": [
          SEOManager.generateBusinessSchema(),
          SEOManager.generateFAQSchema(),
          {
            "@type": "WebPage",
            "@id": "https://permitdraftpro.com/",
            "url": "https://permitdraftpro.com/",
            "name": "Professional Deck & Patio Permit Drawings | PermitDraft Pro",
            "isPartOf": {
              "@id": "https://permitdraftpro.com/#website"
            },
            "datePublished": "2024-01-01T00:00:00+00:00",
            "dateModified": new Date().toISOString(),
            "description": "Get professional permit drawings for decks, patios, pergolas & outdoor spaces. Expert architectural drafting services with 3-5 day delivery.",
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://permitdraftpro.com/"
                }
              ]
            },
            "speakable": {
              "@type": "SpeakableSpecification",
              "cssSelector": ["h1", "h2", ".hero-description"]
            }
          }
        ]
      }
    });
    
    // Performance optimization
    PerformanceOptimizer.preloadCriticalResources();
    PerformanceOptimizer.initLazyLoading();
    PerformanceOptimizer.optimizeCoreWebVitals();
    
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main role="main">
        {/* SEO-optimized semantic HTML structure */}
        <section aria-label="Hero section">
          <Hero />
        </section>
        
        <section aria-label="Services section" className="py-0">
          <Services />
        </section>
        
        <section aria-label="Benefits section">
          <Benefits />
        </section>
        
        <section aria-label="Customer testimonials">
          <Testimonials />
        </section>
        
        <section aria-label="Call to action" className="py-12">
          <CTASection />
        </section>
        
        {/* Hidden SEO content for search engines */}
        <div className="sr-only" aria-hidden="true">
          <h2>Professional Permit Drawing Services Nationwide</h2>
          <p>
            PermitDraft Pro specializes in creating professional permit drawings for residential and commercial projects.
            Our expert team delivers high-quality architectural drawings that meet all local building codes and regulations.
            We serve clients nationwide with fast turnaround times and competitive pricing.
          </p>
          
          <h3>Services We Offer:</h3>
          <ul>
            <li>Deck permit drawings and construction plans</li>
            <li>Patio design and permit documentation</li>
            <li>Pergola structural drawings and permits</li>
            <li>Outdoor kitchen permit applications</li>
            <li>Home addition architectural drawings</li>
            <li>Swimming pool permit drawings</li>
            <li>Fence and gate permit applications</li>
            <li>Shed and outbuilding permits</li>
          </ul>
          
          <h3>Why Choose PermitDraft Pro?</h3>
          <ul>
            <li>15+ years of experience in architectural drafting</li>
            <li>Licensed professionals and certified drafters</li>
            <li>Fast 3-5 day delivery with rush options available</li>
            <li>Compliant with all local building codes</li>
            <li>100% satisfaction guarantee</li>
            <li>Nationwide service coverage</li>
            <li>Competitive pricing with transparent costs</li>
            <li>Expert permit application support</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Index;