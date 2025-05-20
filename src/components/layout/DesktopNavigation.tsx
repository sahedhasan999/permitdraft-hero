
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
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
  const { user } = useAuth();
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
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center transition-colors"
          onClick={handleStartProject}
        >
          Start Your Project
          <ArrowRight size={16} className="ml-2" />
        </button>
        <button 
          onClick={handleLogin} 
          className="text-sm font-medium hover:text-teal-600 transition-colors"
        >
          Login
        </button>
      </div>
    </>
  );
};

export default DesktopNavigation;
