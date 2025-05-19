
import React from "react";
import ServiceLayout from "@/components/services/ServiceLayout";

const OutdoorKitchenService = () => {
  return (
    <ServiceLayout
      title="Outdoor Kitchen Drafting Services"
      description="Professional drafting services for outdoor kitchens and entertainment areas. Our detailed plans include all components needed for a functional and beautiful outdoor cooking space."
      image="https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      features={[
        "Complete layout and construction drawings",
        "Utility planning for water, gas, and electrical",
        "Custom countertop and cabinet designs",
        "Appliance integration specifications",
        "Material selection guidance for outdoor durability",
        "3D renderings to visualize your finished kitchen"
      ]}
    >
      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-bold mb-6">Design Considerations for Outdoor Kitchens</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Layout & Workflow</h3>
              <p className="text-gray-600">We design your outdoor kitchen with proper work zones and traffic flow for efficient cooking and entertaining.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Utilities & Services</h3>
              <p className="text-gray-600">Our plans include detailed specifications for plumbing, electrical, and gas connections to power your outdoor kitchen.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Materials & Finishes</h3>
              <p className="text-gray-600">We specify weather-resistant materials and finishes to ensure your outdoor kitchen lasts for years to come.</p>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-6">Popular Outdoor Kitchen Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Built-in Grills</h3>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Pizza Ovens</h3>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Refrigeration</h3>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Bar Areas</h3>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">Our Design Process</h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-teal-100 transform -translate-x-1/2"></div>
            
            {/* Timeline items */}
            <div className="space-y-12">
              <div className="relative">
                <div className="flex items-center mb-4">
                  <div className="absolute left-6 md:left-1/2 w-4 h-4 bg-teal-500 rounded-full transform -translate-x-1/2"></div>
                  <div className="ml-12 md:ml-0 md:absolute md:left-1/2 md:ml-8">
                    <h3 className="text-xl font-semibold">Initial Consultation</h3>
                  </div>
                </div>
                <div className="ml-12 md:ml-0 md:grid md:grid-cols-2 md:gap-12">
                  <div className="md:text-right md:pr-8">
                    <p className="text-gray-600">We discuss your needs, cooking style, and entertainment preferences to understand what you're looking for in an outdoor kitchen.</p>
                  </div>
                  <div className="hidden md:block"></div>
                </div>
              </div>
              
              <div className="relative">
                <div className="flex items-center mb-4">
                  <div className="absolute left-6 md:left-1/2 w-4 h-4 bg-teal-500 rounded-full transform -translate-x-1/2"></div>
                  <div className="ml-12 md:ml-0 md:absolute md:left-1/2 md:ml-8">
                    <h3 className="text-xl font-semibold">Preliminary Design</h3>
                  </div>
                </div>
                <div className="ml-12 md:ml-0 md:grid md:grid-cols-2 md:gap-12">
                  <div className="hidden md:block"></div>
                  <div className="md:pl-8">
                    <p className="text-gray-600">We create initial layout concepts and 3D visualizations for your review and feedback.</p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="flex items-center mb-4">
                  <div className="absolute left-6 md:left-1/2 w-4 h-4 bg-teal-500 rounded-full transform -translate-x-1/2"></div>
                  <div className="ml-12 md:ml-0 md:absolute md:left-1/2 md:ml-8">
                    <h3 className="text-xl font-semibold">Detailed Design</h3>
                  </div>
                </div>
                <div className="ml-12 md:ml-0 md:grid md:grid-cols-2 md:gap-12">
                  <div className="md:text-right md:pr-8">
                    <p className="text-gray-600">We refine the design based on your feedback, adding detailed specifications for materials, appliances, and utilities.</p>
                  </div>
                  <div className="hidden md:block"></div>
                </div>
              </div>
              
              <div className="relative">
                <div className="flex items-center mb-4">
                  <div className="absolute left-6 md:left-1/2 w-4 h-4 bg-teal-500 rounded-full transform -translate-x-1/2"></div>
                  <div className="ml-12 md:ml-0 md:absolute md:left-1/2 md:ml-8">
                    <h3 className="text-xl font-semibold">Final Documentation</h3>
                  </div>
                </div>
                <div className="ml-12 md:ml-0 md:grid md:grid-cols-2 md:gap-12">
                  <div className="hidden md:block"></div>
                  <div className="md:pl-8">
                    <p className="text-gray-600">We create complete construction drawings and documentation required for permitting and building your outdoor kitchen.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ServiceLayout>
  );
};

export default OutdoorKitchenService;
