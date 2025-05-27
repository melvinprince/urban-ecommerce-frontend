"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import useConfirmStore from "@/store/useConfirmStore";

export default function ConfirmModal() {
  const { isOpen, message, onConfirm, onCancel, closeConfirm } =
    useConfirmStore();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeConfirm();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeConfirm]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full text-center">
        <p className="text-lg font-medium">{message}</p>
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => {
              onConfirm?.();
              closeConfirm();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Confirm
          </button>
          <button
            onClick={() => {
              onCancel?.();
              closeConfirm();
            }}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
