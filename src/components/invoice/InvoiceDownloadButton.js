// components/invoice/InvoiceDownloadButton.jsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { generateInvoicePdf } from "./generateInvoicePdf";

export default function InvoiceDownloadButton({ order }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      await generateInvoicePdf(order);
    } catch (e) {
      alert("Failed to generate invoice. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      onClick={handleDownload}
      disabled={loading}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 0 16px rgba(0, 0, 0, 0)",
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`
        relative 
        inline-flex 
        items-center 
        justify-center 
        bg-ogr
        text-white 
        font-semibold 
        py-3 px-6 
        rounded-2xl 
        shadow-lg 
        overflow-hidden
        disabled:opacity-50 
        disabled:cursor-not-allowed
      `}
    >
      {/* Animated Gradient Overlay */}
      <span className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-20"></span>

      {/* Button Text */}
      <span className="relative flex items-center space-x-2">
        {loading ? (
          <>
            {/* Simple Spinner */}
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <span className="text-lg">Generating…</span>
          </>
        ) : (
          <>
            <span className="text-xl">📄</span>
            <span className="text-lg">Download Invoice</span>
          </>
        )}
      </span>
    </motion.button>
  );
}
