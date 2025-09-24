import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import RoomGrid from "@/components/organisms/RoomGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { roomService } from "@/services/api/roomService";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadRooms = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await roomService.getAll();
      setRooms(data);
      setFilteredRooms(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  useEffect(() => {
    let filtered = rooms;

    if (statusFilter !== "all") {
      filtered = filtered.filter(room => room.status === statusFilter);
    }

    setFilteredRooms(filtered);
  }, [rooms, statusFilter]);

  const handleStatusChange = async (roomId) => {
    try {
      const room = rooms.find(r => r.Id === roomId);
      if (room) {
        let newStatus = "vacant-clean";
switch (room.status_c) {
          case "occupied":
            newStatus = "vacant-dirty";
            break;
          case "vacant-dirty":
            newStatus = "vacant-clean";
            break;
          case "vacant-clean":
            newStatus = "occupied";
            break;
          case "out-of-order":
            newStatus = "vacant-clean";
            break;
          default:
            newStatus = "vacant-clean";
        }
await roomService.update(roomId, { 
          status_c: newStatus,
          last_cleaned_c: newStatus === "vacant-clean" ? new Date().toISOString() : room.last_cleaned_c
        });
        await loadRooms();
        toast.success(`Room ${room.number} status updated to ${newStatus.replace("-", " ")}`);
      }
    } catch (err) {
      toast.error("Failed to update room status");
    }
  };

  const handleViewDetails = (roomId) => {
    const room = rooms.find(r => r.Id === roomId);
    if (room) {
      toast.info(`Viewing details for Room ${room.number}`);
    }
  };

  const handleAddRoom = () => {
    toast.info("Add new room form would open here");
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadRooms} />;

const roomStats = {
    total: rooms.length,
    occupied: rooms.filter(r => r.status_c === "occupied").length,
    vacantClean: rooms.filter(r => r.status_c === "vacant-clean").length,
    vacantDirty: rooms.filter(r => r.status_c === "vacant-dirty").length,
    outOfOrder: rooms.filter(r => r.status_c === "out-of-order").length
  };

  const occupancyRate = roomStats.total > 0 ? 
    ((roomStats.occupied / roomStats.total) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Room Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage room status across all floors</p>
        </div>
        <Button onClick={handleAddRoom}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Room
        </Button>
      </div>

      {/* Room Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-gradient-to-r from-primary/10 to-blue-100 p-4 rounded-lg border border-primary/20 text-center">
          <div className="text-2xl font-bold text-primary">{roomStats.total}</div>
          <div className="text-sm text-primary font-medium">Total Rooms</div>
        </div>

        <div className="bg-gradient-to-r from-error/10 to-red-100 p-4 rounded-lg border border-error/20 text-center">
          <div className="text-2xl font-bold text-error">{roomStats.occupied}</div>
          <div className="text-sm text-error font-medium">Occupied</div>
        </div>

        <div className="bg-gradient-to-r from-success/10 to-green-100 p-4 rounded-lg border border-success/20 text-center">
          <div className="text-2xl font-bold text-success">{roomStats.vacantClean}</div>
          <div className="text-sm text-success font-medium">Clean</div>
        </div>

        <div className="bg-gradient-to-r from-warning/10 to-orange-100 p-4 rounded-lg border border-warning/20 text-center">
          <div className="text-2xl font-bold text-warning">{roomStats.vacantDirty}</div>
          <div className="text-sm text-warning font-medium">Dirty</div>
        </div>

        <div className="bg-gradient-to-r from-secondary/10 to-gray-100 p-4 rounded-lg border border-secondary/20 text-center">
          <div className="text-2xl font-bold text-secondary">{roomStats.outOfOrder}</div>
          <div className="text-sm text-secondary font-medium">Out of Order</div>
        </div>

        <div className="bg-gradient-to-r from-info/10 to-blue-100 p-4 rounded-lg border border-info/20 text-center">
          <div className="text-2xl font-bold text-info">{occupancyRate}%</div>
          <div className="text-sm text-info font-medium">Occupancy</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">All Rooms</option>
          <option value="occupied">Occupied</option>
          <option value="vacant-clean">Vacant Clean</option>
          <option value="vacant-dirty">Vacant Dirty</option>
          <option value="out-of-order">Out of Order</option>
        </select>
        
        <div className="flex items-center space-x-2 ml-auto">
          <Badge variant="danger">
            <ApperIcon name="User" className="h-3 w-3 mr-1" />
            Occupied
          </Badge>
          <Badge variant="success">
            <ApperIcon name="CheckCircle" className="h-3 w-3 mr-1" />
            Clean
          </Badge>
          <Badge variant="warning">
            <ApperIcon name="AlertCircle" className="h-3 w-3 mr-1" />
            Dirty
          </Badge>
          <Badge variant="default">
            <ApperIcon name="XCircle" className="h-3 w-3 mr-1" />
            Out of Order
          </Badge>
        </div>
      </div>

      {/* Room Grid */}
      {filteredRooms.length === 0 ? (
        <Empty
          title="No rooms found"
          message={statusFilter !== "all" 
            ? "No rooms match the selected status filter."
            : "Start by adding your first room."}
          actionLabel="Add Room"
          onAction={handleAddRoom}
          icon="Bed"
        />
      ) : (
        <RoomGrid
          rooms={filteredRooms}
          onStatusChange={handleStatusChange}
          onViewDetails={handleViewDetails}
        />
      )}
    </div>
  );
};

export default Rooms;