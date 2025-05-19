
import React from "react";
import ServiceLayout from "@/components/services/ServiceLayout";

const PergolaService = () => {
  return (
    <ServiceLayout
      title="Pergola Drafting Services"
      description="Expert drafting services for pergolas and outdoor structures. Our detailed plans will help you create the perfect outdoor living space while ensuring your structure meets all local building codes."
      image="https://images.unsplash.com/photo-1573742889082-5b8469aea25c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      features={[
        "Custom pergola designs tailored to your space",
        "Structural calculations to ensure stability and safety",
        "Detailed construction drawings for permit applications",
        "Material specifications and quantity lists",
        "Connection details for proper installation",
        "3D visualizations to preview your finished pergola"
      ]}
    >
      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-bold mb-6">Pergola Design Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1508494502647-2aa204346979?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                alt="Traditional Pergola"
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Traditional Pergolas</h3>
              <p className="text-gray-600">Classic designs that complement any outdoor space and provide partial shade while maintaining an open, airy feel.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1547393931-3befd41088dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                alt="Modern Pergola"
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Modern Pergolas</h3>
              <p className="text-gray-600">Contemporary designs featuring clean lines, metal elements, and innovative shade solutions for a stylish outdoor space.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1561124928-eda0e9c603bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                alt="Attached Pergola"
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Attached Pergolas</h3>
              <p className="text-gray-600">Connected to your home to create a seamless outdoor extension of your living space with proper structural integration.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">What's Included in Our Pergola Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 bg-teal-100 rounded-full flex items-center justify-center mt-0.5">
                <svg className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="ml-3 text-base">Detailed foundation and footings plan</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 bg-teal-100 rounded-full flex items-center justify-center mt-0.5">
                <svg className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="ml-3 text-base">Post, beam, and rafter layouts with dimensions</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 bg-teal-100 rounded-full flex items-center justify-center mt-0.5">
                <svg className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="ml-3 text-base">Connection details for all structural elements</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 bg-teal-100 rounded-full flex items-center justify-center mt-0.5">
                <svg className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="ml-3 text-base">Multiple elevation views and cross-sections</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 bg-teal-100 rounded-full flex items-center justify-center mt-0.5">
                <svg className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="ml-3 text-base">Material specifications with recommended options</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 bg-teal-100 rounded-full flex items-center justify-center mt-0.5">
                <svg className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="ml-3 text-base">Detailed annotations and construction notes</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 bg-teal-100 rounded-full flex items-center justify-center mt-0.5">
                <svg className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="ml-3 text-base">Required code references for permit approval</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 bg-teal-100 rounded-full flex items-center justify-center mt-0.5">
                <svg className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="ml-3 text-base">3D renderings to visualize the final structure</p>
            </div>
          </div>
        </section>
      </div>
    </ServiceLayout>
  );
};

export default PergolaService;
