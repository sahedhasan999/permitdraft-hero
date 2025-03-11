import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, Files, MessageSquare, Package, LayoutDashboard, 
  ClipboardList, Menu, LogOut, ChevronDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Orders', href: '/admin/orders', icon: ClipboardList },
  { name: 'Leads', href: '/admin/leads', icon: Users },
  { name: 'Communications', href: '/admin/communications', icon: MessageSquare },
  { name: 'Services', href: '/admin/services', icon: Package },
  { name: 'Content', href: '/admin/content', icon: Files },
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin area.",
        variant: "destructive",
      });
      navigate('/', { replace: true });
    }
  }, [user, isAdmin, navigate, toast]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Failed to log out', error);
      toast({
        title: "Logout Failed",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-center mb-6">
          You don't have permission to access the admin area.
        </p>
        <Button onClick={() => navigate('/')}>Return to Homepage</Button>
      </div>
    );
  }

  const getInitials = () => {
    if (user?.displayName) {
      return user.displayName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase();
    }
    return user?.email?.slice(0, 2).toUpperCase() || 'A';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:pt-16 border-r">
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors",
                      location.pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="px-4 py-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={user?.photoURL || ''} />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user?.displayName || user?.email}</p>
                    <p className="text-xs text-muted-foreground">Admin</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:pl-64 flex flex-col flex-1 w-full">
          <main className="flex-1 pt-16 pb-8 px-4 md:px-6">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
