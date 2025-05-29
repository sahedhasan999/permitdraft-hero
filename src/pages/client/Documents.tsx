import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useFirebase } from '@/contexts/FirebaseContext';
import { getUserOrders, Order } from '@/services/orderService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, FileText, Image, FileIcon, Eye, Upload, Trash2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Document type interface
interface Document {
  id: string;
  orderId: string;
  name: string;
  type: 'pdf' | 'image' | 'doc' | 'other';
  size: string;
  uploadDate: string;
  downloadUrl: string;
  category: 'plans' | 'permits' | 'invoices' | 'correspondence';
}

const ClientDocuments = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useFirebase();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Documents | PermitDraft Pro";
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        setIsLoading(false);
        return;
      }

      try {
        const userOrders = await getUserOrders(currentUser.uid, currentUser.email);
        setOrders(userOrders);
        
        // Mock documents for demonstration
        const mockDocuments: Document[] = [
          {
            id: 'doc-1',
            orderId: userOrders.length > 0 ? userOrders[0].id : 'N/A',
            name: 'Architectural Plans',
            type: 'pdf',
            size: '2.5 MB',
            uploadDate: '2024-01-20',
            downloadUrl: '#',
            category: 'plans',
          },
          {
            id: 'doc-2',
            orderId: userOrders.length > 0 ? userOrders[0].id : 'N/A',
            name: 'Permit Application',
            type: 'pdf',
            size: '1.8 MB',
            uploadDate: '2024-01-15',
            downloadUrl: '#',
            category: 'permits',
          },
          {
            id: 'doc-3',
            orderId: userOrders.length > 0 ? userOrders[0].id : 'N/A',
            name: 'Invoice #12345',
            type: 'pdf',
            size: '0.9 MB',
            uploadDate: '2024-01-10',
            downloadUrl: '#',
            category: 'invoices',
          },
        ];
        setDocuments(mockDocuments);
      } catch (error) {
        console.log('Error fetching data:', error);
        toast({
          title: "Error fetching data",
          description: "Could not load your documents. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUser, toast]);

  const handleDocumentClick = (document: Document) => {
    setSelectedDocument(document);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setSelectedDocument(null);
  };

  const getFileIconComponent = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-4 w-4 mr-2 text-red-500" />;
      case 'image':
        return <Image className="h-4 w-4 mr-2 text-blue-500" />;
      case 'doc':
        return <FileIcon className="h-4 w-4 mr-2 text-gray-500" />;
      default:
        return <FileIcon className="h-4 w-4 mr-2 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 lg:pt-32 pb-24">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Your Documents</h1>
            <p className="text-lg text-muted-foreground mb-8 text-center">
              Access all your project-related documents in one place.
            </p>

            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {orders.map(order => (
                  <Card key={order.id}>
                    <CardHeader>
                      <CardTitle>Order #{order.id.substring(0, 8).toUpperCase()}</CardTitle>
                      <CardDescription>Project: {order.projectType}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <h3 className="text-lg font-medium">Documents</h3>
                      <ul className="space-y-2">
                        {documents
                          .filter(doc => doc.orderId === order.id)
                          .map(document => (
                            <li key={document.id} className="flex items-center justify-between">
                              <div className="flex items-center">
                                {getFileIconComponent(document.type)}
                                <span>{document.name}</span>
                              </div>
                              <div className="space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => handleDocumentClick(document)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Preview
                                </Button>
                                <Button variant="secondary" size="sm">
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </Button>
                              </div>
                            </li>
                          ))}
                        {documents.filter(doc => doc.orderId === order.id).length === 0 && (
                          <li className="text-muted-foreground">No documents found for this order.</li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
                {orders.length === 0 && (
                  <div className="text-center text-muted-foreground">
                    No orders found.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />

      {/* Preview Modal */}
      {selectedDocument && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${isPreviewOpen ? '' : 'hidden'}`}>
          <div className="bg-white rounded-lg max-w-3xl max-h-screen overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Document Preview</h2>
              <Button variant="ghost" size="icon" onClick={handleClosePreview}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="border-t pt-4">
              {selectedDocument.type === 'image' ? (
                <img src={selectedDocument.downloadUrl} alt={selectedDocument.name} className="w-full" />
              ) : (
                <p>Preview not available for {selectedDocument.type} files. Please download to view.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDocuments;

