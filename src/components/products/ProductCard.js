"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Heart, HeartOff } from "lucide-react";
import useCartStore from "@/store/cartStore";
import useWishlistStore from "@/store/wishlistStore";
import { getProductBySlug } from "@/lib/api";
import usePopupStore from "@/store/popupStore"; // 🆕 GLOBAL popup store (NOT local state!)

export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);
  const wishlistItems = useWishlistStore((s) => s.items);
  const addToWishlist = useWishlistStore((s) => s.addItem);
  const removeWishlist = useWishlistStore((s) => s.removeItem);

  const { showSuccess, showError } = usePopupStore.getState(); // 🆕 popup functions

  const [adding, setAdding] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    setIsWishlisted(wishlistItems.some((i) => i.product._id === product._id));
  }, [wishlistItems, product._id]);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (adding) return;
    setAdding(true);

    try {
      let full = product;

      const needsFetch =
        !product.sizes?.length ||
        !product.colors?.length ||
        product.stock == null;

      if (needsFetch) {
        const { data } = await getProductBySlug(product.slug);
        full = data;
      }

      await addItem({
        productId: full._id,
        product: full,
        quantity: 1,
        size: full.sizes?.[0] ?? null,
        color: full.colors?.[0] ?? null,
      });

      if (isWishlisted) {
        const entry = wishlistItems.find((i) => i.product._id === product._id);
        if (entry) await removeWishlist(entry._id);
      }

      showSuccess("Added to cart successfully!"); // 🆕
    } catch (err) {
      console.error(err);
      showError(err.message || "Failed to add to cart."); // 🆕
    } finally {
      setAdding(false);
    }
  };

  const toggleWishlist = async (e) => {
    e.preventDefault();
    if (wishLoading) return;
    setWishLoading(true);

    try {
      if (isWishlisted) {
        const entry = wishlistItems.find((i) => i.product._id === product._id);
        if (entry) await removeWishlist(entry._id);
        showSuccess("Removed from wishlist."); // 🆕
      } else {
        await addToWishlist(product);
        showSuccess("Added to wishlist!"); // 🆕
      }
    } catch (err) {
      console.error(err);
      showError(err.message || "Failed to update wishlist."); // 🆕
    } finally {
      setWishLoading(false);
    }
  };

  if (!product) return null;

  return (
    <div className="relative border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* ♥ Wishlist button */}
      <button
        onClick={toggleWishlist}
        disabled={wishLoading}
        className="absolute top-2 right-2 z-10 bg-white/75 p-1 rounded-full hover:bg-white"
      >
        {isWishlisted ? (
          <HeartOff size={20} className="text-red-500" />
        ) : (
          <Heart size={20} className="text-gray-400 hover:text-red-500" />
        )}
      </button>

      {/* Product Image */}
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative w-full pt-[100%] bg-gray-100">
          <img
            src={product.images?.[0] || "/placeholder.png"}
            alt={product.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </Link>

      {/* Product Details */}
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
          className="mt-auto bg-ogr text-white py-2 rounded hover:bg-opacity-90 transition disabled:opacity-50"
        >
          {adding ? "Adding…" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
