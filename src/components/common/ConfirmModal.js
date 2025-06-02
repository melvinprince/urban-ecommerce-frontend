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
      <div className="bg-white p-6 rounded-xl shadow-xl h-[15rem] w-[60rem] text-center flex flex-col items-center justify-center">
        <p className="text-3xl font-medium">{message}</p>
        <div className="mt-6 text-2xl flex justify-center space-x-4">
          <button
            onClick={() => {
              onConfirm?.();
              closeConfirm();
            }}
            className="px-[2rem] py-[1rem] bg-sgr text-3xl text-white hover:cursor-pointer rounded hover:bg-ogr transition-all duration-300"
          >
            Confirm
          </button>
          <button
            onClick={() => {
              onCancel?.();
              closeConfirm();
            }}
            className="px-[2rem] py-[1rem] bg-gray-300 text-3xl hover:cursor-pointer text-gray-700 rounded hover:bg-gray-400 transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
