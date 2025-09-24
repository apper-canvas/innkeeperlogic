import housekeepingData from "@/services/mockData/housekeepingTasks.json";
import roomsData from "@/services/mockData/rooms.json";

let tasks = [...housekeepingData];
const rooms = [...roomsData];

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const housekeepingService = {
  async getAll() {
    await delay();
    return tasks.map(task => {
      const room = rooms.find(r => r.Id === parseInt(task.roomId));
      return {
        ...task,
        roomNumber: room ? room.number : "Unknown Room",
        roomType: room ? room.type : "Unknown Type"
      };
    });
  },

  async getById(id) {
    await delay();
    const task = tasks.find(t => t.Id === parseInt(id));
    if (!task) {
      throw new Error("Task not found");
    }
    const room = rooms.find(r => r.Id === parseInt(task.roomId));
    return {
      ...task,
      roomNumber: room ? room.number : "Unknown Room",
      roomType: room ? room.type : "Unknown Type"
    };
  },

  async create(taskData) {
    await delay();
    const maxId = tasks.length > 0 ? Math.max(...tasks.map(t => t.Id)) : 0;
    const newTask = {
      ...taskData,
      Id: maxId + 1
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, taskData) {
    await delay();
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    tasks[index] = { ...tasks[index], ...taskData };
    return { ...tasks[index] };
  },

  async delete(id) {
    await delay();
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    const deletedTask = tasks.splice(index, 1)[0];
    return { ...deletedTask };
  }
};