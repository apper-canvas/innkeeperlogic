import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  type = "text",
  className,
  error,
  ...props 
}, ref) => {
  const baseStyles = "block w-full px-3 py-2 border rounded-md shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none text-gray-900 bg-white";
  
  const variants = {
    default: "border-gray-300 focus:border-primary focus:ring-primary/20",
    error: "border-error focus:border-error focus:ring-error/20"
  };

  const variant = error ? "error" : "default";

  return (
    <input
      ref={ref}
      type={type}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;