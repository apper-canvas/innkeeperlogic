import { toast } from 'react-toastify';

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const housekeepingService = {
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
          {"field": {"Name": "room_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "room_id_c"}, "referenceField": {"field": {"Name": "number_c"}}},
          {"field": {"Name": "room_id_c"}, "referenceField": {"field": {"Name": "type_c"}}},
          {"field": {"Name": "assigned_to_c"}},
          {"field": {"Name": "task_type_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "estimated_time_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await apperClient.fetchRecords('housekeeping_task_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform data for compatibility with existing UI
      const transformedData = (response.data || []).map(task => ({
        ...task,
        roomNumber: task.room_id_c?.number_c || "Unknown Room",
        roomType: task.room_id_c?.type_c || "Unknown Type",
        roomId: task.room_id_c?.Id,
        assignedTo: task.assigned_to_c,
        taskType: task.task_type_c,
        priority: task.priority_c,
        status: task.status_c,
        estimatedTime: task.estimated_time_c,
        completedAt: task.completed_at_c,
        notes: task.notes_c
      }));

      return transformedData;
    } catch (error) {
      console.error("Error fetching housekeeping tasks:", error);
      toast.error("Failed to load housekeeping tasks");
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
          {"field": {"Name": "room_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "room_id_c"}, "referenceField": {"field": {"Name": "number_c"}}},
          {"field": {"Name": "room_id_c"}, "referenceField": {"field": {"Name": "type_c"}}},
          {"field": {"Name": "assigned_to_c"}},
          {"field": {"Name": "task_type_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "estimated_time_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await apperClient.getRecordById('housekeeping_task_c', id, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      // Transform data for compatibility
      const task = response.data;
      if (!task) return null;

      return {
        ...task,
        roomNumber: task.room_id_c?.number_c || "Unknown Room",
        roomType: task.room_id_c?.type_c || "Unknown Type",
        roomId: task.room_id_c?.Id,
        assignedTo: task.assigned_to_c,
        taskType: task.task_type_c,
        priority: task.priority_c,
        status: task.status_c,
        estimatedTime: task.estimated_time_c,
        completedAt: task.completed_at_c,
        notes: task.notes_c
      };
    } catch (error) {
      console.error(`Error fetching housekeeping task ${id}:`, error);
      toast.error("Failed to load housekeeping task");
      return null;
    }
  },

  async create(taskData) {
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
          Name: taskData.Name || `${taskData.task_type_c} - Room ${taskData.roomNumber}`,
          Tags: taskData.Tags || "",
          room_id_c: parseInt(taskData.room_id_c || taskData.roomId),
          assigned_to_c: taskData.assigned_to_c || taskData.assignedTo || "",
          task_type_c: taskData.task_type_c || taskData.taskType || "",
          priority_c: taskData.priority_c || taskData.priority || "medium",
          status_c: taskData.status_c || taskData.status || "pending",
          estimated_time_c: parseInt(taskData.estimated_time_c || taskData.estimatedTime || 30),
          completed_at_c: taskData.completed_at_c || taskData.completedAt || null,
          notes_c: taskData.notes_c || taskData.notes || ""
        }]
      };

      const response = await apperClient.createRecord('housekeeping_task_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} housekeeping tasks:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating housekeeping task:", error);
      toast.error("Failed to create housekeeping task");
      return null;
    }
  },

  async update(id, taskData) {
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

      if (taskData.Name !== undefined) updateData.Name = taskData.Name;
      if (taskData.Tags !== undefined) updateData.Tags = taskData.Tags;
      if (taskData.room_id_c !== undefined) updateData.room_id_c = parseInt(taskData.room_id_c);
      if (taskData.assigned_to_c !== undefined) updateData.assigned_to_c = taskData.assigned_to_c;
      if (taskData.task_type_c !== undefined) updateData.task_type_c = taskData.task_type_c;
      if (taskData.priority_c !== undefined) updateData.priority_c = taskData.priority_c;
      if (taskData.status_c !== undefined) updateData.status_c = taskData.status_c;
      if (taskData.status !== undefined) updateData.status_c = taskData.status;
      if (taskData.estimated_time_c !== undefined) updateData.estimated_time_c = parseInt(taskData.estimated_time_c);
      if (taskData.completed_at_c !== undefined) updateData.completed_at_c = taskData.completed_at_c;
      if (taskData.completedAt !== undefined) updateData.completed_at_c = taskData.completedAt;
      if (taskData.notes_c !== undefined) updateData.notes_c = taskData.notes_c;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('housekeeping_task_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} housekeeping tasks:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating housekeeping task:", error);
      toast.error("Failed to update housekeeping task");
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

      const response = await apperClient.deleteRecord('housekeeping_task_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} housekeeping tasks:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return true;
    } catch (error) {
      console.error("Error deleting housekeeping task:", error);
      toast.error("Failed to delete housekeeping task");
      return false;
    }
  }
};