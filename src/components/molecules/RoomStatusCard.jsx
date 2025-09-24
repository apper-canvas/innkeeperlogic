import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const RoomStatusCard = ({ room, onStatusChange, onViewDetails }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "occupied":
        return "danger";
      case "vacant-clean":
        return "success";
      case "vacant-dirty":
        return "warning";
      case "out-of-order":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "occupied":
        return "User";
      case "vacant-clean":
        return "CheckCircle";
      case "vacant-dirty":
        return "AlertCircle";
      case "out-of-order":
        return "XCircle";
      default:
        return "Circle";
    }
  };

  const formatStatus = (status) => {
    return status.split("-").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  return (
    <Card hover className="p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
      
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Room {room.number}</h3>
          <p className="text-sm text-gray-600">{room.type} • Floor {room.floor}</p>
        </div>
        <Badge variant={getStatusColor(room.status)}>
          <ApperIcon 
            name={getStatusIcon(room.status)} 
            className="h-3 w-3 mr-1" 
          />
          {formatStatus(room.status)}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Base Rate</span>
          <span className="font-medium">${room.baseRate}/night</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Max Occupancy</span>
          <span className="font-medium">{room.maxOccupancy} guests</span>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="flex-1"
          onClick={() => onStatusChange(room.Id)}
        >
          <ApperIcon name="RotateCcw" className="h-3 w-3 mr-1" />
          Update
        </Button>
        <Button 
          size="sm" 
          variant="ghost"
          onClick={() => onViewDetails(room.Id)}
        >
          <ApperIcon name="Eye" className="h-3 w-3" />
        </Button>
      </div>
    </Card>
  );
};

export default RoomStatusCard;