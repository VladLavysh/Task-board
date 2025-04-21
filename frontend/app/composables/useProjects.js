import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAuth } from "./useAuth";

/**
 * Project store using Pinia and Vue Composition API
 *
 * Handles project data management, fetching, creating, updating, and deleting projects
 */
export const useProjects = defineStore("projects", () => {
  // Get auth store to access authentication token
  const auth = useAuth();

  // State
  const projects = ref([]);
  const currentProject = ref(null);
  const loading = ref(false);
  const error = ref("");

  // Getters
  const sortedProjects = computed(() => {
    return [...projects.value].sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  });

  const projectsByStatus = computed(() => {
    const result = {
      "Not started": [],
      Ongoing: [],
      Finished: [],
    };

    projects.value.forEach((project) => {
      if (result[project.status]) {
        result[project.status].push(project);
      } else {
        result["Not started"].push(project);
      }
    });

    return result;
  });

  // Fetch all projects
  async function fetchProjects(filters = {}) {
    if (!auth.isAuthenticated) return;

    try {
      loading.value = true;
      error.value = "";

      // Build query string from filters
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const query = queryParams.toString() ? `?${queryParams.toString()}` : "";

      const response = await fetch(`/api/projects${query}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      projects.value = await response.json();
    } catch (err) {
      console.error("Error fetching projects:", err);
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  // Fetch a single project by ID
  async function fetchProject(id) {
    if (!auth.isAuthenticated) return;

    try {
      loading.value = true;
      error.value = "";

      const response = await fetch(`/api/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch project");
      }

      currentProject.value = await response.json();
      return currentProject.value;
    } catch (err) {
      console.error(`Error fetching project ${id}:`, err);
      error.value = err.message;
      return null;
    } finally {
      loading.value = false;
    }
  }

  // Create a new project
  async function createProject(projectData) {
    if (!auth.isAuthenticated) return;

    try {
      loading.value = true;
      error.value = "";

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create project");
      }

      const newProject = await response.json();
      projects.value.push(newProject);
      return newProject;
    } catch (err) {
      console.error("Error creating project:", err);
      error.value = err.message;
      return null;
    } finally {
      loading.value = false;
    }
  }

  // Update a project
  async function updateProject(id, projectData) {
    if (!auth.isAuthenticated) return;

    try {
      loading.value = true;
      error.value = "";

      const response = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update project");
      }

      const updatedProject = await response.json();

      // Update the project in the projects array
      const index = projects.value.findIndex((p) => p.id === id);
      if (index !== -1) {
        projects.value[index] = updatedProject;
      }

      // Update currentProject if it's the one being edited
      if (currentProject.value && currentProject.value.id === id) {
        currentProject.value = updatedProject;
      }

      return updatedProject;
    } catch (err) {
      console.error(`Error updating project ${id}:`, err);
      error.value = err.message;
      return null;
    } finally {
      loading.value = false;
    }
  }

  // Delete a project
  async function deleteProject(id) {
    if (!auth.isAuthenticated) return;

    try {
      loading.value = true;
      error.value = "";

      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete project");
      }

      // Remove the project from the projects array
      projects.value = projects.value.filter((p) => p.id !== id);

      // Clear currentProject if it's the one being deleted
      if (currentProject.value && currentProject.value.id === id) {
        currentProject.value = null;
      }

      return true;
    } catch (err) {
      console.error(`Error deleting project ${id}:`, err);
      error.value = err.message;
      return false;
    } finally {
      loading.value = false;
    }
  }

  return {
    // State
    projects,
    currentProject,
    loading,
    error,

    // Getters
    sortedProjects,
    projectsByStatus,

    // Actions
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
  };
});
