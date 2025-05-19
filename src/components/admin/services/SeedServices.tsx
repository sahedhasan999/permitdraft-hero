import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Database, AlertTriangle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { seedServices } from '@/utils/seedServices';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface SeedServicesProps {
  errorMessage?: string;
}

const SeedServices: React.FC<SeedServicesProps> = ({ errorMessage }) => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedError, setSeedError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSeedServices = async () => {
    if (isSeeding) return;

    setIsSeeding(true);
    setSeedError(null);
    
    try {
      await seedServices();
      toast({
        title: 'Services seeded successfully',
        description: 'Initial services have been added to the database.',
      });
      
      // Reload the page to show the new services
      window.location.reload();
    } catch (error) {
      console.error('Error seeding services:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setSeedError(errorMessage);
      toast({
        title: 'Error seeding services',
        description: 'There was a problem adding the initial services.',
        variant: 'destructive',
      });
    } finally {
      setIsSeeding(false);
    }
  };

  // Check if the error is related to Firestore indexes
  const isIndexError = errorMessage?.includes('index') || errorMessage?.includes('indexes');
  const hasFirebaseConsoleLink = errorMessage?.includes('https://console.firebase.google.com');
  
  // Extract Firebase console URL if present
  const extractFirebaseConsoleUrl = () => {
    if (!errorMessage) return null;
    const urlMatch = errorMessage.match(/(https:\/\/console\.firebase\.google\.com[^\s]+)/);
    return urlMatch && urlMatch[1] ? urlMatch[1] : null;
  };
  
  const firebaseConsoleUrl = extractFirebaseConsoleUrl();
  
  // Safe error message display
  const safeErrorMessage = errorMessage || 'An unknown error occurred';
  const safeSeedError = seedError || '';

  return (
    <div className="space-y-4">
      {errorMessage && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error fetching services</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{safeErrorMessage}</p>
            
            {isIndexError && (
              <div className="mt-2 p-3 bg-background rounded-md">
                <p className="font-medium">This appears to be a Firestore index issue.</p>
                <p className="text-sm mt-1">
                  Firebase requires special indexes for complex queries. You can either:
                </p>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  <li>Click the link in the error message to create the required index</li>
                  <li>Use the "Seed Services" button below to add services without complex queries</li>
                </ul>
                {firebaseConsoleUrl && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={() => {
                      window.open(firebaseConsoleUrl, '_blank');
                    }}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Firebase Console
                  </Button>
                )}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      {seedError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error seeding services</AlertTitle>
          <AlertDescription>
            <p>{safeSeedError}</p>
            {safeSeedError.includes('permission-denied') && (
              <div className="mt-2 p-3 bg-background rounded-md">
                <p className="font-medium">This appears to be a permissions issue.</p>
                <p className="text-sm mt-1">
                  Make sure you are logged in as an admin user and have the correct permissions in Firestore.
                </p>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="bg-muted p-6 rounded-md border border-border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium">No services found</h3>
            <p className="text-muted-foreground mt-1">
              Would you like to add some initial services to get started?
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This will add 5 sample services to your database: Deck Drawing, Patio Design, Pergola Blueprints, Outdoor Kitchen, and Home Addition.
            </p>
          </div>
          <Button 
            onClick={handleSeedServices} 
            disabled={isSeeding}
            size="lg"
            className="md:self-start"
          >
            {isSeeding ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Seeding...
              </>
            ) : (
              <>
                <Database className="mr-2 h-5 w-5" />
                Seed Services
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SeedServices; 