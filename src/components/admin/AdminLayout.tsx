
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard,
  ShoppingCart,
  Users,
  MessageSquare,
  Package,
  FileImage,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useMobile } from '@/hooks/use-mobile';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMobile();
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/admin/dashboard',
      active: location.pathname === '/admin/dashboard'
    },
    { 
      icon: ShoppingCart, 
      label: 'Orders', 
      path: '/admin/orders',
      active: location.pathname === '/admin/orders'
    },
    { 
      icon: Users, 
      label: 'Leads', 
      path: '/admin/leads',
      active: location.pathname === '/admin/leads'
    },
    { 
      icon: MessageSquare, 
      label: 'Communications', 
      path: '/admin/communications',
      active: location.pathname === '/admin/communications'
    },
    { 
      icon: Package, 
      label: 'Services', 
      path: '/admin/services',
      active: location.pathname === '/admin/services'
    },
    { 
      icon: FileImage, 
      label: 'Content', 
      path: '/admin/content',
      active: location.pathname === '/admin/content'
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      path: '/admin/settings',
      active: location.pathname === '/admin/settings'
    }
  ];

  const renderNavLinks = () => (
    <div className="space-y-1">
      {navItems.map((item) => (
        <Link 
          key={item.path} 
          to={item.path}
          onClick={() => setSheetOpen(false)}
          className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
            item.active 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-muted'
          }`}
        >
          <item.icon className="h-5 w-5 mr-3" />
          {item.label}
        </Link>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Navigation */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-background border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link to="/" className="font-semibold text-xl">
                PermitDraftPro
              </Link>
              <div className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                Admin
              </div>
            </div>
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <Link to="/" className="font-semibold text-xl">
                      PermitDraftPro
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setSheetOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-3 mb-6">
                    <Avatar>
                      <AvatarFallback>
                        {user?.name?.charAt(0) || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user?.name || 'Admin User'}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  {renderNavLinks()}
                  <Separator className="my-4" />
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="w-64 border-r bg-card h-screen sticky top-0 overflow-y-auto p-6">
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-semibold text-xl">PermitDraftPro</span>
            </Link>
            
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback>
                  {user?.name?.charAt(0) || 'A'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user?.name || 'Admin User'}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            
            <Separator />
            
            <nav className="space-y-1">
              {renderNavLinks()}
            </nav>
            
            <div className="mt-auto pt-6">
              <Separator className="mb-6" />
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1">
        <main className={`p-6 ${isMobile ? 'mt-16' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
