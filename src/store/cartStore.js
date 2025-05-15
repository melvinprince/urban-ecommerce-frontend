import { create } from "zustand";
import {
  getCart,
  addOrUpdateCartItem,
  removeCartItem,
  updateCartItem,
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
      console.log("[CartStore] Fetching cart...");
      if (isLoggedIn()) {
        try {
          const { data } = await getCart();
          console.log("[CartStore] Fetched server cart:", data);
          set({
            items: data.items,
            totalItems: data.totalItems,
            subtotal: data.subtotal,
            isLoaded: true,
            error: null,
          });
          localStorage.setItem("cart", JSON.stringify(data.items));
          console.log("[CartStore] Server cart saved to localStorage");
          return;
        } catch (err) {
          console.error(
            "[CartStore] Server fetch failed, falling back to guest cart"
          );
        }
      }
      const guest = JSON.parse(localStorage.getItem("cart") || "[]");
      console.log("[CartStore] Loaded guest cart from localStorage:", guest);
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
      console.log("[CartStore] Adding item to cart:", item);
      const { productId, quantity = 1, size, color } = item;
      if (isLoggedIn()) {
        const { data } = await addOrUpdateCartItem({
          productId,
          quantity,
          size,
          color,
        });
        console.log("[CartStore] Server responded after add:", data);
        set({
          items: data.items,
          totalItems: data.totalItems,
          subtotal: data.subtotal,
          error: null,
        });
        localStorage.setItem("cart", JSON.stringify(data.items));
        console.log("[CartStore] Cart updated in localStorage after add");
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
        console.log("[CartStore] Guest cart updated locally:", updated);
        set({ items: updated, totalItems: total, subtotal: sum });
        localStorage.setItem("cart", JSON.stringify(updated));
      }
    },

    removeItem: async (itemId) => {
      console.log("[CartStore] Removing item:", itemId);
      if (isLoggedIn()) {
        const { data } = await removeCartItem(itemId);
        console.log("[CartStore] Server responded after remove:", data);
        set({
          items: data.items,
          totalItems: data.totalItems,
          subtotal: data.subtotal,
          error: null,
        });
        localStorage.setItem("cart", JSON.stringify(data.items));
        console.log("[CartStore] Cart updated in localStorage after remove");
      } else {
        const store = get();
        const updated = store.items.filter((i) => i._id !== itemId);
        const total = updated.reduce((s, i) => s + i.quantity, 0);
        const sum = updated.reduce(
          (s, i) => s + i.quantity * (i.product.price || 0),
          0
        );
        console.log("[CartStore] Guest cart after remove:", updated);
        set({ items: updated, totalItems: total, subtotal: sum });
        localStorage.setItem("cart", JSON.stringify(updated));
      }
    },

    updateItem: async (itemId, updates) => {
      console.log("[CartStore] Updating item:", itemId, "with", updates);
      if (isLoggedIn()) {
        const { data } = await updateCartItem(itemId, updates);
        console.log("[CartStore] Server responded after update:", data);
        set({
          items: data.items,
          totalItems: data.totalItems,
          subtotal: data.subtotal,
          error: null,
        });
        localStorage.setItem("cart", JSON.stringify(data.items));
        console.log("[CartStore] Cart updated in localStorage after update");
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
        console.log("[CartStore] Guest cart after update:", updated);
        set({ items: updated, totalItems: total, subtotal: sum });
        localStorage.setItem("cart", JSON.stringify(updated));
      }
    },

    clearCart: () => {
      console.log("[CartStore] Clearing cart");
      set({
        items: [],
        totalItems: 0,
        subtotal: 0,
        isLoaded: true,
        error: null,
      });
      localStorage.removeItem("cart");
      console.log("[CartStore] Cart cleared from localStorage");
    },
  };
});

export default useCartStore;
