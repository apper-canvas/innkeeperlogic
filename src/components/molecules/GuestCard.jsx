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
            {guest.first_name_c?.charAt(0) || 'G'}{guest.last_name_c?.charAt(0) || 'U'}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {guest.first_name_c} {guest.last_name_c}
            </h3>
            <p className="text-sm text-gray-600">{guest.email_c}</p>
          </div>
        </div>
        {guest.vip_status_c && (
          <Badge variant="warning">
            <ApperIcon name="Crown" className="h-3 w-3 mr-1" />
            VIP
          </Badge>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
<ApperIcon name="Phone" className="h-4 w-4 mr-2" />
          {guest.phone_c}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="MapPin" className="h-4 w-4 mr-2" />
          {guest.address_c}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
          Guest since {guest.created_at_c ? new Date(guest.created_at_c).getFullYear() : 'N/A'}
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