"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import SvgIcon from "@/components/common/SvgIcon";
import useCartStore from "@/store/cartStore";
import useWishlistStore from "@/store/wishlistStore";
import usePopupStore from "@/store/popupStore";
import apiService from "@/lib/apiService";

const AddToCartButton = dynamic(
  () => import("@/components/common/AddToCartButton"),
  {
    ssr: false,
  }
);

const SaleBadge = dynamic(() => import("./SaleBadge"), { ssr: false });

/* ---------- helper for sizes / colors ---------- */
const parseList = (arr = []) =>
  arr
    .flatMap((v) => (typeof v === "string" ? v.split(",") : v))
    .map((v) => v.trim())
    .filter(Boolean);

export default function ProductCard({ product }) {
  /* ---------- derived data ---------- */
  const sizes = parseList(product?.sizes);
  const colors = parseList(product?.colors);
  const primaryCategory = product?.categories?.[0]?.name ?? "";

  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100
      )
    : 0;

  /* ---------- store hooks ---------- */
  const addItem = useCartStore((s) => s.addItem);
  const wishlistItems = useWishlistStore((s) => s.items);
  const addToWishlist = useWishlistStore((s) => s.addItem);
  const removeWishlist = useWishlistStore((s) => s.removeItem);
  const { showSuccess, showError } = usePopupStore.getState();

  /* ---------- local state ---------- */
  const [adding, setAdding] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  /* ---------- sync wishlist flag ---------- */
  useEffect(() => {
    const inWishlist = wishlistItems.some((w) => w.product._id === product._id);
    setIsWishlisted(inWishlist);
  }, [wishlistItems, product._id]);

  /* ---------- cart handler ---------- */
  async function handleAddToCart(e) {
    e.preventDefault();
    if (adding) return;
    setAdding(true);

    try {
      // if product lacks sizes, colors, or stock, fetch full details:
      let full = product;
      if (
        !product.sizes?.length ||
        !product.colors?.length ||
        product.stock == null
      ) {
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

      // if it was already in wishlist, remove it:
      if (isWishlisted) {
        const entry = wishlistItems.find((w) => w.product._id === product._id);
        if (entry) {
          await removeWishlist(entry._id);
        }
      }

      setJustAdded(true);
      showSuccess("Added to cart successfully!");
    } catch (err) {
      console.error(err);
      showError(err.message || "Failed to add to cart.");
    } finally {
      setAdding(false);
      setTimeout(() => setJustAdded(false), 1400);
    }
  }

  /* ---------- wishlist toggle ---------- */
  async function toggleWishlist(e) {
    e.preventDefault();
    if (wishLoading) return;
    setWishLoading(true);

    try {
      if (isWishlisted) {
        const entry = wishlistItems.find((w) => w.product._id === product._id);
        if (entry) {
          await removeWishlist(entry._id);
        }
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
  }

  if (!product) return null;

  /* ---------- icon src for heart ---------- */
  const iconSrc = isWishlisted
    ? "/svg/wishlist-gold.svg"
    : "/svg/wishlist-black.svg";

  /* ---------- UI rendering ---------- */
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        relative w-full h-full bg-white rounded-[25px] overflow-hidden
        shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)] backdrop-blur
        transition-transform hover:scale-[1.02] border border-gray-200 pb-[1rem] 
      "
    >
      {/* ♥ Wishlist Button */}
      <button
        onClick={toggleWishlist}
        disabled={wishLoading}
        className="
          absolute top-0 right-0 bg-white/70 backdrop-blur p-3
          rounded-bl-[25px] z-20
        "
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isWishlisted ? "wish-on" : "wish-off"}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { type: "spring" } }}
            exit={{ scale: 0.6, opacity: 0 }}
            whileTap={{ scale: 0.8 }}
          >
            <SvgIcon src={iconSrc} width={22} height={22} />
          </motion.div>
        </AnimatePresence>
      </button>

      {/* ----- IMAGE PANEL ----- */}
      <Link href={`/product/${product.slug}`} className="block group">
        <motion.div
          whileHover={{ rotateX: 4, rotateY: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 180, damping: 15 }}
          className="relative w-full pt-[100%] overflow-hidden"
        >
          {/* base image */}
          <Image
            src={product.images?.[0]}
            fill
            alt={product.title}
            className="
              absolute inset-0 object-cover
              transition-opacity duration-500 group-hover:opacity-0
            "
            sizes="(max-width:768px)100vw,25vw"
          />
          {/* hover image */}
          {product.images?.[1] && (
            <Image
              src={product.images[1]}
              fill
              alt={`${product.title} alt`}
              className="
                absolute inset-0 object-cover opacity-0
                transition-opacity duration-500 group-hover:opacity-100
              "
              sizes="(max-width:768px)100vw,25vw"
            />
          )}
          {hasDiscount && <SaleBadge discountPercent={discountPercent} />}
        </motion.div>
      </Link>

      {/* ----- DETAILS ----- */}
      <div className="p-5 flex flex-col gap-2">
        {/* category chip */}
        {primaryCategory && (
          <span
            className="
            self-start text-lg font-semibold tracking-wider uppercase
            rounded-full px-3 py-1 border border-ogr text-ogr
          "
          >
            {primaryCategory}
          </span>
        )}

        {/* title */}
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-lg md:text-xl font-semibold line-clamp-2">
            {product.title}
          </h2>
        </Link>

        {/* price */}
        <p className="text-2xl font-bold text-gray-800">
          {(product.discountPrice ?? product.price).toFixed(2)} QAR
        </p>

        {/* sizes */}
        {sizes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {sizes.map((s) => (
              <span
                key={s}
                className="text-[10px] px-1.5 py-0.5 border rounded-full"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {/* colors */}
        {colors.length > 0 && (
          <div className="flex gap-1 items-center">
            {colors.map((c) => (
              <span
                key={c}
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: c.toLowerCase() }}
                title={c}
              />
            ))}
          </div>
        )}
      </div>

      {/* ----- ADD-TO-CART BUTTON (UI-only) ----- */}
      <AddToCartButton
        adding={adding}
        justAdded={justAdded}
        onClick={handleAddToCart}
      />
    </motion.div>
  );
}
