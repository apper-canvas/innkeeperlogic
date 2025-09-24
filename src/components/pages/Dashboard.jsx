import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import StatCard from "@/components/molecules/StatCard";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { reservationService } from "@/services/api/reservationService";
import { roomService } from "@/services/api/roomService";
import { guestService } from "@/services/api/guestService";
import { housekeepingService } from "@/services/api/housekeepingService";
import { format, startOfMonth, endOfMonth } from "date-fns";

const Dashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [guests, setGuests] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [reservationsData, roomsData, guestsData, tasksData] = await Promise.all([
        reservationService.getAll(),
        roomService.getAll(),
        guestService.getAll(),
        housekeepingService.getAll()
      ]);
      
      setReservations(reservationsData);
      setRooms(roomsData);
      setGuests(guestsData);
      setTasks(tasksData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleQuickAction = (action) => {
    toast.success(`${action} action initiated`);
  };

  if (loading) return <Loading type="stats" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  // Calculate statistics
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(room => room.status === "occupied").length;
  const occupancyRate = totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(1) : "0";
  
  const todayReservations = reservations.filter(reservation => {
    const today = new Date();
    const checkIn = new Date(reservation.checkInDate);
    return checkIn.toDateString() === today.toDateString();
  });

  const thisMonthRevenue = reservations
    .filter(reservation => {
      const date = new Date(reservation.createdAt);
      const start = startOfMonth(new Date());
      const end = endOfMonth(new Date());
      return date >= start && date <= end && reservation.paymentStatus === "paid";
    })
    .reduce((sum, reservation) => sum + reservation.totalAmount, 0);

  const pendingTasks = tasks.filter(task => task.status === "pending").length;
  const vipGuests = guests.filter(guest => guest.vipStatus).length;

  const recentReservations = reservations
    .filter(r => r.status === "confirmed" || r.status === "checked-in")
    .slice(0, 5);

  const urgentTasks = tasks
    .filter(t => t.priority === "urgent" || t.priority === "high")
    .slice(0, 4);

  const getStatusVariant = (status) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "checked-in":
        return "info";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case "urgent":
        return "danger";
      case "high":
        return "warning";
      case "medium":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to Innkeeper Pro</h1>
            <p className="text-blue-100 text-lg">
              Today is {format(new Date(), "EEEE, MMMM dd, yyyy")}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-200 mb-1">Today's Check-ins</div>
            <div className="text-4xl font-bold">{todayReservations.length}</div>
          </div>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Occupancy Rate"
          value={`${occupancyRate}%`}
          change="+2.5% from last week"
          changeType="positive"
          icon="Bed"
          iconColor="text-primary"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${thisMonthRevenue.toLocaleString()}`}
          change="+8.2% from last month"
          changeType="positive"
          icon="DollarSign"
          iconColor="text-success"
        />
        <StatCard
          title="Pending Tasks"
          value={pendingTasks}
          change="3 urgent tasks"
          changeType="negative"
          icon="Clock"
          iconColor="text-warning"
        />
        <StatCard
          title="VIP Guests"
          value={vipGuests}
          change={`${vipGuests} active`}
          changeType="neutral"
          icon="Crown"
          iconColor="text-accent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Reservations */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <ApperIcon name="Calendar" className="h-5 w-5 mr-2 text-primary" />
              Recent Reservations
            </h2>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentReservations.map((reservation) => (
              <div key={reservation.Id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-transparent rounded-lg border border-gray-100">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{reservation.guestName}</div>
                  <div className="text-sm text-gray-600">
                    Room {reservation.roomNumber} • {format(new Date(reservation.checkInDate), "MMM dd")}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="font-medium">${reservation.totalAmount.toLocaleString()}</div>
                    <Badge variant={getStatusVariant(reservation.status)} className="text-xs">
                      {reservation.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Urgent Tasks */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <ApperIcon name="AlertCircle" className="h-5 w-5 mr-2 text-warning" />
              Priority Tasks
            </h2>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {urgentTasks.map((task) => (
              <div key={task.Id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-transparent rounded-lg border border-gray-100">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    Room {task.roomNumber}
                  </div>
                  <div className="text-sm text-gray-600">
                    {task.taskType} • {task.assignedTo}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={getPriorityVariant(task.priority)} className="text-xs">
                    {task.priority}
                  </Badge>
                  <div className="text-sm text-gray-500">
                    {task.estimatedTime}min
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <ApperIcon name="Zap" className="h-5 w-5 mr-2 text-accent" />
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            size="lg"
            className="h-24 flex-col space-y-2"
            onClick={() => handleQuickAction("New Reservation")}
          >
            <ApperIcon name="Plus" className="h-6 w-6" />
            <span>New Reservation</span>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="h-24 flex-col space-y-2"
            onClick={() => handleQuickAction("Quick Check-in")}
          >
            <ApperIcon name="LogIn" className="h-6 w-6" />
            <span>Quick Check-in</span>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="h-24 flex-col space-y-2"
            onClick={() => handleQuickAction("Room Status")}
          >
            <ApperIcon name="Bed" className="h-6 w-6" />
            <span>Room Status</span>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="h-24 flex-col space-y-2"
            onClick={() => handleQuickAction("Generate Report")}
          >
            <ApperIcon name="FileText" className="h-6 w-6" />
            <span>Reports</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;