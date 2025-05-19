import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '@/contexts/FirebaseContext';
import { calculatePrice, createOrder, AdditionalService } from '@/services/orderService';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, DollarSign, CheckCircle2 } from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter 
} from '@/components/ui/card';

const projectTypes = [
  'Deck',
  'Patio',
  'Pool',
  'Shed',
  'Garage',
  'Addition',
  'Other'
];

interface FormData {
  projectType: string;
  squareFootage: string;
  email: string;
  name: string;
  phone: string;
  additionalDetails: string;
  additionalServices: AdditionalService;
}

const Order = () => {
  const [formData, setFormData] = useState<FormData>({
    projectType: '',
    squareFootage: '',
    email: '',
    name: '',
    phone: '',
    additionalDetails: '',
    additionalServices: {
      sitePlan: false,
      materialList: false,
      render3D: false
    }
  });
  
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentUser } = useFirebase();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Start Your Project | PermitDraft Pro";
    
    // Set user data if logged in
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        email: currentUser.email || '',
        name: currentUser.displayName || ''
      }));
    }
  }, [currentUser]);

  // Update price whenever form data changes
  useEffect(() => {
    if (formData.squareFootage) {
      const sqft = parseInt(formData.squareFootage);
      if (!isNaN(sqft) && sqft > 0) {
        const price = calculatePrice(sqft, formData.additionalServices);
        setCurrentPrice(price);
      } else {
        setCurrentPrice(0);
      }
    } else {
      setCurrentPrice(0);
    }
  }, [formData.squareFootage, formData.additionalServices]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAdditionalServiceChange = (service: keyof AdditionalService) => {
    setFormData(prev => ({
      ...prev,
      additionalServices: {
        ...prev.additionalServices,
        [service]: !prev.additionalServices[service]
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({ title: "Error", description: "Please provide your name", variant: "destructive" });
      return;
    }
    
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({ title: "Error", description: "Please provide a valid email address", variant: "destructive" });
      return;
    }
    
    if (!formData.phone.trim()) {
      toast({ title: "Error", description: "Please provide your phone number", variant: "destructive" });
      return;
    }
    
    if (!formData.projectType) {
      toast({ title: "Error", description: "Please select a project type", variant: "destructive" });
      return;
    }
    
    const sqft = parseInt(formData.squareFootage);
    if (isNaN(sqft) || sqft <= 0) {
      toast({ title: "Error", description: "Please provide a valid square footage", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      if (!currentUser) {
        // Redirect to login or registration first
        // Store form data in session for later retrieval
        sessionStorage.setItem('pendingOrder', JSON.stringify(formData));
        toast({
          title: "Login Required",
          description: "Please log in or create an account to proceed with your order."
        });
        navigate('/login', { state: { redirectAfterLogin: '/order' } });
        return;
      }

      // Create order in Firestore
      await createOrder(currentUser.uid, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        projectType: formData.projectType,
        squareFootage: sqft,
        additionalServices: formData.additionalServices
      });
      
      toast({
        title: "Success",
        description: "Your order has been placed successfully! Redirecting to payment..."
      });

      // Redirect to payment page (to be implemented later)
      // For now, just redirect to client dashboard
      navigate('/client/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAdditionalServicePrice = (service: keyof AdditionalService) => {
    switch (service) {
      case 'sitePlan':
        return 100;
      case 'materialList':
        return 50;
      case 'render3D':
        return 150;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 lg:pt-32 pb-24">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Start Your Project</h1>
            <p className="text-lg text-muted-foreground mb-8 text-center">
              Complete your order by providing the details below.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Order Form */}
              <div className="md:col-span-2">
                <form 
                  onSubmit={handleSubmit} 
                  className="bg-white rounded-lg shadow-md p-6 md:p-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Label htmlFor="projectType">Project Type<span className="text-red-500">*</span></Label>
                      <select
                        id="projectType"
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                        required
                      >
                        <option value="">Select Project Type</option>
                        {projectTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="squareFootage">Area in Square Feet<span className="text-red-500">*</span></Label>
                      <Input
                        id="squareFootage"
                        type="number"
                        name="squareFootage"
                        value={formData.squareFootage}
                        onChange={handleChange}
                        className="mt-1"
                        placeholder="e.g. 500"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="name">Name<span className="text-red-500">*</span></Label>
                      <Input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1"
                        placeholder="Your full name"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email<span className="text-red-500">*</span></Label>
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1"
                        placeholder="Your email address"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="phone">Phone Number<span className="text-red-500">*</span></Label>
                      <Input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="mt-1"
                        placeholder="Your phone number"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="additionalDetails">Additional Details</Label>
                      <Textarea
                        id="additionalDetails"
                        name="additionalDetails"
                        value={formData.additionalDetails}
                        onChange={handleChange}
                        className="mt-1"
                        placeholder="Any additional information about your project"
                        rows={3}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label className="text-lg font-medium mb-3 block">Additional Services</Label>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="sitePlan"
                            checked={formData.additionalServices.sitePlan}
                            onCheckedChange={() => handleAdditionalServiceChange('sitePlan')}
                          />
                          <div>
                            <Label htmlFor="sitePlan" className="font-medium">Site Plan</Label>
                            <p className="text-sm text-muted-foreground">Detailed layout of your property (+$100)</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="materialList"
                            checked={formData.additionalServices.materialList}
                            onCheckedChange={() => handleAdditionalServiceChange('materialList')}
                          />
                          <div>
                            <Label htmlFor="materialList" className="font-medium">Material List</Label>
                            <p className="text-sm text-muted-foreground">Comprehensive list of required materials (+$50)</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="render3D"
                            checked={formData.additionalServices.render3D}
                            onCheckedChange={() => handleAdditionalServiceChange('render3D')}
                          />
                          <div>
                            <Label htmlFor="render3D" className="font-medium">3D Rendering</Label>
                            <p className="text-sm text-muted-foreground">Visualize your completed project (+$150)</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Order Summary */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                    <CardDescription>Review your order details</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium">Basic Services</h3>
                        <div className="flex justify-between mt-2 text-sm">
                          <span>Architectural Drafting</span>
                          <span>${formData.squareFootage ? (
                            parseInt(formData.squareFootage) <= 200 ? 150 :
                            parseInt(formData.squareFootage) <= 400 ? 200 :
                            parseInt(formData.squareFootage) <= 600 ? 300 :
                            parseInt(formData.squareFootage) <= 1000 ? 500 : 750
                          ) : 0}</span>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium">Additional Services</h3>
                        {Object.entries(formData.additionalServices).map(([key, value]) => (
                          value && (
                            <div key={key} className="flex justify-between mt-2 text-sm">
                              <span>{key === 'sitePlan' ? 'Site Plan' : 
                                     key === 'materialList' ? 'Material List' : 
                                     '3D Rendering'}</span>
                              <span>+${getAdditionalServicePrice(key as keyof AdditionalService)}</span>
                            </div>
                          )
                        ))}
                        
                        {!Object.values(formData.additionalServices).some(v => v) && (
                          <div className="mt-2 text-sm text-muted-foreground">No additional services selected</div>
                        )}
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span>${currentPrice}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={handleSubmit}
                      disabled={isSubmitting || currentPrice === 0}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <DollarSign className="mr-2 h-4 w-4" />
                          Proceed to Payment
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Order; 