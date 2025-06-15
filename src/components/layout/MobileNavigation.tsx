
import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import NavLink, { NavLinkItem } from "./NavLink";
import { useAuth } from "@/contexts/AuthContext";

interface MobileNavigationProps {
  isMenuOpen: boolean;
  navLinks: NavLinkItem[];
  activeDropdown: string | null;
  setActiveDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  closeDropdown: () => void;
  toggleMenu: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = memo(({
  isMenuOpen,
  navLinks,
  activeDropdown,
  setActiveDropdown,
  closeDropdown,
  toggleMenu
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleStartProject = () => {
    if (user) {
      // If logged in, go directly to order page
      navigate('/order');
    } else {
      // If not logged in, redirect to login with state that indicates to show signup immediately
      navigate('/login', { 
        state: { 
          redirectTo: '/',
          showSignUp: true
        } 
      });
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const handleDashboard = () => {
    navigate('/client/dashboard');
  };

  if (!isMenuOpen) return null;

  return (
    <div className="md:hidden py-6 bg-background/95 backdrop-blur-lg border-t animate-fade-down shadow-lg">
      <div className="container px-6 mx-auto">
        <nav className="flex flex-col space-y-3">
          {navLinks.map((link) => (
            <div key={link.title} className="text-center">
              <NavLink
                link={link}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
                closeDropdown={closeDropdown}
                mobile={true}
                onMenuItemClick={toggleMenu}
              />
            </div>
          ))}
        </nav>

        <div className="mt-8 space-y-4 px-2">
          <button
            className="w-full bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg text-base font-medium transition-colors shadow-md hover:shadow-lg"
            onClick={() => {
              toggleMenu();
              handleStartProject();
            }}
          >
            {user ? 'Start a Project' : 'Start Your Project'}
          </button>
          
          {user ? (
            <div className="space-y-3">
              <button 
                onClick={() => {
                  toggleMenu();
                  handleDashboard();
                }}
                className="block w-full text-center py-3 px-4 text-base font-medium hover:text-teal-600 transition-colors flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-lg"
              >
                <User size={18} className="mr-2" />
                My Dashboard
              </button>
              <button 
                onClick={() => {
                  toggleMenu();
                  handleLogout();
                }}
                className="block w-full text-center py-3 px-4 text-base font-medium hover:text-teal-600 transition-colors flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-lg"
              >
                <LogOut size={18} className="mr-2" />
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={() => {
                toggleMenu();
                handleLogin();
              }}
              className="block w-full text-center py-3 px-4 text-base font-medium hover:text-teal-600 transition-colors bg-gray-50 hover:bg-gray-100 rounded-lg"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

MobileNavigation.displayName = "MobileNavigation";

export default MobileNavigation;
