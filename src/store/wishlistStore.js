// src/store/wishlistStore.js

import { create } from "zustand";
import api from "@/lib/api";
import useAuthStore from "./authStore";

const useWishlistStore = create((set, get) => {
  const isLoggedIn = () => useAuthStore.getState().isLoggedIn;
  const authToken = () => localStorage.getItem("token");

  return {
    items: [], // array of { _id, product }
    isLoaded: false,
    error: null,

    // Fetch wishlist from server or localStorage
    fetchWishlist: async () => {
      if (isLoggedIn()) {
        try {
          const res = await api.get("/api/wishlist", {
            headers: { Authorization: `Bearer ${authToken()}` },
          });
          set({ items: res.data.data, isLoaded: true, error: null });
          localStorage.setItem("wishlist", JSON.stringify(res.data.data));
          return;
        } catch {
          // fall back to guest
        }
      }
      const guest = JSON.parse(localStorage.getItem("wishlist") || "[]");
      set({ items: guest, isLoaded: true, error: null });
    },

    // Add product to wishlist
    addItem: async (product) => {
      if (isLoggedIn()) {
        const res = await api.post(
          "/api/wishlist",
          { productId: product._id },
          { headers: { Authorization: `Bearer ${authToken()}` } }
        );
        set({ items: res.data.data, error: null });
        localStorage.setItem("wishlist", JSON.stringify(res.data.data));
      } else {
        const store = get();
        const exists = store.items.some((i) => i.product._id === product._id);
        let updated = exists
          ? store.items
          : [...store.items, { _id: Date.now().toString(), product }];
        set({ items: updated, error: null });
        localStorage.setItem("wishlist", JSON.stringify(updated));
      }
    },

    // Remove item from wishlist
    removeItem: async (itemId) => {
      if (isLoggedIn()) {
        const res = await api.delete(`/api/wishlist/${itemId}`, {
          headers: { Authorization: `Bearer ${authToken()}` },
        });
        set({ items: res.data.data, error: null });
        localStorage.setItem("wishlist", JSON.stringify(res.data.data));
      } else {
        const store = get();
        const updated = store.items.filter((i) => i._id !== itemId);
        set({ items: updated, error: null });
        localStorage.setItem("wishlist", JSON.stringify(updated));
      }
    },

    // Clear entire wishlist (e.g., on logout)
    clearWishlist: () => {
      set({ items: [] });
      localStorage.removeItem("wishlist");
    },
  };
});

export default useWishlistStore;
