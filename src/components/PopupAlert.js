"use client";
import { motion, AnimatePresence } from "framer-motion";

export default function PopupAlert({ type, message, onClose }) {
  if (!message) return null;

  const typeStyles = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: "0%", opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-lg shadow-lg text-white flex items-center gap-4 z-50 ${
          typeStyles[type] || "bg-gray-500"
        }`}
      >
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:opacity-80 text-lg leading-none"
        >
          ×
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
