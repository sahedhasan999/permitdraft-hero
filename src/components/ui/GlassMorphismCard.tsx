
import React from "react";
import { cn } from "@/lib/utils";

interface GlassMorphismCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "hover" | "interactive";
  padding?: "none" | "sm" | "md" | "lg";
  blurAmount?: "none" | "sm" | "md" | "lg";
  border?: boolean;
  gradientBorder?: boolean;
  fadeIn?: boolean;
}

const GlassMorphismCard = React.forwardRef<HTMLDivElement, GlassMorphismCardProps>(
  ({ 
    children, 
    className, 
    variant = "default", 
    padding = "md", 
    blurAmount = "md",
    border = true,
    gradientBorder = false,
    fadeIn = false,
    ...props 
  }, ref) => {
    const baseStyles = "bg-white/80 backdrop-blur relative rounded-xl overflow-hidden";
    
    const variantStyles = {
      default: "shadow-glass",
      hover: "shadow-glass transition-all duration-300 hover:shadow-glass-hover",
      interactive: "shadow-glass transition-all duration-300 hover:shadow-glass-hover hover:-translate-y-1",
    };
    
    const paddingStyles = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };
    
    const blurStyles = {
      none: "backdrop-blur-none",
      sm: "backdrop-blur-sm",
      md: "backdrop-blur-md",
      lg: "backdrop-blur-lg",
    };
    
    const borderStyles = border 
      ? gradientBorder 
        ? "before:absolute before:inset-0 before:rounded-xl before:p-[1.5px] before:bg-gradient-to-r before:from-primary/50 before:via-white/10 before:to-white/30 before:-z-10" 
        : "border border-white/20" 
      : "";
    
    const fadeInStyles = fadeIn ? "animate-fade-in" : "";
    
    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          paddingStyles[padding],
          blurStyles[blurAmount],
          borderStyles,
          fadeInStyles,
          className
        )}
        {...props}
      >
        {gradientBorder && (
          <div className="absolute inset-0 rounded-xl p-[1.5px] bg-gradient-to-r from-primary/50 via-white/10 to-white/30 -z-10" />
        )}
        {children}
      </div>
    );
  }
);

GlassMorphismCard.displayName = "GlassMorphismCard";

export { GlassMorphismCard };
