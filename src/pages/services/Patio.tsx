
import React, { useEffect } from "react";
import ServiceLayout from "@/components/services/ServiceLayout";

const PatioService = () => {
  const description = "Expert drafting for patio permit drawings and hardscapes. Our detailed plans help you visualize your project and secure permits with confidence.";

  useEffect(() => {
    const metaDescriptionTag = document.querySelector('meta[name="description"]');
    if (metaDescriptionTag) {
      metaDescriptionTag.setAttribute("content", description);
    } else {
      const newMetaTag = document.createElement('meta');
      newMetaTag.name = "description";
      newMetaTag.content = description;
      document.head.appendChild(newMetaTag);
    }
  }, []);

  return (
    <ServiceLayout
      title="Patio Permit Drawings & Hardscape Designs"
      description={description}
      image="https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      features={[
        "Complete construction drawings for permit applications",
        "Detailed hardscape and drainage plans",
        "Material selection assistance and specifications",
        "3D visualizations to preview your finished patio",
        "Construction details for contractors",
        "Fast turnaround times to keep your project moving"
      ]}
    >
      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-bold mb-6">Our Patio Design Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="text-teal-600 text-4xl font-bold mb-4">01</div>
              <h3 className="text-xl font-semibold mb-2">Consultation</h3>
              <p className="text-gray-600">We start by understanding your needs, preferences, and site conditions to create a design that fits your space perfectly.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="text-teal-600 text-4xl font-bold mb-4">02</div>
              <h3 className="text-xl font-semibold mb-2">Initial Design</h3>
              <p className="text-gray-600">We create preliminary designs for your review, including layout, materials, and special features like fire pits or water features.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="text-teal-600 text-4xl font-bold mb-4">03</div>
              <h3 className="text-xl font-semibold mb-2">Final Documents</h3>
              <p className="text-gray-600">After your approval, we finalize all construction documents needed for permitting and construction of your patio project.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">Patio Types We Design</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="mb-4">
                <svg className="h-10 w-10 text-teal-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Concrete Patios</h3>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="mb-4">
                <svg className="h-10 w-10 text-teal-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Pavers & Flagstone</h3>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="mb-4">
                <svg className="h-10 w-10 text-teal-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Brick Patios</h3>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="mb-4">
                <svg className="h-10 w-10 text-teal-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Multi-Level Patios</h3>
            </div>
          </div>
        </section>
      </div>
    </ServiceLayout>
  );
};

export default PatioService;
