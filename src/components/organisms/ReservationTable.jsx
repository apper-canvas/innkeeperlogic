import React from "react";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const ReservationTable = ({ reservations, onEdit, onCancel, onCheckIn }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "danger";
      case "checked-in":
        return "info";
      case "checked-out":
        return "default";
      default:
        return "default";
    }
  };

  const getPaymentVariant = (status) => {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "overdue":
        return "danger";
      default:
        return "default";
    }
  };

  const formatStatus = (status) => {
    return status.split("-").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Guest
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check-in
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check-out
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reservations.map((reservation) => (
              <tr key={reservation.Id} className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {reservation.guestName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {reservation.numberOfGuests} guest{reservation.numberOfGuests > 1 ? "s" : ""}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    Room {reservation.roomNumber}
                  </div>
                  <div className="text-sm text-gray-500">
                    {reservation.roomType}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(reservation.checkInDate), "MMM dd, yyyy")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(reservation.checkOutDate), "MMM dd, yyyy")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={getStatusVariant(reservation.status)}>
                    {formatStatus(reservation.status)}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={getPaymentVariant(reservation.paymentStatus)}>
                    {formatStatus(reservation.paymentStatus)}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${reservation.totalAmount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    {reservation.status === "confirmed" && (
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => onCheckIn(reservation.Id)}
                      >
                        <ApperIcon name="LogIn" className="h-3 w-3 mr-1" />
                        Check In
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(reservation.Id)}
                    >
                      <ApperIcon name="Edit" className="h-3 w-3" />
                    </Button>
                    {reservation.status === "confirmed" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onCancel(reservation.Id)}
                        className="text-error hover:text-error"
                      >
                        <ApperIcon name="X" className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default ReservationTable;