
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { GlassMorphismCard } from "@/components/ui/GlassMorphismCard";
import Navbar from "@/components/layout/Navbar";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = "404 - Page Not Found | PermitDraft Pro";
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-grow flex items-center justify-center py-20">
        <div className="container px-4 mx-auto">
          <div className="max-w-lg mx-auto">
            <GlassMorphismCard variant="default" className="text-center">
              <div className="mb-6">
                <div className="inline-flex rounded-full bg-primary/10 p-4">
                  <div className="rounded-full bg-white p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary">
                      <circle cx="12" cy="12" r="10" />
                      <path d="m15 9-6 6" />
                      <path d="m9 9 6 6" />
                    </svg>
                  </div>
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-2">404</h1>
              <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
              <p className="text-muted-foreground mb-8">
                The page you are looking for doesn't exist or has been moved. Let's get you back on track.
              </p>
              <Link to="/">
                <AnimatedButton
                  variant="primary"
                  size="lg"
                  iconLeft={<ArrowLeft size={16} />}
                >
                  Return to Home
                </AnimatedButton>
              </Link>
            </GlassMorphismCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
