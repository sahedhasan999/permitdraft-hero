
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  MessageSquare,
  Settings,
  FileText,
  Image,
  LogOut,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive: boolean;
  hasSubmenu?: boolean;
  isSubmenuOpen?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  path,
  isActive,
  hasSubmenu = false,
  isSubmenuOpen = false,
  onClick,
  children
}) => {
  return (
    <div className={cn("mb-1", hasSubmenu && "mb-0")}>
      <Link
        to={path}
        className={cn(
          "flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors",
          isActive
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
        onClick={onClick}
      >
        <span className="mr-3">{icon}</span>
        <span className="flex-1">{label}</span>
        {hasSubmenu && (
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isSubmenuOpen && "transform rotate-180"
            )}
          />
        )}
      </Link>
      {hasSubmenu && isSubmenuOpen && (
        <div className="ml-9 mt-1 space-y-1">{children}</div>
      )}
    </div>
  );
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSubmenu = (menu: string) => {
    setOpenSubmenu(current => (current === menu ? null : menu));
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate('/admin/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar-background border-r border-sidebar-border transition-transform lg:translate-x-0 lg:static lg:w-64",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-sidebar-border">
            <Link to="/admin/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-primary">PermitDraft Pro</span>
            </Link>
          </div>

          <nav className="flex-1 overflow-auto p-3">
            <SidebarItem
              icon={<LayoutDashboard className="h-5 w-5" />}
              label="Dashboard"
              path="/admin/dashboard"
              isActive={isActive('/admin/dashboard')}
            />

            <SidebarItem
              icon={<ShoppingCart className="h-5 w-5" />}
              label="Orders"
              path="/admin/orders"
              isActive={isActive('/admin/orders')}
            />

            <SidebarItem
              icon={<Users className="h-5 w-5" />}
              label="Leads"
              path="/admin/leads"
              isActive={isActive('/admin/leads')}
            />

            <SidebarItem
              icon={<MessageSquare className="h-5 w-5" />}
              label="Communication"
              path="/admin/communication"
              isActive={isActive('/admin/communication')}
            />

            <SidebarItem
              icon={<FileText className="h-5 w-5" />}
              label="Services"
              path="/admin/services"
              isActive={isActive('/admin/services')}
              hasSubmenu={true}
              isSubmenuOpen={openSubmenu === 'services'}
              onClick={() => toggleSubmenu('services')}
            >
              <Link
                to="/admin/services/list"
                className={cn(
                  "flex items-center px-4 py-2 text-sm rounded-md transition-colors",
                  isActive('/admin/services/list')
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                Service List
              </Link>
              <Link
                to="/admin/services/create"
                className={cn(
                  "flex items-center px-4 py-2 text-sm rounded-md transition-colors",
                  isActive('/admin/services/create')
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                Create Service
              </Link>
            </SidebarItem>

            <SidebarItem
              icon={<Image className="h-5 w-5" />}
              label="Content"
              path="/admin/content"
              isActive={isActive('/admin/content')}
              hasSubmenu={true}
              isSubmenuOpen={openSubmenu === 'content'}
              onClick={() => toggleSubmenu('content')}
            >
              <Link
                to="/admin/content/hero-images"
                className={cn(
                  "flex items-center px-4 py-2 text-sm rounded-md transition-colors",
                  isActive('/admin/content/hero-images')
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                Hero Images
              </Link>
            </SidebarItem>

            <SidebarItem
              icon={<Settings className="h-5 w-5" />}
              label="Settings"
              path="/admin/settings"
              isActive={isActive('/admin/settings')}
            />
          </nav>

          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                <span className="text-primary font-semibold">
                  {user?.name.charAt(0) || 'A'}
                </span>
              </div>
              <div>
                <p className="font-medium text-sm">{user?.name || 'Admin'}</p>
                <p className="text-xs text-sidebar-foreground/70">{user?.email || 'admin@example.com'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-sm font-medium rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-card border-b border-border sticky top-0 z-40">
          <div className="px-4 h-16 flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-accent"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            <div className="ml-auto flex items-center space-x-4">
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-foreground"
                target="_blank"
              >
                View Website
              </Link>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
