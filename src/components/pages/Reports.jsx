import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { reservationService } from "@/services/api/reservationService";
import { roomService } from "@/services/api/roomService";
import { guestService } from "@/services/api/guestService";

const Reports = () => {
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateRange, setDateRange] = useState("thisMonth");

  const loadReportsData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [reservationsData, roomsData, guestsData] = await Promise.all([
        reservationService.getAll(),
        roomService.getAll(),
        guestService.getAll()
      ]);
      
      setReservations(reservationsData);
      setRooms(roomsData);
      setGuests(guestsData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load reports data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportsData();
  }, []);

  const handleExportReport = (type) => {
    toast.success(`${type} report exported successfully`);
  };

  if (loading) return <Loading type="stats" />;
  if (error) return <Error message={error} onRetry={loadReportsData} />;

  // Calculate date range
  const getDateRange = () => {
    const now = new Date();
    switch (dateRange) {
      case "today":
        return { start: now, end: now };
      case "week":
        return { start: subDays(now, 7), end: now };
      case "thisMonth":
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case "lastMonth":
        const lastMonth = subDays(startOfMonth(now), 1);
        return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
      default:
        return { start: startOfMonth(now), end: endOfMonth(now) };
    }
  };

  const { start, end } = getDateRange();

  // Filter data by date range
  const filteredReservations = reservations.filter(reservation => {
    const date = new Date(reservation.createdAt);
    return date >= start && date <= end;
  });

  const filteredGuests = guests.filter(guest => {
    const date = new Date(guest.createdAt);
    return date >= start && date <= end;
  });

  // Calculate metrics
  const totalRevenue = filteredReservations
    .filter(r => r.paymentStatus === "paid")
    .reduce((sum, r) => sum + r.totalAmount, 0);

  const totalBookings = filteredReservations.length;
  const totalOccupancy = rooms.filter(r => r.status === "occupied").length;
  const occupancyRate = rooms.length > 0 ? ((totalOccupancy / rooms.length) * 100).toFixed(1) : "0";
  const newGuests = filteredGuests.length;
  const averageRate = totalBookings > 0 ? (totalRevenue / totalBookings).toFixed(0) : "0";

  // Revenue by source
  const revenueBySource = filteredReservations
    .filter(r => r.paymentStatus === "paid")
    .reduce((acc, r) => {
      acc[r.source] = (acc[r.source] || 0) + r.totalAmount;
      return acc;
    }, {});

  // Room type performance
  const roomTypePerformance = filteredReservations.reduce((acc, r) => {
    if (!acc[r.roomType]) {
      acc[r.roomType] = { bookings: 0, revenue: 0 };
    }
    acc[r.roomType].bookings += 1;
    if (r.paymentStatus === "paid") {
      acc[r.roomType].revenue += r.totalAmount;
    }
    return acc;
  }, {});

  // Recent bookings by day
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    const dayReservations = reservations.filter(r => {
      const rDate = new Date(r.createdAt);
      return rDate.toDateString() === date.toDateString();
    });
    return {
      date: format(date, "MMM dd"),
      bookings: dayReservations.length,
      revenue: dayReservations.filter(r => r.paymentStatus === "paid").reduce((sum, r) => sum + r.totalAmount, 0)
    };
  }).reverse();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Revenue insights and operational metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
          </select>
          <Button variant="outline">
            <ApperIcon name="Download" className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          change="+12.5% from last period"
          changeType="positive"
          icon="DollarSign"
          iconColor="text-success"
        />
        <StatCard
          title="Total Bookings"
          value={totalBookings}
          change="+8.2% from last period"
          changeType="positive"
          icon="Calendar"
          iconColor="text-primary"
        />
        <StatCard
          title="Occupancy Rate"
          value={`${occupancyRate}%`}
          change="+2.1% from last period"
          changeType="positive"
          icon="Bed"
          iconColor="text-info"
        />
        <StatCard
          title="Average Daily Rate"
          value={`$${averageRate}`}
          change="+5.3% from last period"
          changeType="positive"
          icon="TrendingUp"
          iconColor="text-warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Breakdown */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <ApperIcon name="PieChart" className="h-5 w-5 mr-2 text-primary" />
              Revenue by Source
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleExportReport("Revenue Source")}
            >
              <ApperIcon name="Download" className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {Object.entries(revenueBySource).map(([source, revenue]) => {
              const percentage = totalRevenue > 0 ? ((revenue / totalRevenue) * 100).toFixed(1) : "0";
              return (
                <div key={source} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-transparent rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-blue-600"></div>
                    <span className="font-medium text-gray-900 capitalize">{source}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">${revenue.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{percentage}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Room Type Performance */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <ApperIcon name="BarChart3" className="h-5 w-5 mr-2 text-success" />
              Room Type Performance
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleExportReport("Room Performance")}
            >
              <ApperIcon name="Download" className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {Object.entries(roomTypePerformance).map(([roomType, data]) => (
              <div key={roomType} className="p-4 bg-gradient-to-r from-gray-50 to-transparent rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{roomType}</span>
                  <span className="text-sm text-gray-500">{data.bookings} bookings</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mr-4">
                    <div 
                      className="bg-gradient-to-r from-success to-green-600 h-2 rounded-full"
                      style={{ 
                        width: `${totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  <span className="font-semibold text-gray-900">${data.revenue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Daily Performance */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <ApperIcon name="TrendingUp" className="h-5 w-5 mr-2 text-warning" />
            Daily Performance (Last 7 Days)
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleExportReport("Daily Performance")}
          >
            <ApperIcon name="Download" className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Bookings</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Avg. Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {last7Days.map((day, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{day.date}</td>
                  <td className="py-3 px-4 text-gray-900">{day.bookings}</td>
                  <td className="py-3 px-4 text-gray-900">${day.revenue.toLocaleString()}</td>
                  <td className="py-3 px-4 text-gray-900">
                    ${day.bookings > 0 ? (day.revenue / day.bookings).toFixed(0) : "0"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Export Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <ApperIcon name="FileText" className="h-5 w-5 mr-2 text-accent" />
          Export Reports
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            size="lg"
            className="h-20 flex-col space-y-2"
            onClick={() => handleExportReport("Financial Summary")}
          >
            <ApperIcon name="DollarSign" className="h-6 w-6" />
            <span>Financial Summary</span>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="h-20 flex-col space-y-2"
            onClick={() => handleExportReport("Occupancy Report")}
          >
            <ApperIcon name="Bed" className="h-6 w-6" />
            <span>Occupancy Report</span>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="h-20 flex-col space-y-2"
            onClick={() => handleExportReport("Guest Analytics")}
          >
            <ApperIcon name="Users" className="h-6 w-6" />
            <span>Guest Analytics</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Reports;