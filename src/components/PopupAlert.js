"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import usePopupStore from "@/store/popupStore";

export default function PopupAlert() {
  const { message, type, clear } = usePopupStore();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        clear();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, clear]);

  if (!message) return null;

  const typeStyles = {
    success: "bg-green-500",
    error: "bg-red-500",
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
      </motion.div>
    </AnimatePresence>
  );
}
