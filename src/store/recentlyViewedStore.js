import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_ITEMS = 10;

const useRecentlyViewedStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId) => {
        const current = get().items;
        const filtered = current.filter((id) => id !== productId);
        const updated = [productId, ...filtered].slice(0, MAX_ITEMS);
        set({ items: updated });
      },

      clearItems: () => set({ items: [] }),
    }),
    {
      name: "recently-viewed", // localStorage key
    }
  )
);

export default useRecentlyViewedStore;
