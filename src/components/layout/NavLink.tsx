
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface NavLinkItem {
  title: string;
  href: string;
  children?: NavLinkItem[];
}

interface NavLinkProps {
  link: NavLinkItem;
  activeDropdown: string | null;
  setActiveDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  closeDropdown: () => void;
  mobile?: boolean;
  onMenuItemClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({
  link,
  activeDropdown,
  setActiveDropdown,
  closeDropdown,
  mobile = false,
  onMenuItemClick
}) => {
  const toggleDropdown = () => {
    if (activeDropdown === link.title) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(link.title);
    }
  };

  const handleMouseEnter = () => {
    if (!mobile) setActiveDropdown(link.title);
  };

  const handleItemClick = () => {
    if (onMenuItemClick) onMenuItemClick();
  };

  if (link.children) {
    return (
      <div 
        className={mobile ? "" : "relative group"} 
        onMouseLeave={mobile ? undefined : closeDropdown}
      >
        <button
          className={cn(
            mobile 
              ? "w-full px-6 py-3 text-center flex justify-center items-center hover:bg-secondary rounded-lg transition-colors relative text-base font-medium" 
              : "px-0 py-2 text-sm font-medium flex items-center transition-colors hover:text-teal-600 group",
          )}
          onClick={toggleDropdown}
          onMouseEnter={mobile ? undefined : handleMouseEnter}
        >
          {link.title}
          <ChevronDown 
            size={mobile ? 18 : 14} 
            className={cn(
              mobile ? "absolute right-6 transition-transform duration-200" : "ml-1 transition-transform duration-200 group-hover:rotate-180",
              activeDropdown === link.title ? "rotate-180" : ""
            )} 
          />
        </button>
        
        {link.children && activeDropdown === link.title && (
          <div className={mobile 
            ? "px-4 mt-2 space-y-2 animate-fade-in"
            : "absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 animate-fade-down origin-top-right"
          }>
            <div className={mobile ? "" : "py-1 rounded-md bg-white overflow-hidden"}>
              {link.children.map((child) => (
                <Link
                  key={child.title}
                  to={child.href}
                  className={mobile
                    ? "block px-6 py-3 text-sm hover:bg-secondary rounded-lg transition-colors bg-gray-50 hover:bg-gray-100"
                    : "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  }
                  onClick={() => {
                    closeDropdown();
                    handleItemClick();
                  }}
                >
                  {child.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={link.href}
      className={mobile
        ? "block px-6 py-3 hover:bg-secondary rounded-lg transition-colors text-base font-medium"
        : "px-0 py-2 text-sm font-medium hover:text-teal-600 transition-colors"
      }
      onClick={handleItemClick}
    >
      {link.title}
    </Link>
  );
};

export default NavLink;
