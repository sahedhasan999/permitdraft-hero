/**
 * Advanced SEO utilities for top Google rankings
 * Implements technical SEO, structured data, and performance optimization
 */

interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: any;
  noindex?: boolean;
}

export class SEOManager {
  
  /**
   * Update page SEO metadata dynamically
   */
  static updatePageSEO(data: SEOData) {
    // Update title
    document.title = data.title;
    
    // Update meta description
    this.updateMetaTag('description', data.description);
    
    // Update keywords if provided
    if (data.keywords) {
      this.updateMetaTag('keywords', data.keywords);
    }
    
    // Update canonical URL
    if (data.canonicalUrl) {
      this.updateLinkTag('canonical', data.canonicalUrl);
    }
    
    // Update Open Graph tags
    this.updateMetaProperty('og:title', data.title);
    this.updateMetaProperty('og:description', data.description);
    this.updateMetaProperty('og:url', window.location.href);
    
    if (data.ogImage) {
      this.updateMetaProperty('og:image', data.ogImage);
    }
    
    // Update Twitter tags
    this.updateMetaTag('twitter:title', data.title);
    this.updateMetaTag('twitter:description', data.description);
    
    // Add structured data
    if (data.structuredData) {
      this.addStructuredData(data.structuredData);
    }
    
    // Handle noindex
    if (data.noindex) {
      this.updateMetaTag('robots', 'noindex, nofollow');
    } else {
      this.updateMetaTag('robots', 'index, follow');
    }
  }
  
  private static updateMetaTag(name: string, content: string) {
    let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = name;
      document.head.appendChild(meta);
    }
    meta.content = content;
  }
  
  private static updateMetaProperty(property: string, content: string) {
    let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.content = content;
  }
  
  private static updateLinkTag(rel: string, href: string) {
    let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = rel;
      document.head.appendChild(link);
    }
    link.href = href;
  }
  
  private static addStructuredData(data: any) {
    // Remove existing structured data
    const existing = document.querySelector('script[type="application/ld+json"]');
    if (existing) {
      existing.remove();
    }
    
    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }
  
  /**
   * Generate business schema for local SEO
   */
  static generateBusinessSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "PermitDraft Pro",
      "alternateName": "Permit Draft Pro",
      "description": "Professional permit drawings and architectural drafting services for decks, patios, pergolas, and outdoor spaces. Expert permit application support with fast turnaround times.",
      "url": window.location.origin,
      "telephone": "+1-123-456-7890",
      "email": "info@permitdraftpro.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Design Street, Suite 100",
        "addressLocality": "San Francisco",
        "addressRegion": "CA",
        "postalCode": "94103",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 37.7749,
        "longitude": -122.4194
      },
      "areaServed": [
        {
          "@type": "Country",
          "name": "United States"
        }
      ],
      "serviceType": [
        "Architectural Drafting",
        "Permit Drawings",
        "Construction Documentation",
        "Building Permit Applications"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Permit Drawing Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Deck Permit Drawings",
              "description": "Professional deck permit drawings for building permit applications"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Patio Permit Drawings",
              "description": "Expert patio permit drawings and construction documentation"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Pergola Permit Drawings",
              "description": "Detailed pergola permit drawings for outdoor structures"
            }
          }
        ]
      },
      "openingHours": "Mo-Fr 09:00-17:00",
      "sameAs": [
        "https://www.facebook.com/permitdraftpro",
        "https://www.linkedin.com/company/permitdraftpro",
        "https://www.instagram.com/permitdraftpro"
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "127",
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Sarah Johnson"
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          },
          "reviewBody": "Excellent service! Got my deck permit drawings completed quickly and professionally. Highly recommend!"
        }
      ]
    };
  }
  
  /**
   * Generate FAQ schema for rich snippets
   */
  static generateFAQSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How long does it take to get permit drawings?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Most permit drawings are completed within 3-5 business days. Rush orders can be accommodated within 24-48 hours for an additional fee."
          }
        },
        {
          "@type": "Question",
          "name": "What information do I need to provide for deck permit drawings?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You'll need property dimensions, desired deck size and location, local building codes requirements, and any existing structure information. Our team will guide you through the process."
          }
        },
        {
          "@type": "Question",
          "name": "Do you handle permit submissions?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We provide professionally drafted permit drawings. While we don't submit permits directly, our drawings are designed to meet local building codes and facilitate smooth permit approval."
          }
        },
        {
          "@type": "Question",
          "name": "What areas do you serve?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We provide permit drawing services throughout the United States, with expertise in various local building codes and regulations."
          }
        }
      ]
    };
  }
  
  /**
   * Generate service-specific schema
   */
  static generateServiceSchema(serviceName: string, serviceDescription: string) {
    return {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": serviceName,
      "description": serviceDescription,
      "provider": {
        "@type": "Organization",
        "name": "PermitDraft Pro",
        "url": window.location.origin
      },
      "areaServed": {
        "@type": "Country",
        "name": "United States"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": `${serviceName} Options`,
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": `Standard ${serviceName}`,
              "description": `Professional ${serviceName.toLowerCase()} with 5-day delivery`
            }
          },
          {
            "@type": "Offer", 
            "itemOffered": {
              "@type": "Service",
              "name": `Rush ${serviceName}`,
              "description": `Expedited ${serviceName.toLowerCase()} with 24-48 hour delivery`
            }
          }
        ]
      }
    };
  }
}

