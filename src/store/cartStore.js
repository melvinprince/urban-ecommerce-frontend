import { create } from "zustand";
import {
  getCart,
  addOrUpdateCartItem,
  removeCartItem,
  updateCartItem,
  clearCartServerSide,
} from "@/lib/api";
import useAuthStore from "./authStore";

const useCartStore = create((set, get) => {
  const isLoggedIn = () => useAuthStore.getState().isLoggedIn;

  return {
    items: [],
    totalItems: 0,
    subtotal: 0,
    isLoaded: false,
    error: null,

    fetchCart: async () => {
      if (isLoggedIn()) {
        try {
          const { data } = await getCart();
          set({
            items: data.items,
            totalItems: data.totalItems,
            subtotal: data.subtotal,
            isLoaded: true,
            error: null,
          });
          localStorage.setItem("cart", JSON.stringify(data.items));
          return;
        } catch (err) {
          console.error(
            "[CartStore] Server fetch failed, falling back to guest cart"
          );
        }
      }
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
        const { data } = await addOrUpdateCartItem({
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
        localStorage.setItem("cart", JSON.stringify(data.items));
      } else {
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
        const { data } = await removeCartItem(itemId);
        set({
          items: data.items,
          totalItems: data.totalItems,
          subtotal: data.subtotal,
          error: null,
        });
        localStorage.setItem("cart", JSON.stringify(data.items));
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
        const { data } = await updateCartItem(itemId, updates);
        set({
          items: data.items,
          totalItems: data.totalItems,
          subtotal: data.subtotal,
          error: null,
        });
        localStorage.setItem("cart", JSON.stringify(data.items));
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

    clearCart: async () => {
      if (isLoggedIn()) {
        try {
          const { data } = await clearCartServerSide(); // get updated empty cart
          set({
            items: data.items,
            totalItems: data.totalItems,
            subtotal: data.subtotal,
            isLoaded: true,
            error: null,
          });
        } catch (err) {
          console.error("[CartStore] Server cart clear failed:", err.message);
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

      localStorage.removeItem("cart");
    },
  };
});

export default useCartStore;
