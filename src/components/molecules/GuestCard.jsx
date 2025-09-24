import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const GuestCard = ({ guest, onViewProfile, onEditGuest }) => {
  return (
    <Card hover className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {guest.firstName.charAt(0)}{guest.lastName.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {guest.firstName} {guest.lastName}
            </h3>
            <p className="text-sm text-gray-600">{guest.email}</p>
          </div>
        </div>
        {guest.vipStatus && (
          <Badge variant="warning">
            <ApperIcon name="Crown" className="h-3 w-3 mr-1" />
            VIP
          </Badge>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Phone" className="h-4 w-4 mr-2" />
          {guest.phone}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="MapPin" className="h-4 w-4 mr-2" />
          {guest.address}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
          {guest.stayHistory.length} stays
        </div>
      </div>

      <div className="flex space-x-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="flex-1"
          onClick={() => onViewProfile(guest.Id)}
        >
          <ApperIcon name="User" className="h-3 w-3 mr-1" />
          Profile
        </Button>
        <Button 
          size="sm" 
          variant="ghost"
          onClick={() => onEditGuest(guest.Id)}
        >
          <ApperIcon name="Edit" className="h-3 w-3" />
        </Button>
      </div>
    </Card>
  );
};

export default GuestCard;