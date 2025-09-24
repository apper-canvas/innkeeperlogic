import roomsData from "@/services/mockData/rooms.json";

let rooms = [...roomsData];

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const roomService = {
  async getAll() {
    await delay();
    return [...rooms];
  },

  async getById(id) {
    await delay();
    const room = rooms.find(r => r.Id === parseInt(id));
    if (!room) {
      throw new Error("Room not found");
    }
    return { ...room };
  },

  async create(roomData) {
    await delay();
    const maxId = rooms.length > 0 ? Math.max(...rooms.map(r => r.Id)) : 0;
    const newRoom = {
      ...roomData,
      Id: maxId + 1
    };
    rooms.push(newRoom);
    return { ...newRoom };
  },

  async update(id, roomData) {
    await delay();
    const index = rooms.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Room not found");
    }
    rooms[index] = { ...rooms[index], ...roomData };
    return { ...rooms[index] };
  },

  async delete(id) {
    await delay();
    const index = rooms.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Room not found");
    }
    const deletedRoom = rooms.splice(index, 1)[0];
    return { ...deletedRoom };
  }
};