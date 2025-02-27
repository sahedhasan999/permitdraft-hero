
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { AnimatedButton } from "../ui/AnimatedButton";
import { cn } from "@/lib/utils";

interface NavLink {
  title: string;
  href: string;
  children?: NavLink[];
}

const navLinks: NavLink[] = [
  { title: "Home", href: "/" },
  { 
    title: "Services", 
    href: "#",
    children: [
      { title: "For Contractors", href: "/contractors" },
      { title: "For Homeowners", href: "/homeowners" },
      { title: "Pricing", href: "/pricing" },
    ]
  },
  { title: "Portfolio", href: "/portfolio" },
  { title: "Testimonials", href: "/testimonials" },
  { title: "About Us", href: "/about" },
  { title: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleScroll = () => {
    setScrollPosition(window.scrollY);
  };

  const toggleDropdown = (title: string) => {
    if (activeDropdown === title) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(title);
    }
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isScrolled = scrollPosition > 20;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "py-3 bg-white/90 backdrop-blur-md shadow-sm"
          : "py-5 bg-transparent"
      )}
    >
      <div className="container px-4 mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-display font-bold tracking-tight text-foreground">
            Permit<span className="text-primary">Draft</span>Pro
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <div key={link.title} className="relative group" onMouseLeave={closeDropdown}>
              {link.children ? (
                <button
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-md flex items-center transition-colors",
                    "hover:bg-secondary group"
                  )}
                  onClick={() => toggleDropdown(link.title)}
                  onMouseEnter={() => setActiveDropdown(link.title)}
                >
                  {link.title}
                  <ChevronDown size={16} className="ml-1 transition-transform duration-200 group-hover:rotate-180" />
                </button>
              ) : (
                <Link
                  to={link.href}
                  className="px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary transition-colors"
                >
                  {link.title}
                </Link>
              )}

              {link.children && activeDropdown === link.title && (
                <div className="absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 animate-fade-down origin-top-right">
                  <div className="py-1 rounded-md bg-white overflow-hidden">
                    {link.children.map((child) => (
                      <Link
                        key={child.title}
                        to={child.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-secondary transition-colors"
                        onClick={closeDropdown}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login">
            <AnimatedButton variant="ghost" size="sm">
              Login
            </AnimatedButton>
          </Link>
          <Link to="/signup">
            <AnimatedButton variant="primary" size="sm">
              Sign Up
            </AnimatedButton>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md text-foreground hover:bg-secondary"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden py-4 bg-background border-t animate-fade-down">
          <div className="container px-4 mx-auto">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <div key={link.title}>
                  {link.children ? (
                    <div>
                      <button
                        className="w-full px-4 py-2 text-left flex justify-between items-center hover:bg-secondary rounded-md transition-colors"
                        onClick={() => toggleDropdown(link.title)}
                      >
                        {link.title}
                        <ChevronDown 
                          size={16} 
                          className={cn(
                            "transition-transform duration-200",
                            activeDropdown === link.title ? "rotate-180" : ""
                          )} 
                        />
                      </button>
                      {activeDropdown === link.title && (
                        <div className="pl-4 mt-1 space-y-1 animate-fade-in">
                          {link.children.map((child) => (
                            <Link
                              key={child.title}
                              to={child.href}
                              className="block px-4 py-2 text-sm hover:bg-secondary rounded-md transition-colors"
                              onClick={toggleMenu}
                            >
                              {child.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={link.href}
                      className="block px-4 py-2 hover:bg-secondary rounded-md transition-colors"
                      onClick={toggleMenu}
                    >
                      {link.title}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            <div className="mt-6 grid grid-cols-2 gap-4 px-4">
              <Link to="/login">
                <AnimatedButton variant="outline" size="sm" fullWidth>
                  Login
                </AnimatedButton>
              </Link>
              <Link to="/signup">
                <AnimatedButton variant="primary" size="sm" fullWidth>
                  Sign Up
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
