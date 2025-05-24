import { create } from "zustand";
import api from "@/lib/api";
import useCartStore from "./cartStore";

const useAuthStore = create((set) => ({
  isLoggedIn: false,
  token: null, // not used anymore, but kept for compatibility
  user: null,
  hydrated: false,
  redirectPath: "/",

  login: async (credentials) => {
    try {
      await api.post("/api/auth/login", credentials); // Cookie is set by backend
      const res = await api.get("/api/auth/me"); // Fetch user info after login
      set({
        isLoggedIn: true,
        token: null,
        user: res.data,
        hydrated: true,
      });
    } catch (err) {
      set({ isLoggedIn: false, token: null, user: null, hydrated: true });
      throw err;
    }
  },

  logout: async () => {
    try {
      await api.post("/api/auth/logout"); // Call logout endpoint in backend
    } catch (err) {
      console.warn("Logout failed:", err.message);
    }
    set({ isLoggedIn: false, token: null, user: null, hydrated: true });
    useCartStore.getState().clearCart();
  },

  initializeAuth: async () => {
    try {
      const res = await api.get("/api/auth/me");
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
      const res = await api.get("/api/auth/me");
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

  setRedirectPath: (path) => set({ redirectPath: path }),
}));

export default useAuthStore;
