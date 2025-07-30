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
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-teal-600 hover:bg-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 p-0"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>

      {/* Chat Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-5xl w-[95vw] h-[95vh] p-0 m-0 sm:m-2">
          {/* Compact header with dashboard info moved up */}
          <DialogHeader className="p-2 border-b bg-teal-600 flex-shrink-0">
            <DialogTitle className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-white font-semibold text-sm">PermitDraftPro</span>
                <span className="text-white/80 text-xs">Your Dashboard - Messages</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {/* Chat area taking full width */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <ClientMessaging />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingChatButton;