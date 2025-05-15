"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Heart, HeartOff } from "lucide-react";
import useCartStore from "@/store/cartStore";
import useWishlistStore from "@/store/wishlistStore";

export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);
  const wishlistItems = useWishlistStore((s) => s.items);
  const addToWishlist = useWishlistStore((s) => s.addItem);
  const removeFromWishlist = useWishlistStore((s) => s.removeItem);

  const [adding, setAdding] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    setIsWishlisted(wishlistItems.some((i) => i.product._id === product._id));
  }, [wishlistItems, product._id]);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setAdding(true);
    await addItem({
      productId: product._id,
      product,
      quantity: 1,
      size: product.sizes?.[0] ?? null,
      color: product.colors?.[0] ?? null,
    });
    // If it was wishlisted, remove from wishlist
    if (isWishlisted) {
      const item = wishlistItems.find((i) => i.product._id === product._id);
      if (item) await removeFromWishlist(item._id);
    }
    setAdding(false);
  };

  const toggleWishlist = async (e) => {
    e.preventDefault();
    setWishLoading(true);
    if (isWishlisted) {
      const item = wishlistItems.find((i) => i.product._id === product._id);
      await removeFromWishlist(item._id);
    } else {
      await addToWishlist(product);
    }
    setWishLoading(false);
  };

  if (!product) return null;

  return (
    <div className="relative border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Wishlist Toggle */}
      <button
        onClick={toggleWishlist}
        disabled={wishLoading}
        className="absolute top-2 right-2 z-10 bg-white bg-opacity-75 p-1 rounded-full hover:bg-opacity-100 transition"
      >
        {isWishlisted ? (
          <HeartOff size={20} className="text-red-500" />
        ) : (
          <Heart size={20} className="text-gray-400 hover:text-red-500" />
        )}
      </button>

      {/* Product Link & Image */}
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative w-full pt-[100%] bg-gray-100">
          <img
            src={product.images?.[0] || "/placeholder.png"}
            alt={product.title}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>
      </Link>

      {/* Details & Add to Cart */}
      <div className="p-4 flex flex-col">
        <Link href={`/product/${product.slug}`} className="mb-2">
          <h2 className="text-lg font-semibold text-gray-800 truncate">
            {product.title}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {(product.discountPrice ?? product.price).toFixed(2)} QAR
          </p>
        </Link>

        <button
          onClick={handleAddToCart}
          disabled={adding}
          className="mt-auto bg-ogr text-white py-2 rounded text-center hover:bg-opacity-90 transition"
        >
          {adding ? "Adding…" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
