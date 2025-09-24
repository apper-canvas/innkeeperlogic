import guestsData from "@/services/mockData/guests.json";

let guests = [...guestsData];

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const guestService = {
  async getAll() {
    await delay();
    return [...guests];
  },

  async getById(id) {
    await delay();
    const guest = guests.find(g => g.Id === parseInt(id));
    if (!guest) {
      throw new Error("Guest not found");
    }
    return { ...guest };
  },

  async create(guestData) {
    await delay();
    const maxId = guests.length > 0 ? Math.max(...guests.map(g => g.Id)) : 0;
    const newGuest = {
      ...guestData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      stayHistory: []
    };
    guests.push(newGuest);
    return { ...newGuest };
  },

  async update(id, guestData) {
    await delay();
    const index = guests.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Guest not found");
    }
    guests[index] = { ...guests[index], ...guestData };
    return { ...guests[index] };
  },

  async delete(id) {
    await delay();
    const index = guests.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Guest not found");
    }
    const deletedGuest = guests.splice(index, 1)[0];
    return { ...deletedGuest };
  }
};