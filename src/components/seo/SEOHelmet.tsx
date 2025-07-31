import { useEffect } from 'react';

interface SEOHelmetProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  noindex?: boolean;
  structuredData?: any;
}

/**
 * SEO Helmet component for dynamic meta tag management
 * Optimized for Google's latest ranking factors
 */
export const SEOHelmet: React.FC<SEOHelmetProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  noindex = false,
  structuredData
}) => {
  useEffect(() => {
    // Update title
    if (title) {
      document.title = title;
    }
    
    // Update meta description
    if (description) {
      updateMetaTag('description', description);
    }
    
    // Update keywords
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }
    
    // Update canonical URL
    if (canonicalUrl) {
      updateLinkTag('canonical', canonicalUrl);
    }
    
    // Update robots
    updateMetaTag('robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    
    // Update Open Graph tags
    if (title) {
      updateMetaProperty('og:title', title);
      updateMetaProperty('twitter:title', title);
    }
    
    if (description) {
      updateMetaProperty('og:description', description);
      updateMetaProperty('twitter:description', description);
    }
    
    if (ogImage) {
      updateMetaProperty('og:image', ogImage);
      updateMetaProperty('twitter:image', ogImage);
    }
    
    updateMetaProperty('og:url', window.location.href);
    
    // Add structured data
    if (structuredData) {
      addStructuredData(structuredData);
    }
    
  }, [title, description, keywords, canonicalUrl, ogImage, noindex, structuredData]);
  
  const updateMetaTag = (name: string, content: string) => {
    let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = name;
      document.head.appendChild(meta);
    }
    meta.content = content;
  };
  
  const updateMetaProperty = (property: string, content: string) => {
    let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.content = content;
  };
  
  const updateLinkTag = (rel: string, href: string) => {
    let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = rel;
      document.head.appendChild(link);
    }
    link.href = href;
  };
  
  const addStructuredData = (data: any) => {
    // Remove existing structured data
    const existing = document.querySelectorAll('script[type="application/ld+json"]');
    existing.forEach(script => {
      if (script.textContent?.includes('"@context"')) {
        script.remove();
      }
    });
    
    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  };
  
  return null; // This component doesn't render anything
};