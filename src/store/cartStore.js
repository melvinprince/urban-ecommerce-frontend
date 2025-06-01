import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiService from "@/lib/apiService";
import EventBus from "@/lib/eventBus";

const useCartStore = create(
  persist(
    (set, get) => {
      const isLoggedIn = () => {
        const useAuthStore = require("./authStore").default;
        return useAuthStore.getState().isLoggedIn;
      };

      // Clear cart on logout
      EventBus.on("user:logout", () => {
        set({
          items: [],
          totalItems: 0,
          subtotal: 0,
          isLoaded: true,
          error: null,
        });
      });

      return {
        items: [],
        totalItems: 0,
        subtotal: 0,
        isLoaded: false,
        error: null,

        fetchCart: async () => {
          try {
            const response = await apiService.cart.get();
            const { items, totalItems, subtotal } = response.data;
            set({
              items,
              totalItems,
              subtotal,
              isLoaded: true,
              error: null,
            });
          } catch {
            const guest = get().items || [];
            const total = guest.reduce((s, i) => s + i.quantity, 0);
            const sum = guest.reduce(
              (s, i) => s + i.quantity * (i.product?.price || 0),
              0
            );
            set({
              items: guest,
              totalItems: total,
              subtotal: sum,
              isLoaded: true,
              error: null,
            });
          }
        },

        addItem: async (item) => {
          const { productId, quantity = 1, size, color } = item;

          if (isLoggedIn()) {
            try {
              const response = await apiService.cart.addOrUpdate({
                productId,
                quantity,
                size,
                color,
              });
              const { items, totalItems, subtotal } = response.data;
              set({
                items,
                totalItems,
                subtotal,
                isLoaded: true,
                error: null,
              });
            } catch (err) {
              set({ error: err.message });
              throw err;
            }
          } else {
            const store = get();
            let updated = [...store.items];
            const idx = updated.findIndex(
              (i) =>
                i.product?._id === productId &&
                i.size === size &&
                i.color === color
            );

            if (idx > -1) {
              updated[idx].quantity += quantity;
            } else {
              updated.push({
                _id: Date.now().toString(),
                product: item.product,
                quantity,
                size,
                color,
              });
            }

            const total = updated.reduce((s, i) => s + i.quantity, 0);
            const sum = updated.reduce(
              (s, i) => s + i.quantity * (i.product?.price || 0),
              0
            );
            set({ items: updated, totalItems: total, subtotal: sum });
          }
        },

        removeItem: async (itemId) => {
          if (isLoggedIn()) {
            try {
              const response = await apiService.cart.remove(itemId);
              const { items, totalItems, subtotal } = response.data;
              set({
                items,
                totalItems,
                subtotal,
                error: null,
              });
            } catch (err) {
              set({ error: err.message });
            }
          } else {
            const store = get();
            const updated = store.items.filter((i) => i._id !== itemId);
            const total = updated.reduce((s, i) => s + i.quantity, 0);
            const sum = updated.reduce(
              (s, i) => s + i.quantity * (i.product?.price || 0),
              0
            );
            set({ items: updated, totalItems: total, subtotal: sum });
          }
        },

        updateItem: async (itemId, updates) => {
          if (isLoggedIn()) {
            try {
              const response = await apiService.cart.update(itemId, updates);
              const { items, totalItems, subtotal } = response.data;
              set({
                items,
                totalItems,
                subtotal,
                error: null,
              });
            } catch (err) {
              set({ error: err.message });
            }
          } else {
            const store = get();
            const updated = store.items.map((i) =>
              i._id === itemId ? { ...i, ...updates } : i
            );
            const total = updated.reduce((s, i) => s + i.quantity, 0);
            const sum = updated.reduce(
              (s, i) => s + i.quantity * (i.product?.price || 0),
              0
            );
            set({ items: updated, totalItems: total, subtotal: sum });
          }
        },

        clearCart: async () => {
          if (isLoggedIn()) {
            try {
              const response = await apiService.cart.clear();
              const { items, totalItems, subtotal } = response.data;
              set({
                items,
                totalItems,
                subtotal,
                isLoaded: true,
                error: null,
              });
            } catch {
              // ignore
            }
          } else {
            set({
              items: [],
              totalItems: 0,
              subtotal: 0,
              isLoaded: true,
              error: null,
            });
          }
        },
      };
    },
    { name: "cart-storage" }
  )
);

export default useCartStore;
