import { create } from "zustand";

const usePopupStore = create((set) => ({
  message: "",
  type: "",

  showSuccess: (message) => set({ message, type: "success" }),
  showError: (message) => set({ message, type: "error" }),
  clear: () => set({ message: "", type: "" }),
}));

export default usePopupStore;
