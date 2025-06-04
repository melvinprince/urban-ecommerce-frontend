// components/admin/products/SizeColorInput.jsx
"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";

export default function SizeColorInput({
  label = "Item",
  items = [],
  setItems,
}) {
  const [inputValue, setInputValue] = useState("");

  const normalizeItems = () => {
    if (Array.isArray(items)) return items;
    if (typeof items === "string") return items.split(",").map((i) => i.trim());
    return [];
  };

  const handleAdd = () => {
    const normalized = normalizeItems();
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    let formatted = trimmed;
    if (label.toLowerCase().includes("size")) {
      formatted = trimmed.toUpperCase();
    } else if (label.toLowerCase().includes("color")) {
      formatted =
        trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    }

    if (normalized.includes(formatted)) return;
    setItems([...normalized, formatted]);
    setInputValue("");
  };

  const handleRemove = (item) => {
    const normalized = normalizeItems();
    setItems(normalized.filter((i) => i !== item));
  };

  const safeItems = normalizeItems();

  return (
    <div className="space-y-2">
      <label className="block text-2xl font-semibold text-gray-800">
        {label}
      </label>

      <div className="flex items-center space-x-2">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Add ${label.toLowerCase()}`}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-4 py-2 transition"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      {safeItems.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {safeItems.map((item, idx) => (
            <div
              key={`${item}-${idx}`}
              className="flex items-center bg-gray-200 rounded-full px-3 py-1 space-x-1 text-lg"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => handleRemove(item)}
                className="flex items-center justify-center h-5 w-5 text-red-600 hover:text-red-800"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
