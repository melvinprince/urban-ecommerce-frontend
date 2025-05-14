import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

const useAuthStore = create((set) => ({
  isLoggedIn: false,
  token: null,
  user: null,
  hydrated: false, // 🛠 NEW state

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
}));

export default useAuthStore;
