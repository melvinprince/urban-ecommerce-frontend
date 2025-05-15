import { create } from "zustand";

const usePopupStore = create((set) => ({
  message: "",
  type: "",

  showSuccess: (msg) => set({ message: msg, type: "success" }),
  showError: (msg) => set({ message: msg, type: "error" }),
  showInfo: (msg) => set({ message: msg, type: "info" }),

  clear: () => set({ message: "", type: "" }),
}));

export default usePopupStore;
