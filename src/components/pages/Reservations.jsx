import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ReservationTable from "@/components/organisms/ReservationTable";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { reservationService } from "@/services/api/reservationService";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await reservationService.getAll();
      setReservations(data);
      setFilteredReservations(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load reservations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  useEffect(() => {
    let filtered = reservations;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(reservation =>
        reservation.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(reservation => reservation.status === statusFilter);
    }

    setFilteredReservations(filtered);
  }, [reservations, searchTerm, statusFilter]);

  const handleNewReservation = () => {
    toast.info("New reservation form would open here");
  };

  const handleEditReservation = (id) => {
    toast.info(`Edit reservation ${id}`);
  };

  const handleCancelReservation = async (id) => {
    try {
      const reservation = reservations.find(r => r.Id === id);
      if (reservation && reservation.status === "confirmed") {
        await reservationService.update(id, { status: "cancelled" });
        await loadReservations();
        toast.success("Reservation cancelled successfully");
      }
    } catch (err) {
      toast.error("Failed to cancel reservation");
    }
  };

  const handleCheckIn = async (id) => {
    try {
      const reservation = reservations.find(r => r.Id === id);
      if (reservation && reservation.status === "confirmed") {
        await reservationService.update(id, { status: "checked-in" });
        await loadReservations();
        toast.success("Guest checked in successfully");
      }
    } catch (err) {
      toast.error("Failed to check in guest");
    }
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadReservations} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reservations</h1>
          <p className="text-gray-600 mt-1">Manage hotel bookings and guest check-ins</p>
        </div>
        <Button onClick={handleNewReservation}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          New Reservation
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search by guest name or room number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="checked-in">Checked In</option>
          <option value="checked-out">Checked Out</option>
          <option value="cancelled">Cancelled</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-primary/10 p-4 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary font-medium">Total Reservations</p>
              <p className="text-2xl font-bold text-primary">{reservations.length}</p>
            </div>
            <ApperIcon name="Calendar" className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-success/10 p-4 rounded-lg border border-success/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-success font-medium">Confirmed</p>
              <p className="text-2xl font-bold text-success">
                {reservations.filter(r => r.status === "confirmed").length}
              </p>
            </div>
            <ApperIcon name="CheckCircle" className="h-8 w-8 text-success" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-warning/10 p-4 rounded-lg border border-warning/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-warning font-medium">Checked In</p>
              <p className="text-2xl font-bold text-warning">
                {reservations.filter(r => r.status === "checked-in").length}
              </p>
            </div>
            <ApperIcon name="LogIn" className="h-8 w-8 text-warning" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-50 to-secondary/10 p-4 rounded-lg border border-secondary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary font-medium">Pending</p>
              <p className="text-2xl font-bold text-secondary">
                {reservations.filter(r => r.status === "pending").length}
              </p>
            </div>
            <ApperIcon name="Clock" className="h-8 w-8 text-secondary" />
          </div>
        </div>
      </div>

      {/* Reservations Table */}
      {filteredReservations.length === 0 ? (
        <Empty
          title="No reservations found"
          message={searchTerm || statusFilter !== "all" 
            ? "Try adjusting your search criteria or filters."
            : "Start by creating your first reservation."}
          actionLabel="New Reservation"
          onAction={handleNewReservation}
          icon="Calendar"
        />
      ) : (
        <ReservationTable
          reservations={filteredReservations}
          onEdit={handleEditReservation}
          onCancel={handleCancelReservation}
          onCheckIn={handleCheckIn}
        />
      )}
    </div>
  );
};

export default Reservations;