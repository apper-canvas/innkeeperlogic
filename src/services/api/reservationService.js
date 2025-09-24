import { toast } from 'react-toastify';

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const reservationService = {
  async getAll() {
    await delay();
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "guest_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "guest_id_c"}, "referenceField": {"field": {"Name": "first_name_c"}}},
          {"field": {"Name": "guest_id_c"}, "referenceField": {"field": {"Name": "last_name_c"}}},
          {"field": {"Name": "room_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "room_id_c"}, "referenceField": {"field": {"Name": "number_c"}}},
          {"field": {"Name": "room_id_c"}, "referenceField": {"field": {"Name": "type_c"}}},
          {"field": {"Name": "check_in_date_c"}},
          {"field": {"Name": "check_out_date_c"}},
          {"field": {"Name": "number_of_guests_c"}},
          {"field": {"Name": "room_rate_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "payment_status_c"}},
          {"field": {"Name": "special_requests_c"}},
          {"field": {"Name": "source_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await apperClient.fetchRecords('reservation_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform data for compatibility with existing UI
      const transformedData = (response.data || []).map(reservation => ({
        ...reservation,
        guestName: reservation.guest_id_c?.first_name_c && reservation.guest_id_c?.last_name_c
          ? `${reservation.guest_id_c.first_name_c} ${reservation.guest_id_c.last_name_c}`
          : reservation.guest_id_c?.Name || "Unknown Guest",
        roomNumber: reservation.room_id_c?.number_c || "Unknown Room",
        roomType: reservation.room_id_c?.type_c || "Unknown Type",
        checkInDate: reservation.check_in_date_c,
        checkOutDate: reservation.check_out_date_c,
        numberOfGuests: reservation.number_of_guests_c,
        roomRate: reservation.room_rate_c,
        totalAmount: reservation.total_amount_c,
        status: reservation.status_c,
        paymentStatus: reservation.payment_status_c,
        specialRequests: reservation.special_requests_c,
        source: reservation.source_c,
        createdAt: reservation.created_at_c || reservation.CreatedOn
      }));

      return transformedData;
    } catch (error) {
      console.error("Error fetching reservations:", error);
      toast.error("Failed to load reservations");
      return [];
    }
  },

  async getById(id) {
    await delay();
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "guest_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "guest_id_c"}, "referenceField": {"field": {"Name": "first_name_c"}}},
          {"field": {"Name": "guest_id_c"}, "referenceField": {"field": {"Name": "last_name_c"}}},
          {"field": {"Name": "room_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "room_id_c"}, "referenceField": {"field": {"Name": "number_c"}}},
          {"field": {"Name": "room_id_c"}, "referenceField": {"field": {"Name": "type_c"}}},
          {"field": {"Name": "check_in_date_c"}},
          {"field": {"Name": "check_out_date_c"}},
          {"field": {"Name": "number_of_guests_c"}},
          {"field": {"Name": "room_rate_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "payment_status_c"}},
          {"field": {"Name": "special_requests_c"}},
          {"field": {"Name": "source_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await apperClient.getRecordById('reservation_c', id, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      // Transform data for compatibility
      const reservation = response.data;
      if (!reservation) return null;

      return {
        ...reservation,
        guestName: reservation.guest_id_c?.first_name_c && reservation.guest_id_c?.last_name_c
          ? `${reservation.guest_id_c.first_name_c} ${reservation.guest_id_c.last_name_c}`
          : reservation.guest_id_c?.Name || "Unknown Guest",
        roomNumber: reservation.room_id_c?.number_c || "Unknown Room",
        roomType: reservation.room_id_c?.type_c || "Unknown Type",
        checkInDate: reservation.check_in_date_c,
        checkOutDate: reservation.check_out_date_c,
        numberOfGuests: reservation.number_of_guests_c,
        roomRate: reservation.room_rate_c,
        totalAmount: reservation.total_amount_c,
        status: reservation.status_c,
        paymentStatus: reservation.payment_status_c,
        specialRequests: reservation.special_requests_c,
        source: reservation.source_c,
        createdAt: reservation.created_at_c || reservation.CreatedOn
      };
    } catch (error) {
      console.error(`Error fetching reservation ${id}:`, error);
      toast.error("Failed to load reservation");
      return null;
    }
  },

  async create(reservationData) {
    await delay();
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Name: reservationData.Name || `Reservation for ${reservationData.guestName}`,
          Tags: reservationData.Tags || "",
          guest_id_c: parseInt(reservationData.guest_id_c || reservationData.guestId),
          room_id_c: parseInt(reservationData.room_id_c || reservationData.roomId),
          check_in_date_c: reservationData.check_in_date_c || reservationData.checkInDate,
          check_out_date_c: reservationData.check_out_date_c || reservationData.checkOutDate,
          number_of_guests_c: parseInt(reservationData.number_of_guests_c || reservationData.numberOfGuests),
          room_rate_c: parseFloat(reservationData.room_rate_c || reservationData.roomRate),
          total_amount_c: parseFloat(reservationData.total_amount_c || reservationData.totalAmount),
          status_c: reservationData.status_c || reservationData.status || "pending",
          payment_status_c: reservationData.payment_status_c || reservationData.paymentStatus || "pending",
          special_requests_c: reservationData.special_requests_c || reservationData.specialRequests || "",
          source_c: reservationData.source_c || reservationData.source || "website",
          created_at_c: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('reservation_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} reservations:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating reservation:", error);
      toast.error("Failed to create reservation");
      return null;
    }
  },

  async update(id, reservationData) {
    await delay();
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields + Id
      const updateData = {
        Id: parseInt(id)
      };

      if (reservationData.Name !== undefined) updateData.Name = reservationData.Name;
      if (reservationData.Tags !== undefined) updateData.Tags = reservationData.Tags;
      if (reservationData.guest_id_c !== undefined) updateData.guest_id_c = parseInt(reservationData.guest_id_c);
      if (reservationData.room_id_c !== undefined) updateData.room_id_c = parseInt(reservationData.room_id_c);
      if (reservationData.check_in_date_c !== undefined) updateData.check_in_date_c = reservationData.check_in_date_c;
      if (reservationData.check_out_date_c !== undefined) updateData.check_out_date_c = reservationData.check_out_date_c;
      if (reservationData.number_of_guests_c !== undefined) updateData.number_of_guests_c = parseInt(reservationData.number_of_guests_c);
      if (reservationData.room_rate_c !== undefined) updateData.room_rate_c = parseFloat(reservationData.room_rate_c);
      if (reservationData.total_amount_c !== undefined) updateData.total_amount_c = parseFloat(reservationData.total_amount_c);
      if (reservationData.status_c !== undefined) updateData.status_c = reservationData.status_c;
      if (reservationData.status !== undefined) updateData.status_c = reservationData.status;
      if (reservationData.payment_status_c !== undefined) updateData.payment_status_c = reservationData.payment_status_c;
      if (reservationData.special_requests_c !== undefined) updateData.special_requests_c = reservationData.special_requests_c;
      if (reservationData.source_c !== undefined) updateData.source_c = reservationData.source_c;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('reservation_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} reservations:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating reservation:", error);
      toast.error("Failed to update reservation");
      return null;
    }
  },

  async delete(id) {
    await delay();
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('reservation_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} reservations:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return true;
    } catch (error) {
      console.error("Error deleting reservation:", error);
      toast.error("Failed to delete reservation");
      return false;
    }
  }
};