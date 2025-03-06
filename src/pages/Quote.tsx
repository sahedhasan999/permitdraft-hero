
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CheckCircle } from "lucide-react";

const projectTypes = [
  { id: 'deck', name: 'Deck' },
  { id: 'patio', name: 'Patio' },
  { id: 'pergola', name: 'Pergola' },
  { id: 'outdoor-kitchen', name: 'Outdoor Kitchen' },
  { id: 'home-addition', name: 'Home Addition/ADU' },
];

interface FormData {
  projectType: string;
  squareFootage: string;
  email: string;
  name: string;
  phone: string;
  timeline: string;
  additionalDetails: string;
}

const Quote = () => {
  const [formData, setFormData] = useState<FormData>({
    projectType: '',
    squareFootage: '',
    email: '',
    name: '',
    phone: '',
    timeline: 'asap',
    additionalDetails: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Get a Quote | PermitDraft Pro";
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast({
        title: "Quote Request Submitted",
        description: "We'll be in touch with you shortly.",
      });
      // Reset form after submission (in a real app, you'd likely redirect)
      setFormData({
        projectType: '',
        squareFootage: '',
        email: '',
        name: '',
        phone: '',
        timeline: 'asap',
        additionalDetails: '',
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 lg:pt-32 pb-24">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Get a Custom Quote</h1>
            <p className="text-lg text-muted-foreground mb-8 text-center">
              Tell us about your project and we'll provide a competitive quote for our architectural drafting services.
            </p>

            {submitted ? (
              <div className="bg-teal-50 rounded-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-16 w-16 text-teal-500" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
                <p className="text-lg mb-6">
                  Your quote request has been submitted successfully. One of our experts will review your project details and get back to you within 24 hours.
                </p>
                <AnimatedButton 
                  variant="primary"
                  onClick={() => setSubmitted(false)}
                >
                  Submit Another Request
                </AnimatedButton>
              </div>
            ) : (
              <form 
                onSubmit={handleSubmit} 
                className="bg-white rounded-lg shadow-md p-6 md:p-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Project Type<span className="text-red-500">*</span>
                    </label>
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                      required
                    >
                      <option value="">Select Project Type</option>
                      {projectTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Area in Square Feet<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="squareFootage"
                      value={formData.squareFootage}
                      onChange={handleChange}
                      placeholder="e.g. 500"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                      required
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Full Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(123) 456-7890"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Project Timeline
                    </label>
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                    >
                      <option value="asap">As soon as possible</option>
                      <option value="1-2-weeks">1-2 weeks</option>
                      <option value="1-month">Within a month</option>
                      <option value="2-3-months">2-3 months</option>
                      <option value="planning">Just planning</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Additional Details
                    </label>
                    <textarea
                      name="additionalDetails"
                      value={formData.additionalDetails}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Tell us more about your project, special requirements, or questions..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                    ></textarea>
                  </div>
                </div>

                <div className="mt-8">
                  <AnimatedButton
                    variant="primary"
                    size="lg"
                    fullWidth
                    isLoading={isSubmitting}
                    type="submit"
                  >
                    Submit Request
                  </AnimatedButton>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Quote;
