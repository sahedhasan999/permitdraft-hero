
import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import NavLink, { NavLinkItem } from "./NavLink";
import { useAuth } from "@/contexts/AuthContext";

interface DesktopNavigationProps {
  navLinks: NavLinkItem[];
  activeDropdown: string | null;
  setActiveDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  closeDropdown: () => void;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  navLinks,
  activeDropdown,
  setActiveDropdown,
  closeDropdown
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

  return (
    <>
      <nav className="hidden md:flex items-center space-x-6">
        {navLinks.map((link) => (
          <NavLink
            key={link.title}
            link={link}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
            closeDropdown={closeDropdown}
          />
        ))}
      </nav>

      <div className="hidden md:flex items-center space-x-4">
        <button 
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          onClick={handleStartProject}
        >
          {user ? 'Start a Project' : 'Start Your Project'}
        </button>
        
        {user ? (
          <>
            <button 
              onClick={handleDashboard} 
              className="text-sm font-medium hover:text-teal-600 transition-colors flex items-center"
            >
              <User size={16} className="mr-2" />
              My Dashboard
            </button>
            <button 
              onClick={handleLogout} 
              className="text-sm font-medium hover:text-teal-600 transition-colors flex items-center"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </button>
          </>
        ) : (
          <button 
            onClick={handleLogin} 
            className="text-sm font-medium hover:text-teal-600 transition-colors"
          >
            Login
          </button>
        )}
      </div>
    </>
  );
};

export default DesktopNavigation;
