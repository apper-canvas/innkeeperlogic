import reservationsData from "@/services/mockData/reservations.json";
import guestsData from "@/services/mockData/guests.json";
import roomsData from "@/services/mockData/rooms.json";

let reservations = [...reservationsData];
const guests = [...guestsData];
const rooms = [...roomsData];

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const reservationService = {
  async getAll() {
    await delay();
    return reservations.map(reservation => {
      const guest = guests.find(g => g.Id === parseInt(reservation.guestId));
      const room = rooms.find(r => r.Id === parseInt(reservation.roomId));
      return {
        ...reservation,
        guestName: guest ? `${guest.firstName} ${guest.lastName}` : "Unknown Guest",
        roomNumber: room ? room.number : "Unknown Room",
        roomType: room ? room.type : "Unknown Type"
      };
    });
  },

  async getById(id) {
    await delay();
    const reservation = reservations.find(r => r.Id === parseInt(id));
    if (!reservation) {
      throw new Error("Reservation not found");
    }
    const guest = guests.find(g => g.Id === parseInt(reservation.guestId));
    const room = rooms.find(r => r.Id === parseInt(reservation.roomId));
    return {
      ...reservation,
      guestName: guest ? `${guest.firstName} ${guest.lastName}` : "Unknown Guest",
      roomNumber: room ? room.number : "Unknown Room",
      roomType: room ? room.type : "Unknown Type"
    };
  },

  async create(reservationData) {
    await delay();
    const maxId = reservations.length > 0 ? Math.max(...reservations.map(r => r.Id)) : 0;
    const newReservation = {
      ...reservationData,
      Id: maxId + 1,
      createdAt: new Date().toISOString()
    };
    reservations.push(newReservation);
    return { ...newReservation };
  },

  async update(id, reservationData) {
    await delay();
    const index = reservations.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Reservation not found");
    }
    reservations[index] = { ...reservations[index], ...reservationData };
    return { ...reservations[index] };
  },

  async delete(id) {
    await delay();
    const index = reservations.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Reservation not found");
    }
    const deletedReservation = reservations.splice(index, 1)[0];
    return { ...deletedReservation };
  }
};