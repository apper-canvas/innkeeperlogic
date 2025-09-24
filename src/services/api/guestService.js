import { toast } from 'react-toastify';

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const guestService = {
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
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "id_document_c"}},
          {"field": {"Name": "vip_status_c"}},
          {"field": {"Name": "special_requests_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await apperClient.fetchRecords('guest_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching guests:", error);
      toast.error("Failed to load guests");
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
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "id_document_c"}},
          {"field": {"Name": "vip_status_c"}},
          {"field": {"Name": "special_requests_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await apperClient.getRecordById('guest_c', id, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching guest ${id}:`, error);
      toast.error("Failed to load guest");
      return null;
    }
  },

  async create(guestData) {
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
          Name: guestData.Name || `${guestData.first_name_c} ${guestData.last_name_c}`,
          Tags: guestData.Tags || "",
          first_name_c: guestData.first_name_c,
          last_name_c: guestData.last_name_c,
          email_c: guestData.email_c,
          phone_c: guestData.phone_c,
          address_c: guestData.address_c || "",
          id_document_c: guestData.id_document_c || "",
          vip_status_c: Boolean(guestData.vip_status_c),
          special_requests_c: guestData.special_requests_c || "",
          created_at_c: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('guest_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} guests:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating guest:", error);
      toast.error("Failed to create guest");
      return null;
    }
  },

  async update(id, guestData) {
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

      if (guestData.Name !== undefined) updateData.Name = guestData.Name;
      if (guestData.Tags !== undefined) updateData.Tags = guestData.Tags;
      if (guestData.first_name_c !== undefined) updateData.first_name_c = guestData.first_name_c;
      if (guestData.last_name_c !== undefined) updateData.last_name_c = guestData.last_name_c;
      if (guestData.email_c !== undefined) updateData.email_c = guestData.email_c;
      if (guestData.phone_c !== undefined) updateData.phone_c = guestData.phone_c;
      if (guestData.address_c !== undefined) updateData.address_c = guestData.address_c;
      if (guestData.id_document_c !== undefined) updateData.id_document_c = guestData.id_document_c;
      if (guestData.vip_status_c !== undefined) updateData.vip_status_c = Boolean(guestData.vip_status_c);
      if (guestData.special_requests_c !== undefined) updateData.special_requests_c = guestData.special_requests_c;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('guest_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} guests:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating guest:", error);
      toast.error("Failed to update guest");
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

      const response = await apperClient.deleteRecord('guest_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} guests:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return true;
    } catch (error) {
      console.error("Error deleting guest:", error);
      toast.error("Failed to delete guest");
      return false;
    }
  }
};