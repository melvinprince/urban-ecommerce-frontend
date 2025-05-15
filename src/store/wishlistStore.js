import { create } from "zustand";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from "@/lib/api"; // 🆕 API functions
import useAuthStore from "./authStore";

const useWishlistStore = create((set, get) => {
  const isLoggedIn = () => useAuthStore.getState().isLoggedIn;

  return {
    items: [], // array of { _id, product }
    isLoaded: false,
    error: null,

    fetchWishlist: async () => {
      if (isLoggedIn()) {
        try {
          const { data } = await getWishlist(); // 🆕
          set({ items: data, isLoaded: true, error: null });
          localStorage.setItem("wishlist", JSON.stringify(data));
          return;
        } catch (err) {
          // fall through to guest
        }
      }
      const guest = JSON.parse(localStorage.getItem("wishlist") || "[]");
      set({ items: guest, isLoaded: true, error: null });
    },

    addItem: async (product) => {
      if (isLoggedIn()) {
        const { data } = await addToWishlist({ productId: product._id }); // 🆕
        set({ items: data, error: null });
        localStorage.setItem("wishlist", JSON.stringify(data));
      } else {
        const store = get();
        const exists = store.items.some((i) => i.product._id === product._id);
        const updated = exists
          ? store.items
          : [...store.items, { _id: Date.now().toString(), product }];
        set({ items: updated, error: null });
        localStorage.setItem("wishlist", JSON.stringify(updated));
      }
    },

    removeItem: async (itemId) => {
      if (isLoggedIn()) {
        const { data } = await removeFromWishlist(itemId); // 🆕
        set({ items: data, error: null });
        localStorage.setItem("wishlist", JSON.stringify(data));
      } else {
        const store = get();
        const updated = store.items.filter((i) => i._id !== itemId);
        set({ items: updated, error: null });
        localStorage.setItem("wishlist", JSON.stringify(updated));
      }
    },

    clearWishlist: async () => {
      if (isLoggedIn()) {
        await clearWishlist(); // 🆕
      }
      set({ items: [] });
      localStorage.removeItem("wishlist");
    },
  };
});

export default useWishlistStore;
