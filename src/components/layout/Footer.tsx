
import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface FooterLinkGroup {
  title: string;
  links: {
    label: string;
    href: string;
    external?: boolean;
  }[];
}

const linkGroups: FooterLinkGroup[] = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Team", href: "/team" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "For Contractors", href: "/contractors" },
      { label: "For Homeowners", href: "/homeowners" },
      { label: "Pricing", href: "/pricing" },
      { label: "Process", href: "/process" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Portfolio", href: "/portfolio" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "FAQ", href: "/faq" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Refund Policy", href: "/refunds" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-zinc-100 pt-16 pb-8">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Logo and company info */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-display font-bold tracking-tight text-foreground">
                Permit<span className="text-primary">Draft</span>Pro
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              Professional architectural drafting services specializing in outdoor space designs for US permit applications. Quality drawings at competitive prices.
            </p>
            <div className="flex space-x-4 mb-8">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Link groups */}
          {linkGroups.map((group, index) => (
            <div 
              key={group.title} 
              className={cn(
                "lg:col-span-2",
                index === 0 && "md:col-start-1 lg:col-start-auto"
              )}
            >
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                {group.title}
              </h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail size={16} className="mr-2" />
              <a href="mailto:info@permitdraftpro.com" className="hover:text-primary transition-colors">
                info@permitdraftpro.com
              </a>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Phone size={16} className="mr-2" />
              <a href="tel:+18001234567" className="hover:text-primary transition-colors">
                +1 (800) 123-4567
              </a>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin size={16} className="mr-2" />
              <span>Dhaka, Bangladesh</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} PermitDraftPro. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <Link to="/admin/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Admin Login
            </Link>
            <img 
              src="https://static.vecteezy.com/system/resources/previews/022/048/316/original/payment-method-icon-sign-symbol-design-free-png.png" 
              alt="Payment Methods" 
              className="h-8" 
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
