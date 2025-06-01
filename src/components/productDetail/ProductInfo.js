"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Heart, HeartOff } from "lucide-react";
import useCartStore from "@/store/cartStore";
import useWishlistStore from "@/store/wishlistStore";
import useCheckoutStore from "@/store/checkoutStore";
import ReviewsSection from "./ReviewSection";

export default function ProductInfo({ product }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const wishlistItems = useWishlistStore((s) => s.items);
  const addToWishlist = useWishlistStore((s) => s.addItem);
  const removeFromWishlist = useWishlistStore((s) => s.removeItem);
  const setBuyNowProduct = useCheckoutStore((s) => s.setBuyNowProduct);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [adding, setAdding] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (product.sizes?.length > 0) setSelectedSize(product.sizes[0]);
    if (product.colors?.length > 0) setSelectedColor(product.colors[0]);
  }, [product.sizes, product.colors]);

  useEffect(() => {
    setIsWishlisted(wishlistItems.some((i) => i.product?._id === product._id));
  }, [wishlistItems, product._id]);

  const handleAddToCart = async () => {
    setAdding(true);
    await addItem({
      productId: product._id,
      product,
      quantity,
      size: selectedSize,
      color: selectedColor,
    });
    if (isWishlisted) {
      const item = wishlistItems.find((i) => i.product._id === product._id);
      if (item) await removeFromWishlist(item._id);
    }
    setAdding(false);
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    setBuyNowProduct({
      ...product,
      quantity,
      size: selectedSize,
      color: selectedColor,
    });
    router.push("/checkout");
  };

  const toggleWishlist = async () => {
    setWishLoading(true);
    if (isWishlisted) {
      const item = wishlistItems.find((i) => i.product._id === product._id);
      if (item) await removeFromWishlist(item._id);
    } else {
      await addToWishlist(product);
    }
    setWishLoading(false);
  };

  if (!product) return null;

  return (
    <motion.div
      className="flex flex-col gap-6"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.9, 0.3, 1] }}
    >
      {/* Title & Wishlist */}
      <div className="flex items-center justify-between">
        <motion.h1
          className="text-4xl font-bold text-gray-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          {product.title}
        </motion.h1>
        <motion.button
          onClick={toggleWishlist}
          disabled={wishLoading}
          whileTap={{ scale: 0.9 }}
          whileHover={{ rotate: [0, -10, 10, -10, 10, 0] }}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
        >
          {isWishlisted ? (
            <HeartOff size={24} className="text-red-500" />
          ) : (
            <Heart size={24} className="text-gray-500 hover:text-red-500" />
          )}
        </motion.button>
      </div>

      {/* Price */}
      <motion.p
        className="text-3xl font-bold text-green-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {(product.discountPrice ?? product.price).toFixed(2)} QAR
      </motion.p>

      {/* Selectors */}
      <motion.div className="flex flex-col gap-4">
        {product.sizes?.length > 0 && (
          <motion.div>
            <label className="font-semibold mb-1">Size:</label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="border rounded p-2"
            >
              {product.sizes.map((sz) => (
                <option key={sz} value={sz}>
                  {sz}
                </option>
              ))}
            </select>
          </motion.div>
        )}
        {product.colors?.length > 0 && (
          <motion.div>
            <label className="font-semibold mb-1">Color:</label>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="border rounded p-2"
            >
              {product.colors.map((cl) => (
                <option key={cl} value={cl}>
                  {cl}
                </option>
              ))}
            </select>
          </motion.div>
        )}
        <motion.div>
          <label className="font-semibold mb-1">Quantity:</label>
          <input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(e) =>
              setQuantity(
                Math.min(product.stock, parseInt(e.target.value, 10) || 1)
              )
            }
            className="w-20 border rounded p-2"
          />
          <span className="text-sm text-gray-500">
            {product.stock} in stock
          </span>
        </motion.div>
      </motion.div>

      {/* Buttons */}
      <motion.div className="flex items-center gap-4 mt-4">
        <motion.button
          onClick={handleAddToCart}
          disabled={adding || product.stock === 0}
          whileTap={{ scale: 0.95 }}
          className="bg-ogr text-white px-6 py-2 rounded hover:bg-opacity-90 transition disabled:opacity-50"
        >
          {adding ? "Adding…" : "Add to Cart"}
        </motion.button>
        <motion.button
          onClick={handleBuyNow}
          disabled={adding || product.stock === 0}
          whileTap={{ scale: 0.95 }}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-opacity-90 transition disabled:opacity-50"
        >
          Buy Now
        </motion.button>
      </motion.div>

      {/* Descriptions */}
      {product.shortDescription && (
        <motion.p className="text-gray-700 mt-6">
          {product.shortDescription}
        </motion.p>
      )}
      {product.description && (
        <motion.div className="text-gray-600">
          <p className="font-semibold">Description:</p>
          <p>{product.description}</p>
        </motion.div>
      )}

      <motion.div>
        <p className="font-semibold">Stock:</p>
        <p>
          {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
        </p>
      </motion.div>

      <ReviewsSection productId={product._id} />
    </motion.div>
  );
}
