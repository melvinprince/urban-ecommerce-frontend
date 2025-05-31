import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_ITEMS = 10;

const useRecentlyViewedStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const current = get().items;

        // Remove any existing entry with the same _id
        const filtered = current.filter((p) => p._id !== product._id);

        // Add the new product to the front
        const updated = [product, ...filtered].slice(0, MAX_ITEMS);

        set({ items: updated });
      },

      clearItems: () => set({ items: [] }),
    }),
    {
      name: "recently-viewed", // LocalStorage key
    }
  )
);

export default useRecentlyViewedStore;
