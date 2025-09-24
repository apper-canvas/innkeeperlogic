import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md", 
  className,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-md";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-blue-600 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-primary shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
    secondary: "bg-gradient-to-r from-secondary to-slate-600 text-white hover:from-slate-700 hover:to-slate-800 focus:ring-secondary shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary backdrop-blur-sm hover:shadow-lg",
    ghost: "text-secondary hover:text-primary hover:bg-primary/10 focus:ring-primary/20",
    success: "bg-gradient-to-r from-success to-green-600 text-white hover:from-green-700 hover:to-green-800 focus:ring-success shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
    warning: "bg-gradient-to-r from-warning to-orange-600 text-white hover:from-orange-700 hover:to-orange-800 focus:ring-warning shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:from-red-700 hover:to-red-800 focus:ring-error shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;