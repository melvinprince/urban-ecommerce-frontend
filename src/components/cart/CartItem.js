// src/components/cart/CartItem.jsx

"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import useCartStore from "@/store/cartStore";
import { Trash2 } from "lucide-react";

export default function CartItem({ item }) {
  const updateItem = useCartStore((s) => s.updateItem);
  const removeItem = useCartStore((s) => s.removeItem);

  const prod = item.product || {};
  const maxQty = prod.stock ?? 0;

  const [qty, setQty] = useState(item.quantity);
  const [size, setSize] = useState(item.size || prod.sizes?.[0] || "");
  const [color, setColor] = useState(item.color || prod.colors?.[0] || "");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setQty(Math.min(item.quantity, maxQty));
    setSize(item.size || prod.sizes?.[0] || "");
    setColor(item.color || prod.colors?.[0] || "");
  }, [item, prod.sizes, prod.colors, maxQty]);

  const handleQtyInput = (e) => {
    let val = parseInt(e.target.value, 10) || 1;
    if (val < 1) val = 1;
    if (maxQty > 0 && val > maxQty) val = maxQty;
    setQty(val);
  };

  const handleQtyBlur = async () => {
    if (qty !== item.quantity) {
      setBusy(true);
      await updateItem(item._id, { quantity: qty });
      setBusy(false);
    }
  };

  const handleSizeChange = async (e) => {
    const newSize = e.target.value;
    if (newSize !== size) {
      setBusy(true);
      setSize(newSize);
      await updateItem(item._id, { size: newSize });
      setBusy(false);
    }
  };

  const handleColorChange = async (e) => {
    const newColor = e.target.value;
    if (newColor !== color) {
      setBusy(true);
      setColor(newColor);
      await updateItem(item._id, { color: newColor });
      setBusy(false);
    }
  };

  const handleRemove = async () => {
    setBusy(true);
    await removeItem(item._id);
  };

  return (
    <div className="flex flex-wrap items-center gap-4 border-b py-4">
      {/* Image or Fallback */}
      <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden">
        {prod.images?.[0] ? (
          <Image
            src={prod.images[0]}
            alt={prod.title}
            width={80}
            height={80}
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
            No Image
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-[150px]">
        <h3 className="font-semibold text-gray-800 truncate">{prod.title}</h3>
        <p className="text-sm text-gray-600 mb-1">
          {(prod.discountPrice ?? prod.price)?.toFixed(2) || "0.00"} QAR each
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
          <span className="ml-4">
            Qty: <strong>{qty}</strong>
          </span>
        </div>
        {maxQty === 0 && (
          <p className="text-red-500 text-sm mt-1">Out of stock</p>
        )}
      </div>

      {/* Size Selector */}
      {prod.sizes?.length > 0 && (
        <div className="flex flex-col">
          <label className="text-sm font-medium">Size:</label>
          <select
            value={size}
            onChange={handleSizeChange}
            disabled={busy}
            className="border rounded p-1 text-sm"
          >
            {!prod.sizes.includes(size) && size && (
              <option value={size} disabled>
                {size} (Unavailable)
              </option>
            )}
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
            className="border rounded p-1 text-sm"
          >
            {!prod.colors.includes(color) && color && (
              <option value={color} disabled>
                {color} (Unavailable)
              </option>
            )}
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
        <label className="text-sm font-medium">
          Qty {maxQty > 0 ? `(max ${maxQty})` : ""}
        </label>
        <input
          type="number"
          min="1"
          max={maxQty > 0 ? maxQty : undefined}
          value={qty}
          onChange={handleQtyInput}
          onBlur={handleQtyBlur}
          disabled={busy || maxQty === 0}
          className="w-20 border rounded p-1 text-center text-sm"
        />
      </div>

      {/* Remove */}
      <button
        onClick={handleRemove}
        disabled={busy}
        className="text-red-500 hover:text-red-700 transition p-2"
        aria-label="Remove item"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
}
