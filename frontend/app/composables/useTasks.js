import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAuth } from "./useAuth";

/**
 * Tasks store using Pinia and Vue Composition API
 *
 * Handles task data management, fetching, creating, updating,
 * and deleting tasks within projects
 */
export const useTasks = defineStore("tasks", () => {
  // Get auth store to access authentication token
  const auth = useAuth();

  // State
  const tasks = ref([]);
  const currentTask = ref(null);
  const loading = ref(false);
  const error = ref("");

  // Getters
  const tasksByStatus = computed(() => {
    const result = {
      "To Do": [],
      "In Progress": [],
      "In Review": [],
      Completed: [],
      Blocked: [],
    };

    tasks.value.forEach((task) => {
      if (result[task.status]) {
        result[task.status].push(task);
      } else {
        result["To Do"].push(task);
      }
    });

    return result;
  });

  const sortedTasks = computed(() => {
    return [...tasks.value].sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  });

  // Fetch all tasks for a project
  async function fetchTasks(projectId, filters = {}) {
    if (!auth.isAuthenticated || !projectId) return;

    try {
      loading.value = true;
      error.value = "";

      // Build query string from filters
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const query = queryParams.toString() ? `?${queryParams.toString()}` : "";

      const response = await fetch(`/api/projects/${projectId}/tasks${query}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      tasks.value = await response.json();
      return tasks.value;
    } catch (err) {
      console.error("Error fetching tasks:", err);
      error.value = err.message;
      return [];
    } finally {
      loading.value = false;
    }
  }

  // Fetch a single task by ID
  async function fetchTask(projectId, taskId) {
    if (!auth.isAuthenticated || !projectId || !taskId) return;

    try {
      loading.value = true;
      error.value = "";

      const response = await fetch(
        `/api/projects/${projectId}/tasks/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch task");
      }

      currentTask.value = await response.json();
      return currentTask.value;
    } catch (err) {
      console.error(`Error fetching task ${taskId}:`, err);
      error.value = err.message;
      return null;
    } finally {
      loading.value = false;
    }
  }

  // Create a new task
  async function createTask(projectId, taskData) {
    if (!auth.isAuthenticated || !projectId) return;

    try {
      loading.value = true;
      error.value = "";

      const response = await fetch(`/api/projects/${projectId}/tasks`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create task");
      }

      const newTask = await response.json();
      tasks.value.push(newTask);
      return newTask;
    } catch (err) {
      console.error("Error creating task:", err);
      error.value = err.message;
      return null;
    } finally {
      loading.value = false;
    }
  }

  // Update a task
  async function updateTask(projectId, taskId, taskData) {
    if (!auth.isAuthenticated || !projectId || !taskId) return;

    try {
      loading.value = true;
      error.value = "";

      const response = await fetch(
        `/api/projects/${projectId}/tasks/${taskId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update task");
      }

      const updatedTask = await response.json();

      // Update the task in the tasks array
      const index = tasks.value.findIndex((t) => t.id === taskId);
      if (index !== -1) {
        tasks.value[index] = updatedTask;
      }

      // Update currentTask if it's the one being edited
      if (currentTask.value && currentTask.value.id === taskId) {
        currentTask.value = updatedTask;
      }

      return updatedTask;
    } catch (err) {
      console.error(`Error updating task ${taskId}:`, err);
      error.value = err.message;
      return null;
    } finally {
      loading.value = false;
    }
  }

  // Delete a task
  async function deleteTask(projectId, taskId) {
    if (!auth.isAuthenticated || !projectId || !taskId) return;

    try {
      loading.value = true;
      error.value = "";

      const response = await fetch(
        `/api/projects/${projectId}/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete task");
      }

      // Remove the task from the tasks array
      tasks.value = tasks.value.filter((t) => t.id !== taskId);

      // Clear currentTask if it's the one being deleted
      if (currentTask.value && currentTask.value.id === taskId) {
        currentTask.value = null;
      }

      return true;
    } catch (err) {
      console.error(`Error deleting task ${taskId}:`, err);
      error.value = err.message;
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Update a task's status
  async function updateTaskStatus(projectId, taskId, newStatus) {
    return updateTask(projectId, taskId, { status: newStatus });
  }

  // Clear tasks when switching projects
  function clearTasks() {
    tasks.value = [];
    currentTask.value = null;
    error.value = "";
  }

  return {
    // State
    tasks,
    currentTask,
    loading,
    error,

    // Getters
    tasksByStatus,
    sortedTasks,

    // Actions
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    clearTasks,
  };
});
