import { create } from "zustand";
import api from "@/lib/api"; // ← added missing closing quote
import useAuthStore from "./authStore";

const useCartStore = create((set, get) => {
  // helper to check login & get token
  const isLoggedIn = () => useAuthStore.getState().isLoggedIn;
  const authToken = () => localStorage.getItem("token");

  return {
    items: [],
    totalItems: 0,
    subtotal: 0,
    isLoaded: false,
    error: null,

    fetchCart: async () => {
      if (isLoggedIn()) {
        try {
          const res = await api.get("/api/cart", {
            headers: { Authorization: `Bearer ${authToken()}` },
          });
          const { data, totalItems, subtotal } = res.data;
          set({
            items: data,
            totalItems,
            subtotal,
            isLoaded: true,
            error: null,
          });
          localStorage.setItem("cart", JSON.stringify(data));
          return;
        } catch {
          // fall through to guest
        }
      }
      // guest fallback
      const guest = JSON.parse(localStorage.getItem("cart") || "[]");
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
        // persist to DB
        const res = await api.post(
          "/api/cart",
          { productId, quantity, size, color },
          { headers: { Authorization: `Bearer ${authToken()}` } }
        );
        const { data, totalItems, subtotal } = res.data;
        set({ items: data, totalItems, subtotal, error: null });
        localStorage.setItem("cart", JSON.stringify(data));
      } else {
        // guest
        const store = get();
        let updated = [...store.items];
        const idx = updated.findIndex(
          (i) =>
            i.product._id === productId && i.size === size && i.color === color
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
        localStorage.setItem("cart", JSON.stringify(updated));
      }
    },

    removeItem: async (itemId) => {
      if (isLoggedIn()) {
        const res = await api.delete(`/api/cart/${itemId}`, {
          headers: { Authorization: `Bearer ${authToken()}` },
        });
        const { data, totalItems, subtotal } = res.data;
        set({ items: data, totalItems, subtotal, error: null });
        localStorage.setItem("cart", JSON.stringify(data));
      } else {
        const store = get();
        const updated = store.items.filter((i) => i._id !== itemId);
        const total = updated.reduce((s, i) => s + i.quantity, 0);
        const sum = updated.reduce(
          (s, i) => s + i.quantity * (i.product.price || 0),
          0
        );
        set({ items: updated, totalItems: total, subtotal: sum });
        localStorage.setItem("cart", JSON.stringify(updated));
      }
    },

    updateItem: async (itemId, updates) => {
      if (isLoggedIn()) {
        const res = await api.put(`/api/cart/${itemId}`, updates, {
          headers: { Authorization: `Bearer ${authToken()}` },
        });
        const { data, totalItems, subtotal } = res.data;
        set({ items: data, totalItems, subtotal, error: null });
        localStorage.setItem("cart", JSON.stringify(data));
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
        localStorage.setItem("cart", JSON.stringify(updated));
      }
    },

    clearCart: () => {
      set({
        items: [],
        totalItems: 0,
        subtotal: 0,
        isLoaded: true,
        error: null,
      });
      localStorage.removeItem("cart");
    },
  };
});

export default useCartStore;
