"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, HeartOff } from "lucide-react";
import useCartStore from "@/store/cartStore";
import useWishlistStore from "@/store/wishlistStore";

export default function ProductInfo({ product }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const wishlistItems = useWishlistStore((s) => s.items);
  const addToWishlist = useWishlistStore((s) => s.addItem);
  const removeFromWishlist = useWishlistStore((s) => s.removeItem);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");
  const [adding, setAdding] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    setIsWishlisted(wishlistItems.some((i) => i.product._id === product._id));
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
    // remove from wishlist if present
    if (isWishlisted) {
      const item = wishlistItems.find((i) => i.product._id === product._id);
      if (item) await removeFromWishlist(item._id);
    }
    setAdding(false);
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push("/cart");
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
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
        <button
          onClick={toggleWishlist}
          disabled={wishLoading}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
        >
          {isWishlisted ? (
            <HeartOff size={24} className="text-red-500" />
          ) : (
            <Heart size={24} className="text-gray-500 hover:text-red-500" />
          )}
        </button>
      </div>

      {/* Price */}
      <p className="text-xl font-semibold text-green-700">
        {(product.discountPrice ?? product.price).toFixed(2)} QAR
      </p>

      {/* Size & Color */}
      {product.sizes?.length > 0 && (
        <div className="flex flex-col">
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
        </div>
      )}
      {product.colors?.length > 0 && (
        <div className="flex flex-col">
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
        </div>
      )}

      {/* Quantity & Actions */}
      <div className="flex flex-col">
        <label className="font-semibold mb-1">Quantity:</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
          className="w-20 border rounded p-2"
        />
      </div>

      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={handleAddToCart}
          disabled={adding}
          className="bg-ogr text-white px-6 py-2 rounded hover:bg-opacity-90 transition"
        >
          {adding ? "Adding…" : "Add to Cart"}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={adding}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-opacity-90 transition"
        >
          Buy Now
        </button>
      </div>

      {/* Descriptions */}
      {product.shortDescription && (
        <p className="text-gray-700 mt-6">{product.shortDescription}</p>
      )}
      {product.description && (
        <div className="text-gray-600">
          <p className="font-semibold">Description:</p>
          <p>{product.description}</p>
        </div>
      )}

      {/* Stock */}
      <div>
        <p className="font-semibold">Stock:</p>
        <p>
          {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
        </p>
      </div>
    </div>
  );
}
