import React from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found",
  message = "Get started by adding your first item.",
  actionLabel = "Add New",
  onAction,
  icon = "Database"
}) => {
  return (
    <Card className="p-12 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <ApperIcon name={icon} className="h-10 w-10 text-primary" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-sm mx-auto">{message}</p>
      
      {onAction && (
        <Button onClick={onAction} size="lg">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </Card>
  );
};

export default Empty;