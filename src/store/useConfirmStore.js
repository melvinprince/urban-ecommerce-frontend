import { create } from "zustand";

const useConfirmStore = create((set) => ({
  isOpen: false,
  message: "",
  onConfirm: null,
  onCancel: null,

  openConfirm: ({ message, onConfirm, onCancel }) =>
    set({ isOpen: true, message, onConfirm, onCancel }),

  closeConfirm: () =>
    set({ isOpen: false, message: "", onConfirm: null, onCancel: null }),
}));

export default useConfirmStore;
