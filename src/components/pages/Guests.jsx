import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import GuestList from "@/components/organisms/GuestList";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { guestService } from "@/services/api/guestService";

const Guests = () => {
  const [guests, setGuests] = useState([]);
  const [filteredGuests, setFilteredGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [vipFilter, setVipFilter] = useState("all");

  const loadGuests = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await guestService.getAll();
      setGuests(data);
      setFilteredGuests(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load guests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGuests();
  }, []);

  useEffect(() => {
    let filtered = guests;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(guest =>
        guest.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.phone.includes(searchTerm)
      );
    }

    // Filter by VIP status
    if (vipFilter === "vip") {
      filtered = filtered.filter(guest => guest.vipStatus);
    } else if (vipFilter === "regular") {
      filtered = filtered.filter(guest => !guest.vipStatus);
    }

    setFilteredGuests(filtered);
  }, [guests, searchTerm, vipFilter]);

  const handleNewGuest = () => {
    toast.info("New guest form would open here");
  };

  const handleViewProfile = (guestId) => {
    const guest = guests.find(g => g.Id === guestId);
    if (guest) {
      toast.info(`Viewing profile for ${guest.firstName} ${guest.lastName}`);
    }
  };

  const handleEditGuest = (guestId) => {
    const guest = guests.find(g => g.Id === guestId);
    if (guest) {
      toast.info(`Editing profile for ${guest.firstName} ${guest.lastName}`);
    }
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadGuests} />;

  const guestStats = {
    total: guests.length,
    vip: guests.filter(g => g.vipStatus).length,
    regular: guests.filter(g => !g.vipStatus).length,
    withStays: guests.filter(g => g.stayHistory.length > 0).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Guest Database</h1>
          <p className="text-gray-600 mt-1">Manage guest profiles and contact information</p>
        </div>
        <Button onClick={handleNewGuest}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          New Guest
        </Button>
      </div>

      {/* Guest Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-primary/10 to-blue-100 p-4 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary font-medium">Total Guests</p>
              <p className="text-2xl font-bold text-primary">{guestStats.total}</p>
            </div>
            <ApperIcon name="Users" className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-accent/10 to-orange-100 p-4 rounded-lg border border-accent/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-accent font-medium">VIP Guests</p>
              <p className="text-2xl font-bold text-accent">{guestStats.vip}</p>
            </div>
            <ApperIcon name="Crown" className="h-8 w-8 text-accent" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-success/10 to-green-100 p-4 rounded-lg border border-success/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-success font-medium">Regular Guests</p>
              <p className="text-2xl font-bold text-success">{guestStats.regular}</p>
            </div>
            <ApperIcon name="User" className="h-8 w-8 text-success" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-info/10 to-blue-100 p-4 rounded-lg border border-info/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-info font-medium">With Stay History</p>
              <p className="text-2xl font-bold text-info">{guestStats.withStays}</p>
            </div>
            <ApperIcon name="Calendar" className="h-8 w-8 text-info" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={vipFilter}
          onChange={(e) => setVipFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">All Guests</option>
          <option value="vip">VIP Guests</option>
          <option value="regular">Regular Guests</option>
        </select>
      </div>

      {/* Guest List */}
      {filteredGuests.length === 0 ? (
        <Empty
          title="No guests found"
          message={searchTerm || vipFilter !== "all" 
            ? "Try adjusting your search criteria or filters."
            : "Start by adding your first guest profile."}
          actionLabel="New Guest"
          onAction={handleNewGuest}
          icon="Users"
        />
      ) : (
        <GuestList
          guests={filteredGuests}
          onViewProfile={handleViewProfile}
          onEditGuest={handleEditGuest}
        />
      )}
    </div>
  );
};

export default Guests;