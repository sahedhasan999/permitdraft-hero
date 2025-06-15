
import React, { useState, useEffect, useMemo, memo } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getServicesForNavigation, Service } from "@/services/servicesService";
import DesktopNavigation from "./DesktopNavigation";
import MobileNavigation from "./MobileNavigation";
import { NavLinkItem } from "./NavLink";

const staticNavLinks: NavLinkItem[] = [
  { title: "Home", href: "/" },
  { title: "Portfolio", href: "/portfolio" },
  { title: "Testimonials", href: "/testimonials" },
  { title: "About Us", href: "/about" },
  { title: "Blog", href: "/blog" },
  { title: "Contact", href: "/contact" },
];

const Navbar = memo(() => {
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

  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isScrolled = scrollPosition > 20;

  // Memoize navigation links to prevent unnecessary re-renders
  const navLinks = useMemo(() => [
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
  ], [services]);

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

        {/* Desktop Navigation - only show on larger screens */}
        <DesktopNavigation 
          navLinks={navLinks}
          activeDropdown={activeDropdown}
          setActiveDropdown={setActiveDropdown}
          closeDropdown={closeDropdown}
        />

        {/* Mobile/Tablet Menu Button - show on screens smaller than 1024px */}
        <button
          className="lg:hidden p-2 rounded-md text-foreground hover:bg-secondary"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile/Tablet Navigation - show on screens smaller than 1024px */}
      <MobileNavigation
        isMenuOpen={isMenuOpen}
        navLinks={navLinks}
        activeDropdown={activeDropdown}
        setActiveDropdown={setActiveDropdown}
        closeDropdown={closeDropdown}
        toggleMenu={toggleMenu}
      />
    </header>
  );
});

Navbar.displayName = "Navbar";

export default Navbar;
