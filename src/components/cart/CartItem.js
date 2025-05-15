"use client";

import Image from "next/image";
import { useState } from "react";
import useCartStore from "@/store/cartStore";
import { Trash2 } from "lucide-react";

export default function CartItem({ item }) {
  const updateItem = useCartStore((s) => s.updateItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const [qty, setQty] = useState(item.quantity);
  const [busy, setBusy] = useState(false);

  const handleQtyChange = async (e) => {
    const newQty = parseInt(e.target.value, 10);
    if (newQty < 1) return;
    setBusy(true);
    setQty(newQty);
    await updateItem(item._id, { quantity: newQty });
    setBusy(false);
  };

  const handleRemove = async () => {
    setBusy(true);
    await removeItem(item._id);
    setBusy(false);
  };

  const prod = item.product;

  return (
    <div className="flex items-center space-x-4 border-b py-4">
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
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{prod.title}</h3>
        <p className="text-sm text-gray-600">
          {(prod.discountPrice ?? prod.price).toFixed(2)} QAR each
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="number"
          min="1"
          value={qty}
          onChange={handleQtyChange}
          disabled={busy}
          className="w-16 border rounded p-1 text-center"
        />
      </div>

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
