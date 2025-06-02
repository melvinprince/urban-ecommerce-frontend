// components/wishlist/WishlistItem.jsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import useWishlistStore from "@/store/wishlistStore";
import usePopupStore from "@/store/popupStore";
import apiService from "@/lib/apiService";
import SvgIcon from "../common/SvgIcon";

export default function WishlistItem({ item }) {
  const removeItem = useWishlistStore((s) => s.removeItem);
  const { showSuccess, showError } = usePopupStore.getState();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [prod, setProd] = useState(
    item.product && typeof item.product === "object" ? item.product : null
  );

  const productId = prod?._id
    ? prod._id
    : typeof item.product === "string"
    ? item.product
    : null;

  useEffect(() => {
    if (!prod && productId) {
      const fetchProduct = async () => {
        try {
          setFetching(true);
          const response = await apiService.products.getByIds([productId]);
          if (Array.isArray(response) && response.length > 0) {
            setProd(response[0]);
          }
        } catch (err) {
          console.error("Failed to fetch product in WishlistItem:", err);
        } finally {
          setFetching(false);
        }
      };
      fetchProduct();
    }
  }, [prod, productId]);

  const handleRemove = async () => {
    try {
      setLoading(true);
      await removeItem(item._id);
      showSuccess("Item removed from wishlist.");
    } catch (err) {
      console.error(err);
      showError("Failed to remove item.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="animate-pulse flex flex-col space-y-4">
        <div className="w-full h-48 bg-gray-200 rounded-2xl" />
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    );
  }

  if (!prod) {
    return null;
  }

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
      className="bg-ogr/70 rounded-2xl overflow-hidden shadow-md flex flex-col"
    >
      {/* Product Image */}
      <Link
        href={`/product/${prod.slug}`}
        className="relative w-full h-48 bg-gray-100"
      >
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
      </Link>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/product/${prod.slug}`}>
            <h3 className="text-2xl font-medium text-white">{prod.title}</h3>
          </Link>
          <p className="mt-1 text-xl text-white/80">
            {(prod.discountPrice ?? prod.price).toFixed(2)} QAR
          </p>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          disabled={loading}
          className={`mt-4 flex items-center text-3xl justify-center space-x-2 py-2 px-4 rounded-full transition ${
            loading
              ? "bg-white/30 text-red-500 cursor-not-allowed"
              : "bg-white bg-opacity-20 text-red-500 hover:bg-opacity-30"
          }`}
        >
          <SvgIcon src="/svg/delete.svg" />
          <span className="text-2xl">{loading ? "Removing..." : "Remove"}</span>
        </button>
      </div>
    </motion.div>
  );
}
