import { create } from "zustand";
import apiService from "@/lib/apiService"; // Replace old API import
import EventBus from "@/lib/eventBus"; // Import EventBus

const useAuthStore = create((set, get) => ({
  isLoggedIn: false,
  token: null, // not used anymore, but kept for compatibility
  user: null,
  hydrated: false,
  redirectPath: "/",

  login: async (credentials) => {
    try {
      await apiService.auth.login(credentials); // Updated API call
      const res = await apiService.auth.getCurrentUser(); // Fetch user info after login
      set({
        isLoggedIn: true,
        token: null,
        user: res.data,
        hydrated: true,
      });
      EventBus.emit("user:login", res.data); // Emit login event with user data
    } catch (err) {
      set({ isLoggedIn: false, token: null, user: null, hydrated: true });
      throw err;
    }
  },

  logout: async () => {
    try {
      await apiService.auth.logout(); // Updated API call
    } catch (err) {
      console.warn("[AuthStore] ❌ Logout failed:", err.message);
    }
    set({ isLoggedIn: false, token: null, user: null, hydrated: true });
    EventBus.emit("user:logout"); // Emit logout event
  },

  initializeAuth: async () => {
    try {
      const res = await apiService.auth.getCurrentUser(); // Updated API call
      set({
        isLoggedIn: true,
        token: null,
        user: res.data,
        hydrated: true,
      });
    } catch (err) {
      set({ isLoggedIn: false, token: null, user: null, hydrated: true });
    }
  },

  refreshUser: async () => {
    try {
      const res = await apiService.auth.getCurrentUser(); // Updated API call
      set({
        isLoggedIn: true,
        token: null,
        user: res.data,
        hydrated: true,
      });
    } catch (err) {
      set({ isLoggedIn: false, token: null, user: null, hydrated: true });
    }
  },

  setRedirectPath: (path) => {
    set({ redirectPath: path });
  },
}));

export default useAuthStore;
