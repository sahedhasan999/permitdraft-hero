
import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ 
    children, 
    className, 
    variant = "primary", 
    size = "md", 
    isLoading = false, 
    iconLeft, 
    iconRight, 
    fullWidth = false,
    ...props 
  }, ref) => {
    const baseStyles = "relative inline-flex items-center justify-center font-semibold transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 overflow-hidden";
    
    const variantStyles = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/30",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary/30",
      outline: "border border-input bg-background hover:bg-secondary focus:ring-primary/30",
      ghost: "hover:bg-secondary focus:ring-primary/20",
      link: "text-primary underline-offset-4 hover:underline focus:ring-0",
    };
    
    const sizeStyles = {
      sm: "text-sm px-3 py-1.5 rounded-md",
      md: "text-md px-4 py-2 rounded-md",
      lg: "text-lg px-6 py-3 rounded-lg",
    };
    
    const widthStyles = fullWidth ? "w-full" : "";
    
    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          widthStyles,
          "shadow-button hover:shadow-button-hover hover:-translate-y-0.5 active:translate-y-0",
          isLoading && "opacity-70 pointer-events-none",
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-inherit">
            <div className="h-5 w-5 rounded-full border-2 border-t-transparent border-white animate-spin" />
          </div>
        )}
        <span className={cn("flex items-center justify-center gap-2", isLoading && "opacity-0")}>
          {iconLeft && <span className="inline-flex">{iconLeft}</span>}
          {children}
          {iconRight && <span className="inline-flex">{iconRight}</span>}
        </span>
      </button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton };
