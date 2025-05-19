import React, { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { CheckCircle, Upload, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useNavigate } from 'react-router-dom';
import { createLead, validateLeadData } from '@/services/leadsService';
import { notifyNewLead } from '@/services/notificationService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

const projectTypes = [
  'Deck',
  'Patio',
  'Pool',
  'Shed',
  'Garage',
  'Addition',
  'Other'
];

const budgetRanges = [
  'Under $5,000',
  '$5,000 - $10,000',
  '$10,000 - $25,000',
  '$25,000 - $50,000',
  'Over $50,000'
];

const timelineOptions = [
  'Within 1 month',
  '1-3 months',
  '3-6 months',
  '6-12 months',
  'Over 12 months'
];

interface FormData {
  projectType: string;
  squareFootage: string;
  email: string;
  name: string;
  phone: string;
  timeline: string;
  additionalDetails: string;
  files: File[];
}

interface FileWithPreview extends File {
  preview?: string;
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
    files: [],
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Get a Quote | PermitDraft Pro";
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    const validation = validateLeadData(formData);
    if (!validation.isValid) {
      validation.errors.forEach(error => toast({
        title: "Validation Error",
        description: error,
        variant: "destructive"
      }));
      return;
    }

    setIsSubmitting(true);
    try {
      // createLead now handles file uploads to the Clients_Attachement folder
      const leadId = await createLead(formData);
      await notifyNewLead(leadId, formData.name);
      
      toast({
        title: "Success",
        description: "Quote request submitted successfully! We will contact you soon."
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit quote request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      addFiles(newFiles);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      addFiles(newFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    // Add new files to the existing files array
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...newFiles]
    }));

    // Show success toast
    toast({
      title: "Files Added",
      description: `${newFiles.length} file(s) added successfully.`,
    });
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'heic':
        return <FileText className="h-6 w-6 text-green-500" />;
      default:
        return <FileText className="h-6 w-6 text-gray-500" />;
    }
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
                        <option key={type} value={type}>{type}</option>
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

                  {/* File Upload Section */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Upload Project Documents
                    </label>
                    <div 
                      className={cn(
                        "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                        dragActive ? "border-teal-500 bg-teal-50" : "border-gray-300 hover:border-teal-400",
                      )}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        Drag & drop files here or <span className="text-teal-600 font-medium">browse</span>
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Accepted file types: PDF, DOC, DOCX, JPG, JPEG, PNG, HEIC
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.heic"
                      />
                    </div>

                    {/* File List */}
                    {formData.files.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm font-medium">Attached Files ({formData.files.length})</p>
                        <div className="max-h-48 overflow-y-auto space-y-2 p-2 border rounded-md">
                          {formData.files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <div className="flex items-center space-x-2">
                                {getFileIcon(file.name)}
                                <div className="truncate max-w-[200px] sm:max-w-xs">
                                  <p className="text-sm truncate">{file.name}</p>
                                  <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                                </div>
                              </div>
                              <button 
                                type="button" 
                                className="text-gray-500 hover:text-red-500"
                                onClick={() => removeFile(index)}
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Quote Request'
                    )}
                  </Button>
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
