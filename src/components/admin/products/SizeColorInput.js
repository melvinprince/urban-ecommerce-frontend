"use client";

import { useState } from "react";

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
      formatted = trimmed.toUpperCase(); // Sizes: Fully uppercase
    } else if (label.toLowerCase().includes("color")) {
      formatted =
        trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase(); // Colors: Capitalize first letter
    }

    if (normalized.includes(formatted)) return; // Avoid duplicates

    setItems([...normalized, formatted]);
    setInputValue("");
  };

  const handleRemove = (item) => {
    const normalized = normalizeItems();
    setItems(normalized.filter((i) => i !== item));
  };

  const safeItems = normalizeItems();

  return (
    <div>
      <label className="block font-semibold">{label}</label>
      <div className="flex space-x-2">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Add ${label?.toLowerCase?.() || "item"}`}
          className="border p-2 w-full"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="bg-blue-600 text-white px-3 rounded"
        >
          Add
        </button>
      </div>
      {safeItems.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {safeItems.map((item, idx) => (
            <div
              key={`${item}-${idx}`}
              className="bg-gray-200 px-2 py-1 rounded flex items-center space-x-1"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => handleRemove(item)}
                className="text-red-600 text-sm"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