/**
 * Performance optimization utilities
 */
export class PerformanceOptimizer {
  
  /**
   * Lazy load images with intersection observer
   */
  static initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src || '';
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });
      
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }
  
  /**
   * Preload critical resources
   */
  static preloadCriticalResources() {
    const criticalResources = [
      '/assets/hero-bg.jpg',
      '/assets/logo.png'
    ];
    
    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.endsWith('.jpg') || resource.endsWith('.png') ? 'image' : 'fetch';
      document.head.appendChild(link);
    });
  }
  
  /**
   * Optimize Core Web Vitals
   */
  static optimizeCoreWebVitals() {
    // Reduce layout shift by setting image dimensions
    document.querySelectorAll('img').forEach(img => {
      if (!img.width || !img.height) {
        img.style.aspectRatio = 'auto';
      }
    });
    
    // Improve First Input Delay
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Load non-critical JavaScript
        this.loadNonCriticalJS();
      });
    }
  }
  
  private static loadNonCriticalJS() {
    // Non-critical scripts are loaded by Firebase Analytics when needed
    // No additional scripts to load here - analytics is handled by Firebase
  }
}

/**
 * Content optimization for AI search
 */
export class ContentOptimizer {
  
  /**
   * Generate AI-optimized content structure
   */
  static generateOptimizedContent(topic: string, keywords: string[]) {
    return {
      headline: this.generateSemanticHeadline(topic, keywords),
      description: this.generateSemanticDescription(topic, keywords),
      keyPoints: this.generateKeyPoints(topic, keywords),
      entities: this.extractEntities(topic)
    };
  }
  
  private static generateSemanticHeadline(topic: string, keywords: string[]): string {
    // AI search optimization: Use natural language and include semantic keywords
    const templates = [
      `Professional ${topic} Services | Expert ${keywords[0]} Solutions`,
      `${topic} Specialists | ${keywords[0]} & ${keywords[1]} Experts`,
      `Get ${topic} Done Right | ${keywords[0]} Professionals`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  }
  
  private static generateSemanticDescription(topic: string, keywords: string[]): string {
    return `Get professional ${topic.toLowerCase()} services from certified experts. We specialize in ${keywords.join(', ')} with fast turnaround times and guaranteed quality. Trusted by thousands of customers nationwide.`;
  }
  
  private static generateKeyPoints(topic: string, keywords: string[]): string[] {
    return [
      `Expert ${topic.toLowerCase()} with 15+ years experience`,
      `Fast delivery: Most projects completed in 3-5 business days`,
      `Compliant with all local building codes and regulations`,
      `Professional ${keywords[0]} designed for permit approval`,
      `Nationwide service with local expertise`,
      `100% satisfaction guarantee`
    ];
  }
  
  private static extractEntities(topic: string): string[] {
    const entityMap: { [key: string]: string[] } = {
      'permit drawings': ['building permits', 'construction documents', 'architectural drawings', 'engineering plans'],
      'deck': ['outdoor living', 'deck construction', 'deck permits', 'deck design'],
      'patio': ['outdoor spaces', 'patio construction', 'hardscaping', 'outdoor entertainment'],
      'pergola': ['outdoor structures', 'shade structures', 'garden structures', 'outdoor design']
    };
    
    return entityMap[topic.toLowerCase()] || [];
  }
}