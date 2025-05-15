"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import useWishlistStore from "@/store/wishlistStore";
import usePopupStore from "@/store/popupStore"; // 🆕 Global popup

export default function WishlistItem({ item }) {
  const removeItem = useWishlistStore((s) => s.removeItem);
  const { showSuccess, showError } = usePopupStore.getState(); // 🆕 popup methods
  const [loading, setLoading] = useState(false);

  const handleRemove = async () => {
    try {
      setLoading(true);
      await removeItem(item._id);
      showSuccess("Item removed from wishlist."); // 🆕
    } catch (err) {
      console.error(err);
      showError("Failed to remove item."); // 🆕
    } finally {
      setLoading(false);
    }
  };

  const prod = item.product;

  return (
    <div className="flex items-center border-b py-4 space-x-4">
      <Link
        href={`/product/${prod.slug}`}
        className="w-20 h-20 block bg-gray-100 rounded overflow-hidden"
      >
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
      </Link>
      <div className="flex-1">
        <Link href={`/product/${prod.slug}`}>
          <h3 className="font-semibold text-gray-800">{prod.title}</h3>
        </Link>
        <p className="text-sm text-gray-600">
          {(prod.discountPrice ?? prod.price).toFixed(2)} QAR
        </p>
      </div>
      <button
        onClick={handleRemove}
        disabled={loading}
        className="text-red-500 hover:text-red-700 transition p-2"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
}
