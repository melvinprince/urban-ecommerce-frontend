"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import useCartStore from "@/store/cartStore";
import usePopupStore from "@/store/popupStore";
import SvgIcon from "../common/SvgIcon";

export default function CartItem({ item, delay = 0 }) {
  const updateItem = useCartStore((s) => s.updateItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const { showSuccess, showError } = usePopupStore.getState();

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
      try {
        setBusy(true);
        await updateItem(item._id, { quantity: qty });
        showSuccess("Quantity updated.");
      } catch {
        showError("Failed to update quantity.");
      } finally {
        setBusy(false);
      }
    }
  };

  const handleSizeChange = async (e) => {
    const newSize = e.target.value;
    if (newSize !== size) {
      try {
        setBusy(true);
        setSize(newSize);
        await updateItem(item._id, { size: newSize });
        showSuccess("Size updated.");
      } catch {
        showError("Failed to update size.");
      } finally {
        setBusy(false);
      }
    }
  };

  const handleColorChange = async (e) => {
    const newColor = e.target.value;
    if (newColor !== color) {
      try {
        setBusy(true);
        setColor(newColor);
        await updateItem(item._id, { color: newColor });
        showSuccess("Color updated.");
      } catch {
        showError("Failed to update color.");
      } finally {
        setBusy(false);
      }
    }
  };

  const handleRemove = async () => {
    try {
      setBusy(true);
      await removeItem(item._id);
      showSuccess("Item removed.");
    } catch {
      showError("Failed to remove item.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl shadow-lg p-6 grid grid-cols-3 gap-6 max-h-[23rem] min-h-[20rem] overflow-hidden max-w-[95%]"
    >
      {/* Column 1: Product Image */}
      <div className="relative w-full h-full max-h-[20rem] rounded-lg overflow-hidden shadow-md">
        {prod.images?.[0] ? (
          <Image
            src={prod.images[0]}
            alt={prod.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Column 2: Product Details & Selectors */}
      <div className="flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 truncate">
            {prod.title || "Unknown Product"}
          </h2>
          <p className="mt-1 text-xl text-gray-700">
            {(prod.discountPrice ?? prod.price)?.toFixed(2) || "0.00"} QAR
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Size Selector */}
          {prod.sizes?.length > 0 && (
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Size</label>
              <select
                value={size}
                onChange={handleSizeChange}
                disabled={busy}
                className="mt-1 p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-ogr text-gray-800"
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
              <label className="text-sm font-medium text-gray-700">Color</label>
              <select
                value={color}
                onChange={handleColorChange}
                disabled={busy}
                className="mt-1 p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-ogr text-gray-800"
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
            <label className="text-sm font-medium text-gray-700">
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
              className="mt-1 p-2 border rounded-xl text-center focus:outline-none focus:ring-2 focus:ring-ogr"
            />
          </div>
        </div>
      </div>

      {/* Column 3: Remove Button & Stock Status */}
      <div className="flex flex-col justify-between items-end">
        <button
          onClick={handleRemove}
          disabled={busy}
          className="flex items-center gap-2 text-red-600 hover:text-red-800 transition disabled:opacity-50"
        >
          <SvgIcon src="/svg/delete.svg" className="w-6 h-6" />
          <span className="text-base font-medium">Remove</span>
        </button>

        {maxQty === 0 && (
          <p className="text-red-500 text-sm mt-4">Out of stock</p>
        )}
      </div>
    </motion.div>
  );
}
