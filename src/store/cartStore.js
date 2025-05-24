import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiService from "@/lib/apiService"; // 🆕 Use centralized API service
import EventBus from "@/lib/eventBus"; // Use from lib folder

const useCartStore = create(
  persist(
    (set, get) => {
      const isLoggedIn = () => {
        // Dynamically import to avoid cyclic deps
        const useAuthStore = require("./authStore").default;
        return useAuthStore.getState().isLoggedIn;
      };

      // Subscribe to logout event
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
          if (isLoggedIn()) {
            try {
              const { data } = await apiService.cart.getCart(); // 🆕
              set({
                items: data.items,
                totalItems: data.totalItems,
                subtotal: data.subtotal,
                isLoaded: true,
                error: null,
              });
              return;
            } catch (err) {
              console.error(
                "[CartStore] Server fetch failed, falling back to guest cart"
              );
            }
          }
          const guest = get().items || [];
          const total = guest.reduce((s, i) => s + i.quantity, 0);
          const sum = guest.reduce(
            (s, i) => s + i.quantity * (i.product.price || 0),
            0
          );
          set({
            items: guest,
            totalItems: total,
            subtotal: sum,
            isLoaded: true,
            error: null,
          });
        },

        addItem: async (item) => {
          const { productId, quantity = 1, size, color } = item;
          if (isLoggedIn()) {
            const { data } = await apiService.cart.addOrUpdate({
              productId,
              quantity,
              size,
              color,
            });
            set({
              items: data.items,
              totalItems: data.totalItems,
              subtotal: data.subtotal,
              error: null,
            });
          } else {
            const store = get();
            let updated = [...store.items];
            const idx = updated.findIndex(
              (i) =>
                i.product._id === productId &&
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
              (s, i) => s + i.quantity * (i.product.price || 0),
              0
            );
            set({ items: updated, totalItems: total, subtotal: sum });
          }
        },

        removeItem: async (itemId) => {
          if (isLoggedIn()) {
            const { data } = await apiService.cart.removeItem(itemId);
            set({
              items: data.items,
              totalItems: data.totalItems,
              subtotal: data.subtotal,
              error: null,
            });
          } else {
            const store = get();
            const updated = store.items.filter((i) => i._id !== itemId);
            const total = updated.reduce((s, i) => s + i.quantity, 0);
            const sum = updated.reduce(
              (s, i) => s + i.quantity * (i.product.price || 0),
              0
            );
            set({ items: updated, totalItems: total, subtotal: sum });
          }
        },

        updateItem: async (itemId, updates) => {
          if (isLoggedIn()) {
            const { data } = await apiService.cart.updateItem(itemId, updates);
            set({
              items: data.items,
              totalItems: data.totalItems,
              subtotal: data.subtotal,
              error: null,
            });
          } else {
            const store = get();
            const updated = store.items.map((i) =>
              i._id === itemId ? { ...i, ...updates } : i
            );
            const total = updated.reduce((s, i) => s + i.quantity, 0);
            const sum = updated.reduce(
              (s, i) => s + i.quantity * (i.product.price || 0),
              0
            );
            set({ items: updated, totalItems: total, subtotal: sum });
          }
        },

        clearCart: async () => {
          if (isLoggedIn()) {
            try {
              const { data } = await apiService.cart.clear();
              set({
                items: data.items,
                totalItems: data.totalItems,
                subtotal: data.subtotal,
                isLoaded: true,
                error: null,
              });
            } catch (err) {
              console.error(
                "[CartStore] Server cart clear failed:",
                err.message
              );
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
