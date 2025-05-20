
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
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

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isMenuOpen,
  navLinks,
  activeDropdown,
  setActiveDropdown,
  closeDropdown,
  toggleMenu
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

  if (!isMenuOpen) return null;

  return (
    <div className="md:hidden py-4 bg-background/80 backdrop-blur-lg border-t animate-fade-down">
      <div className="container px-4 mx-auto">
        <nav className="flex flex-col space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.title}
              link={link}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
              closeDropdown={closeDropdown}
              mobile={true}
              onMenuItemClick={toggleMenu}
            />
          ))}
        </nav>

        <div className="mt-6 space-y-4 px-4">
          <button
            className="w-full bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center transition-colors"
            onClick={() => {
              toggleMenu();
              handleStartProject();
            }}
          >
            Start Your Project
            <ArrowRight size={16} className="ml-2" />
          </button>
          <button 
            onClick={() => {
              toggleMenu();
              handleLogin();
            }}
            className="block w-full text-center text-sm font-medium hover:text-teal-600 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileNavigation;
