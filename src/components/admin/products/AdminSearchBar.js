"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

/**
 * Lightweight debounce (300 ms) so we don’t blur while typing fast.
 */
export default function AdminSearchBar({ onSearch }) {
  const [input, setInput] = useState("");

  useEffect(() => {
    const t = setTimeout(() => onSearch(input.trim()), 300);
    return () => clearTimeout(t);
  }, [input, onSearch]);

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute top-3 left-3 h-5 w-5 text-gray-500" />
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search products by title or SKU…"
        className="w-full pl-11 pr-10 py-2.5 rounded-full border border-gray-300
                   focus:outline-none focus:ring-2 focus:ring-indigo-500
                   bg-white/80 backdrop-blur-md"
      />
      {input && (
        <button
          onClick={() => setInput("")}
          className="absolute top-2.5 right-3 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
