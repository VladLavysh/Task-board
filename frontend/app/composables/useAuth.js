import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useStorage } from "@vueuse/core";

/**
 * Authentication store using Pinia and Vue Composition API
 *
 * Handles user authentication state, login, logout, registration, and token management
 */
export const useAuth = defineStore("auth", () => {
  // State
  const token = useStorage("task-board-token", "");
  const user = ref(null);
  const loading = ref(false);
  const error = ref("");

  // Getters
  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === "admin");
  const isUser = computed(() => user.value?.role === "user");
  const isGuest = computed(() => user.value?.role === "guest");

  // Fetch current user info from API using stored token
  async function fetchUser() {
    if (!token.value) return;

    try {
      loading.value = true;
      error.value = "";

      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      user.value = await response.json();
    } catch (err) {
      console.error("Error fetching user:", err);
      error.value = err.message;
      logout();
    } finally {
      loading.value = false;
    }
  }

  // Login user with email and password
  async function login(email, password) {
    try {
      loading.value = true;
      error.value = "";

      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Login failed");
      }

      const data = await response.json();
      token.value = data.access_token;
      await fetchUser();

      return true;
    } catch (err) {
      console.error("Login error:", err);
      error.value = err.message;
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Register a new user
  async function register(userData) {
    try {
      loading.value = true;
      error.value = "";

      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Registration failed");
      }

      const data = await response.json();
      token.value = data.access_token;
      user.value = data.user;

      return true;
    } catch (err) {
      console.error("Registration error:", err);
      error.value = err.message;
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Logout user and clear stored data
  async function logout() {
    try {
      if (token.value) {
        await fetch("/api/auth/sign-out", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      token.value = "";
      user.value = null;
    }
  }

  // Update user profile
  async function updateProfile(userData) {
    if (!token.value) return false;

    try {
      loading.value = true;
      error.value = "";

      const response = await fetch(`/api/users/${user.value.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token.value}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Profile update failed");
      }

      const updatedUser = await response.json();
      user.value = updatedUser;

      return true;
    } catch (err) {
      console.error("Profile update error:", err);
      error.value = err.message;
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Initialize auth on app start
  async function init() {
    if (token.value) {
      await fetchUser();
    }
  }

  return {
    // State
    user,
    loading,
    error,

    // Getters
    isAuthenticated,
    isAdmin,
    isUser,
    isGuest,

    // Actions
    login,
    register,
    logout,
    fetchUser,
    updateProfile,
    init,
  };
});
