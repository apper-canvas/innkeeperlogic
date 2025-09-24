import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = "positive", 
  icon, 
  iconColor = "text-primary" 
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-success";
      case "negative":
        return "text-error";
      default:
        return "text-gray-500";
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case "positive":
        return "TrendingUp";
      case "negative":
        return "TrendingDown";
      default:
        return "Minus";
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-gray-50/50 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {change && (
            <div className="flex items-center">
              <ApperIcon 
                name={getChangeIcon()} 
                className={`h-4 w-4 ${getChangeColor()} mr-1`} 
              />
              <span className={`text-sm font-medium ${getChangeColor()}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 ${iconColor}`}>
            <ApperIcon name={icon} className="h-6 w-6" />
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;