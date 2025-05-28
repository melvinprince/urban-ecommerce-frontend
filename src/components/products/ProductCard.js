"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useCartStore from "@/store/cartStore";
import useWishlistStore from "@/store/wishlistStore";
import apiService from "@/lib/apiService";
import usePopupStore from "@/store/popupStore";
import Image from "next/image";
import dynamic from "next/dynamic";
import SvgIcon from "@/components/common/SvgIcon"; // adjust the path if needed

const SaleBadge = dynamic(() => import("./SaleBadge"), { ssr: false });

export default function ProductCard({ product }) {
  /* -------------------- helpers -------------------- */
  // Sizes & colors might arrive as single comma-separated strings inside an array
  const parseList = (arr = []) =>
    arr
      .flatMap((v) => (typeof v === "string" ? v.split(",") : v))
      .map((v) => v.trim())
      .filter(Boolean);

  const sizes = parseList(product?.sizes);
  const colors = parseList(product?.colors);
  const primaryCategory = product?.categories?.[0]?.name ?? "";

  /* -------------------- wishlist / cart ------------- */
  const addItem = useCartStore((s) => s.addItem);
  const wishlistItems = useWishlistStore((s) => s.items);
  const addToWishlist = useWishlistStore((s) => s.addItem);
  const removeWishlist = useWishlistStore((s) => s.removeItem);
  const { showSuccess, showError } = usePopupStore.getState();

  const [adding, setAdding] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100
      )
    : 0;

  useEffect(() => {
    setIsWishlisted(wishlistItems.some((i) => i.product._id === product._id));
  }, [wishlistItems, product._id]);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (adding) return;
    setAdding(true);

    try {
      // make sure we have full product data (sizes, colors, stock)
      let full = product;
      const needsFetch =
        !product.sizes?.length ||
        !product.colors?.length ||
        product.stock == null;

      if (needsFetch) {
        const { data } = await apiService.products.getBySlug(product.slug);
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

      showSuccess("Added to cart successfully!");
    } catch (err) {
      console.error(err);
      showError(err.message || "Failed to add to cart.");
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
        showSuccess("Removed from wishlist.");
      } else {
        await addToWishlist(product);
        showSuccess("Added to wishlist!");
      }
    } catch (err) {
      console.error(err);
      showError(err.message || "Failed to update wishlist.");
    } finally {
      setWishLoading(false);
    }
  };

  if (!product) return null;

  /* -------------------- UI ------------------------- */
  const iconSrc = isWishlisted
    ? "/svg/wishlist-gold.svg"
    : "/svg/wishlist-black.svg";

  return (
    <div className="relative w-full h-full border border-ogr rounded-[25px] overflow-hidden  group bg-white hover:scale-102 transition-transform duration-300 shadow-xl">
      {/* ♥ Wishlist */}
      <button
        onClick={toggleWishlist}
        disabled={wishLoading}
        className="absolute top-0 right-0 z-10 bg-white p-4 backdrop-blur-sm hover:bg-white transition rounded-bl-[25px]"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={isWishlisted ? "gold" : "black"}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.2 }}
          >
            <SvgIcon src={iconSrc} width={24} height={24} />
          </motion.div>
        </AnimatePresence>
      </button>

      {/* ---------------- images ---------------- */}
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative w-full pt-[100%] bg-gray-100 rounded-t-[25px] overflow-hidden">
          {/* first image */}
          <Image
            src={product.images?.[0]}
            fill
            alt={product.title}
            className="absolute inset-0 object-cover transition-opacity duration-300 group-hover:opacity-0"
          />

          {/* second image on hover (if exists) */}
          {product.images?.[1] && (
            <Image
              src={product.images[1]}
              fill
              alt={`${product.title} alt`}
              className="absolute inset-0 object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          )}
        </div>
        {hasDiscount && <SaleBadge discountPercent={discountPercent} />}
      </Link>

      {/* ---------------- details ---------------- */}
      <div className="p-4 flex flex-col gap-1">
        {/* category */}
        {primaryCategory && (
          <span className="self-start text-lg text-ogr tracking-wide uppercase border border-ogr rounded-full px-2 py-0.5 font-bold">
            {primaryCategory}
          </span>
        )}

        {/* title */}
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-2xl font-semibold text-gray-800 truncate mt-1">
            {product.title.toUpperCase()}
          </h2>
        </Link>

        {/* price */}
        <p className="text-4xl font-bold text-gray-600">
          {(product.discountPrice ?? product.price).toFixed(2)} QAR
        </p>

        {/* sizes */}
        {sizes.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {sizes.map((size) => (
              <span
                key={size}
                className="text-[12px] px-2 py-0.5 border border-gray-300 rounded-full"
              >
                {size}
              </span>
            ))}
          </div>
        )}

        {/* colors */}
        {colors.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1 items-center">
            {colors.map((color) => (
              <span
                key={color}
                className="w-5 h-5 rounded-full border border-gray-300"
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
          </div>
        )}

        {/* add to cart button */}
        <button
          onClick={handleAddToCart}
          disabled={adding}
          className="mt-4 bg-ogr text-white py-2 rounded-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
        >
          {adding ? "Adding…" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
