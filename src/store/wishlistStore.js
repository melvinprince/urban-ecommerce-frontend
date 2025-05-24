import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiService from "@/lib/apiService"; // 🆕 Use centralized API service
import EventBus from "@/lib/eventBus"; // Import EventBus

const useWishlistStore = create(
  persist(
    (set, get) => {
      const isLoggedIn = () => {
        const useAuthStore = require("./authStore").default;
        return useAuthStore.getState().isLoggedIn;
      };

      // Subscribe to logout event
      EventBus.on("user:logout", () => {
        set({ items: [] });
      });

      return {
        items: [], // array of { _id, product }
        isLoaded: false,
        error: null,

        fetchWishlist: async () => {
          if (isLoggedIn()) {
            try {
              const res = await apiService.wishlist.get(); // ✅ CORRECT method
              set({ items: res.data, isLoaded: true, error: null });
              return;
            } catch (err) {
              console.error(
                "[WishlistStore] Server fetch failed, falling back to guest wishlist"
              );
            }
          }
          set({ items: get().items || [], isLoaded: true, error: null });
        },

        addItem: async (product) => {
          if (isLoggedIn()) {
            const res = await apiService.wishlist.add({
              productId: product._id,
            }); // ✅ CORRECT
            set({ items: res.data, error: null });
          } else {
            const store = get();
            const exists = store.items.some(
              (i) => i.product._id === product._id
            );
            const updated = exists
              ? store.items
              : [...store.items, { _id: Date.now().toString(), product }];
            set({ items: updated, error: null });
          }
        },

        removeItem: async (itemId) => {
          if (isLoggedIn()) {
            const res = await apiService.wishlist.remove(itemId); // ✅ CORRECT
            set({ items: res.data, error: null });
          } else {
            const store = get();
            const updated = store.items.filter((i) => i._id !== itemId);
            set({ items: updated, error: null });
          }
        },

        clearWishlist: async () => {
          if (isLoggedIn()) {
            await apiService.wishlist.clear(); // ✅ CORRECT
          }
          set({ items: [] });
        },
      };
    },
    { name: "wishlist-storage" }
  )
);

export default useWishlistStore;
