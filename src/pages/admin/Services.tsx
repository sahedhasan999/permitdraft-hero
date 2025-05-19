import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ServiceManagement from '@/components/admin/services/ServiceManagement';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Services = () => {
  const [hasError, setHasError] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [debugMode, setDebugMode] = useState(false);

  const handleRetry = () => {
    setHasError(false);
    setErrorDetails(null);
    window.location.reload();
  };

  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
  };

  useEffect(() => {
    // Add event listener for unhandled errors
    const handleGlobalError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error);
      setErrorDetails(event.error?.toString() || 'Unknown error occurred');
      setHasError(true);
      event.preventDefault();
    };

    window.addEventListener('error', handleGlobalError);
    
    return () => {
      window.removeEventListener('error', handleGlobalError);
    };
  }, []);

  if (hasError) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Service Management</h1>
            <p className="text-muted-foreground mt-1">
              Add, edit, and manage service offerings
            </p>
          </div>
          
          <Alert variant="destructive" className="my-6">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <AlertTitle>Error loading services</AlertTitle>
            <AlertDescription className="mt-2">
              <p>There was a problem loading the service management component.</p>
              <div className="flex gap-2 mt-4">
                <Button 
                  onClick={handleRetry} 
                  variant="outline"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry
                </Button>
                <Button 
                  onClick={toggleDebugMode} 
                  variant="secondary"
                >
                  <Bug className="mr-2 h-4 w-4" />
                  {debugMode ? 'Hide Debug Info' : 'Show Debug Info'}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
          
          {debugMode && errorDetails && (
            <Card>
              <CardHeader>
                <CardTitle>Debug Information</CardTitle>
                <CardDescription>
                  Technical details about the error
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-md overflow-auto max-h-[300px]">
                  <pre className="text-xs">{errorDetails}</pre>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Troubleshooting Steps:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Check if Firebase is properly configured</li>
                    <li>Ensure you have the correct permissions in Firestore</li>
                    <li>Check if the required Firestore indexes are created</li>
                    <li>Try seeding the database with initial services</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Tabs defaultValue="seed">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="seed">Seed Services</TabsTrigger>
              <TabsTrigger value="manual">Manual Fix</TabsTrigger>
            </TabsList>
            <TabsContent value="seed" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Seed Database</CardTitle>
                  <CardDescription>
                    Add sample services to the database
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    If this is your first time setting up the application, you may need to seed the database with initial services.
                  </p>
                  <Button 
                    onClick={() => {
                      // Import and run the seed function
                      import('@/utils/seedServices').then(module => {
                        module.seedServices()
                          .then(() => {
                            alert('Services seeded successfully! Reloading page...');
                            window.location.reload();
                          })
                          .catch(err => {
                            alert(`Error seeding services: ${err.message}`);
                            setErrorDetails(`Error seeding services: ${err.message}`);
                          });
                      });
                    }}
                  >
                    Seed Services
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="manual" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Manual Fix</CardTitle>
                  <CardDescription>
                    Steps to manually resolve the issue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Check the Firebase console to ensure your project is properly set up</li>
                    <li>Verify that Firestore is enabled and has the correct security rules</li>
                    <li>Check if you need to create any Firestore indexes (look for error messages in the console)</li>
                    <li>Ensure your browser has cookies and local storage enabled</li>
                    <li>Try clearing your browser cache and reloading the page</li>
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <ErrorBoundary onError={(error) => {
        setErrorDetails(error?.toString() || 'Unknown error in ServiceManagement component');
        setHasError(true);
      }}>
        <ServiceManagement />
      </ErrorBoundary>
    </AdminLayout>
  );
};

// Enhanced error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: (error?: Error) => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError: (error?: Error) => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error in ServiceManagement component:", error);
    console.error("Component stack:", errorInfo.componentStack);
    this.props.onError(error);
  }

  render() {
    if (this.state.hasError) {
      return null; // The parent component will handle the error UI
    }

    return this.props.children;
  }
}

export default Services;
