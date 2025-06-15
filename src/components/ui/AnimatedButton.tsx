
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
      primary: "bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500/30 border-0",
      secondary: "bg-white text-teal-600 hover:bg-gray-50 focus:ring-teal-500/30 border border-gray-200",
      outline: "border border-teal-600 bg-transparent text-teal-600 hover:bg-teal-50 focus:ring-teal-500/30",
      ghost: "text-teal-600 hover:bg-teal-50 focus:ring-teal-500/20",
      link: "text-teal-600 underline-offset-4 hover:underline focus:ring-0",
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
            <div className="h-5 w-5 rounded-full border-2 border-t-transparent border-current animate-spin" />
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
