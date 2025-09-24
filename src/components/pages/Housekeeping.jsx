import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { housekeepingService } from "@/services/api/housekeepingService";

const Housekeeping = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await housekeepingService.getAll();
      setTasks(data);
      setFilteredTasks(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load housekeeping tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    let filtered = tasks;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.taskType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Filter by priority
    if (priorityFilter !== "all") {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    setFilteredTasks(filtered);
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  const handleNewTask = () => {
    toast.info("New task form would open here");
  };

  const handleToggleStatus = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId);
      if (task) {
        let newStatus = "pending";
        let completedAt = null;

        switch (task.status) {
          case "pending":
            newStatus = "in-progress";
            break;
          case "in-progress":
            newStatus = "completed";
            completedAt = new Date().toISOString();
            break;
          case "completed":
            newStatus = "pending";
            break;
          default:
            newStatus = "pending";
        }

        await housekeepingService.update(taskId, { 
          status: newStatus,
          completedAt: completedAt
        });
        await loadTasks();
        toast.success(`Task status updated to ${newStatus.replace("-", " ")}`);
      }
    } catch (err) {
      toast.error("Failed to update task status");
    }
  };

  const handleEditTask = (taskId) => {
    const task = tasks.find(t => t.Id === taskId);
    if (task) {
      toast.info(`Editing task for Room ${task.roomNumber}`);
    }
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadTasks} />;

  const getStatusVariant = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "in-progress":
        return "warning";
      case "pending":
        return "info";
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
      case "low":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return "CheckCircle";
      case "in-progress":
        return "Clock";
      case "pending":
        return "Circle";
      default:
        return "Circle";
    }
  };

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === "pending").length,
    inProgress: tasks.filter(t => t.status === "in-progress").length,
    completed: tasks.filter(t => t.status === "completed").length,
    urgent: tasks.filter(t => t.priority === "urgent" && t.status !== "completed").length
  };

  const formatTaskType = (type) => {
    return type.split("-").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Housekeeping</h1>
          <p className="text-gray-600 mt-1">Manage cleaning tasks and room maintenance</p>
        </div>
        <Button onClick={handleNewTask}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-r from-primary/10 to-blue-100 p-4 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary font-medium">Total Tasks</p>
              <p className="text-2xl font-bold text-primary">{taskStats.total}</p>
            </div>
            <ApperIcon name="ClipboardList" className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-info/10 to-blue-100 p-4 rounded-lg border border-info/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-info font-medium">Pending</p>
              <p className="text-2xl font-bold text-info">{taskStats.pending}</p>
            </div>
            <ApperIcon name="Circle" className="h-8 w-8 text-info" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-warning/10 to-orange-100 p-4 rounded-lg border border-warning/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-warning font-medium">In Progress</p>
              <p className="text-2xl font-bold text-warning">{taskStats.inProgress}</p>
            </div>
            <ApperIcon name="Clock" className="h-8 w-8 text-warning" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-success/10 to-green-100 p-4 rounded-lg border border-success/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-success font-medium">Completed</p>
              <p className="text-2xl font-bold text-success">{taskStats.completed}</p>
            </div>
            <ApperIcon name="CheckCircle" className="h-8 w-8 text-success" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-error/10 to-red-100 p-4 rounded-lg border border-error/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-error font-medium">Urgent</p>
              <p className="text-2xl font-bold text-error">{taskStats.urgent}</p>
            </div>
            <ApperIcon name="AlertTriangle" className="h-8 w-8 text-error" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search by room number, staff, or task type..."
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
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">All Priority</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <Empty
          title="No tasks found"
          message={searchTerm || statusFilter !== "all" || priorityFilter !== "all"
            ? "Try adjusting your search criteria or filters."
            : "Start by creating your first housekeeping task."}
          actionLabel="New Task"
          onAction={handleNewTask}
          icon="Sparkles"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <Card key={task.Id} hover className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Room {task.roomNumber}
                  </h3>
                  <p className="text-sm text-gray-600">{task.roomType}</p>
                </div>
                <div className="flex space-x-2">
                  <Badge variant={getPriorityVariant(task.priority)}>
                    {task.priority}
                  </Badge>
                  <Badge variant={getStatusVariant(task.status)}>
                    <ApperIcon 
                      name={getStatusIcon(task.status)} 
                      className="h-3 w-3 mr-1" 
                    />
                    {task.status.replace("-", " ")}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="User" className="h-4 w-4 mr-2 text-primary" />
                  {task.assignedTo}
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="Wrench" className="h-4 w-4 mr-2 text-primary" />
                  {formatTaskType(task.taskType)}
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="Clock" className="h-4 w-4 mr-2 text-primary" />
                  {task.estimatedTime} minutes
                </div>

                {task.completedAt && (
                  <div className="flex items-center text-sm text-success">
                    <ApperIcon name="CheckCircle" className="h-4 w-4 mr-2" />
                    Completed {format(new Date(task.completedAt), "MMM dd, hh:mm a")}
                  </div>
                )}
              </div>

              {task.notes && (
                <div className="mb-4 p-3 bg-gradient-to-r from-gray-50 to-transparent rounded border-l-2 border-primary">
                  <p className="text-sm text-gray-700">{task.notes}</p>
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant={task.status === "completed" ? "success" : "primary"}
                  className="flex-1"
                  onClick={() => handleToggleStatus(task.Id)}
                >
                  <ApperIcon 
                    name={task.status === "completed" ? "RotateCcw" : "Play"} 
                    className="h-3 w-3 mr-1" 
                  />
                  {task.status === "completed" ? "Reopen" : 
                   task.status === "in-progress" ? "Complete" : "Start"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEditTask(task.Id)}
                >
                  <ApperIcon name="Edit" className="h-3 w-3" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Housekeeping;