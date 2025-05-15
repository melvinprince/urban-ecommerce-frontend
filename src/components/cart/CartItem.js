// src/components/cart/CartItem.jsx

"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import useCartStore from "@/store/cartStore";
import { Trash2 } from "lucide-react";

export default function CartItem({ item }) {
  const updateItem = useCartStore((s) => s.updateItem);
  const removeItem = useCartStore((s) => s.removeItem);

  const prod = item.product;
  const maxQty = prod.stock;

  const [qty, setQty] = useState(item.quantity);
  const [size, setSize] = useState(item.size || "");
  const [color, setColor] = useState(item.color || "");
  const [busy, setBusy] = useState(false);

  // Sync local state when item prop changes
  useEffect(() => {
    setQty(item.quantity);
    setSize(item.size || "");
    setColor(item.color || "");
  }, [item]);

  // Clamp quantity input immediately
  const handleQtyInput = (e) => {
    let val = parseInt(e.target.value, 10) || 1;
    if (val < 1) val = 1;
    if (val > maxQty) val = maxQty;
    setQty(val);
  };

  // Persist quantity change on blur
  const handleQtyBlur = async () => {
    if (qty === item.quantity) return;
    setBusy(true);
    await updateItem(item._id, { quantity: qty });
    setBusy(false);
  };

  const handleSizeChange = async (e) => {
    const newSize = e.target.value;
    if (newSize === size) return;
    setBusy(true);
    setSize(newSize);
    await updateItem(item._id, { size: newSize });
    setBusy(false);
  };

  const handleColorChange = async (e) => {
    const newColor = e.target.value;
    if (newColor === color) return;
    setBusy(true);
    setColor(newColor);
    await updateItem(item._id, { color: newColor });
    setBusy(false);
  };

  const handleRemove = async () => {
    setBusy(true);
    await removeItem(item._id);
    setBusy(false);
  };

  return (
    <div className="flex flex-wrap items-center space-x-4 border-b py-4">
      {/* Image */}
      <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden relative">
        {prod.images?.[0] ? (
          <Image
            src={prod.images[0]}
            alt={prod.title}
            width={80}
            height={80}
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Title, Price, Selected Attributes */}
      <div className="flex-1 min-w-[150px]">
        <h3 className="font-semibold text-gray-800">{prod.title}</h3>
        <p className="text-sm text-gray-600 mb-1">
          {(prod.discountPrice ?? prod.price).toFixed(2)} QAR each
        </p>
        <div className="text-sm text-gray-700">
          {size && (
            <span className="mr-4">
              Size: <strong>{size}</strong>
            </span>
          )}
          {color && (
            <span>
              Color: <strong>{color}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Size Selector */}
      {prod.sizes?.length > 0 && (
        <div className="flex flex-col">
          <label className="text-sm font-medium">Size:</label>
          <select
            value={size}
            onChange={handleSizeChange}
            disabled={busy}
            className="border rounded p-1"
          >
            {prod.sizes.map((sz) => (
              <option key={sz} value={sz}>
                {sz}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Color Selector */}
      {prod.colors?.length > 0 && (
        <div className="flex flex-col">
          <label className="text-sm font-medium">Color:</label>
          <select
            value={color}
            onChange={handleColorChange}
            disabled={busy}
            className="border rounded p-1"
          >
            {prod.colors.map((cl) => (
              <option key={cl} value={cl}>
                {cl}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Quantity */}
      <div className="flex flex-col">
        <label className="text-sm font-medium">Qty (max {maxQty}):</label>
        <input
          type="number"
          min="1"
          max={maxQty}
          value={qty}
          onChange={handleQtyInput}
          onBlur={handleQtyBlur}
          disabled={busy}
          className="w-16 border rounded p-1 text-center"
        />
      </div>

      {/* Remove */}
      <button
        onClick={handleRemove}
        disabled={busy}
        className="text-red-500 hover:text-red-700 transition p-2"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
}
