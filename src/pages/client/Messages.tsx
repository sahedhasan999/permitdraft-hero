
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
      {!isMobile && <Footer />}
    </div>
  );
};

export default ClientMessages;
