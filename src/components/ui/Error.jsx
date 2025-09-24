import React from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong. Please try again.", 
  onRetry,
  title = "Error" 
}) => {
  return (
    <Card className="p-8 text-center max-w-md mx-auto">
      <div className="w-16 h-16 bg-gradient-to-br from-error/10 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <ApperIcon name="AlertCircle" className="h-8 w-8 text-error" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      
      {onRetry && (
        <Button onClick={onRetry} className="mx-auto">
          <ApperIcon name="RotateCcw" className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </Card>
  );
};

export default Error;