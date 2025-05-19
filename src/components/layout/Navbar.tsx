import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { AnimatedButton } from "../ui/AnimatedButton";
import { cn } from "@/lib/utils";
import { getServicesForNavigation, Service } from "@/services/servicesService";

interface NavLink {
  title: string;
  href: string;
  children?: NavLink[];
}

const staticNavLinks: NavLink[] = [
  { title: "Home", href: "/" },
  { title: "Portfolio", href: "/portfolio" },
  { title: "Testimonials", href: "/testimonials" },
  { title: "About Us", href: "/about" },
  { title: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServicesForNavigation();
        setServices(data);
      } catch (error) {
        console.error("Error fetching navigation services:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

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

  // Combine static links with dynamic service links
  const navLinks = [
    ...staticNavLinks.slice(0, 1), // Home
    {
      title: "Services",
      href: "#",
      children: services.map(service => ({
        title: service.title,
        href: service.link || `/services/${service.id}`
      }))
    },
    ...staticNavLinks.slice(1) // Rest of static links
  ];

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
            Permit<span className="text-teal-500">Draft</span>Pro
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <div key={link.title} className="relative group" onMouseLeave={closeDropdown}>
              {link.children ? (
                <button
                  className={cn(
                    "px-0 py-2 text-sm font-medium flex items-center transition-colors",
                    "hover:text-teal-600 group"
                  )}
                  onClick={() => toggleDropdown(link.title)}
                  onMouseEnter={() => setActiveDropdown(link.title)}
                >
                  {link.title}
                  <ChevronDown size={14} className="ml-1 transition-transform duration-200 group-hover:rotate-180" />
                </button>
              ) : (
                <Link
                  to={link.href}
                  className="px-0 py-2 text-sm font-medium hover:text-teal-600 transition-colors"
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
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
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
          <Link to="/order">
            <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center transition-colors">
              Start Your Project
              <ArrowRight size={16} className="ml-2" />
            </button>
          </Link>
          <Link to="/login" className="text-sm font-medium hover:text-teal-600 transition-colors">
            Login
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
        <div className="md:hidden py-4 bg-background/80 backdrop-blur-lg border-t animate-fade-down">
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

            <div className="mt-6 space-y-4 px-4">
              <Link to="/order">
                <button className="w-full bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center transition-colors">
                  Start Your Project
                  <ArrowRight size={16} className="ml-2" />
                </button>
              </Link>
              <Link to="/login" className="block text-center text-sm font-medium hover:text-teal-600 transition-colors">
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
