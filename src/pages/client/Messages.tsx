
import React, { useEffect } from "react";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ClientMessaging from '@/components/client/messaging/ClientMessaging';
import { useIsMobile } from '@/hooks/use-mobile';

const ClientMessages = () => {
  const isMobile = useIsMobile();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Messages | PermitDraft Pro";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {isMobile ? (
        // Mobile: Fixed dashboard header with scrollable content below
        <div className="pt-16 h-screen flex flex-col">
          {/* Fixed Dashboard Header */}
          <div className="bg-background border-b px-4 py-6 flex-shrink-0">
            <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
            <div className="flex space-x-4">
              <button className="text-muted-foreground hover:text-foreground">Orders</button>
              <button className="text-foreground font-medium border-b-2 border-primary">Messages</button>
            </div>
          </div>
          
          {/* Scrollable Content */}
          <div className="flex-1 overflow-hidden">
            <ClientMessaging />
          </div>
        </div>
      ) : (
        // Desktop: Keep original layout
        <main className="pt-28 lg:pt-32 pb-24">
          <div className="container px-4 mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Messages</h1>
              <p className="text-xl text-muted-foreground">
                Communicate with our team about your projects
              </p>
            </div>
            
            <ClientMessaging />
          </div>
        </main>
      )}
      {!isMobile && <Footer />}
    </div>
  );
};

export default ClientMessages;
