import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

const useAuthStore = create((set) => ({
  isLoggedIn: false,
  token: null,
  user: null,
  hydrated: false,
  redirectPath: "/", // 🆕 new field to store intended page

  login: (token) => {
    const decoded = jwtDecode(token);
    set({
      isLoggedIn: true,
      token,
      user: decoded,
      hydrated: true,
    });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ isLoggedIn: false, token: null, user: null, hydrated: true });
  },

  initializeAuth: () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      set({
        isLoggedIn: true,
        token,
        user: decoded,
        hydrated: true,
      });
    } else {
      set({ hydrated: true });
    }
  },

  setRedirectPath: (path) => set({ redirectPath: path }), // 🆕 new action
}));
export default useAuthStore;
