import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ClientMessaging from '@/components/client/messaging/ClientMessaging';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChatClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setIsOpen(true);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={handleChatClick}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 p-0"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6 text-primary-foreground" />
      </Button>

      {/* Chat Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl h-[85vh] sm:h-[80vh] p-0 m-2 sm:m-4">
          <DialogHeader className="p-3 sm:p-4 border-b bg-primary">
            <DialogTitle className="flex items-center justify-between">
              <span className="text-primary-foreground font-semibold">Messages</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <ClientMessaging />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingChatButton;