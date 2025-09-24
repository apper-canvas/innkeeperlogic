import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children,
  className,
  variant = "default",
  hover = false,
  ...props 
}, ref) => {
  const baseStyles = "bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-200";
  
  const variants = {
    default: "",
    gradient: "bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm",
    elevated: "shadow-lg"
  };

  const hoverStyles = hover ? "hover:shadow-lg hover:-translate-y-1 cursor-pointer" : "";

  return (
    <div
      ref={ref}
      className={cn(baseStyles, variants[variant], hoverStyles, className)}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;