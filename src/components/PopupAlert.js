"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PopupAlert({ type, message, onClose }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      if (onClose) onClose(); // Call onClose passed from parent
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const typeStyles = {
    success: "bg-green-500",
    error: "bg-red-500",
  };

  return (
    <AnimatePresence>
      {show && (
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
            onClick={() => {
              setShow(false);
              if (onClose) onClose(); // Call on manual close too
            }}
            className="ml-2 hover:opacity-80"
          >
            X
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
