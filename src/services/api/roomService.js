import { toast } from 'react-toastify';

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const roomService = {
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
          {"field": {"Name": "number_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "floor_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "last_cleaned_c"}},
          {"field": {"Name": "base_rate_c"}},
          {"field": {"Name": "max_occupancy_c"}},
          {"field": {"Name": "amenities_c"}},
          {"field": {"Name": "maintenance_notes_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await apperClient.fetchRecords('room_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Failed to load rooms");
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
          {"field": {"Name": "number_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "floor_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "last_cleaned_c"}},
          {"field": {"Name": "base_rate_c"}},
          {"field": {"Name": "max_occupancy_c"}},
          {"field": {"Name": "amenities_c"}},
          {"field": {"Name": "maintenance_notes_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await apperClient.getRecordById('room_c', id, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching room ${id}:`, error);
      toast.error("Failed to load room");
      return null;
    }
  },

  async create(roomData) {
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
          Name: roomData.Name || `Room ${roomData.number_c}`,
          Tags: roomData.Tags || "",
          number_c: roomData.number_c,
          type_c: roomData.type_c,
          floor_c: parseInt(roomData.floor_c),
          status_c: roomData.status_c || "vacant-clean",
          last_cleaned_c: roomData.last_cleaned_c || new Date().toISOString(),
          base_rate_c: parseFloat(roomData.base_rate_c),
          max_occupancy_c: parseInt(roomData.max_occupancy_c),
          amenities_c: roomData.amenities_c || "",
          maintenance_notes_c: roomData.maintenance_notes_c || ""
        }]
      };

      const response = await apperClient.createRecord('room_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} rooms:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("Failed to create room");
      return null;
    }
  },

  async update(id, roomData) {
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

      if (roomData.Name !== undefined) updateData.Name = roomData.Name;
      if (roomData.Tags !== undefined) updateData.Tags = roomData.Tags;
      if (roomData.number_c !== undefined) updateData.number_c = roomData.number_c;
      if (roomData.type_c !== undefined) updateData.type_c = roomData.type_c;
      if (roomData.floor_c !== undefined) updateData.floor_c = parseInt(roomData.floor_c);
      if (roomData.status_c !== undefined) updateData.status_c = roomData.status_c;
      if (roomData.last_cleaned_c !== undefined) updateData.last_cleaned_c = roomData.last_cleaned_c;
      if (roomData.base_rate_c !== undefined) updateData.base_rate_c = parseFloat(roomData.base_rate_c);
      if (roomData.max_occupancy_c !== undefined) updateData.max_occupancy_c = parseInt(roomData.max_occupancy_c);
      if (roomData.amenities_c !== undefined) updateData.amenities_c = roomData.amenities_c;
      if (roomData.maintenance_notes_c !== undefined) updateData.maintenance_notes_c = roomData.maintenance_notes_c;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('room_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} rooms:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating room:", error);
      toast.error("Failed to update room");
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

      const response = await apperClient.deleteRecord('room_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} rooms:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return true;
    } catch (error) {
      console.error("Error deleting room:", error);
      toast.error("Failed to delete room");
      return false;
    }
  }
};