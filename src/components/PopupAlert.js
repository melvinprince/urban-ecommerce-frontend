"use client";
import { motion, AnimatePresence } from "framer-motion";
import SvgIcon from "./common/SvgIcon";

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
        <span className="text-xl">{message}</span>
        <button
          onClick={onClose}
          className=" hover:opacity-80 leading-none transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white hover:cursor-pointer"
        >
          <SvgIcon src={"/svg/close.svg"} width={24} height={24} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
