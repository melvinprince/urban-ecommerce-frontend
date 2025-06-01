"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import useCartStore from "@/store/cartStore";
import Loader from "@/components/common/Loader";
import useAuthStore from "@/store/authStore";

export default function CartPage() {
  const items = useCartStore((s) => s.items) || [];
  const isLoaded = useCartStore((s) => s.isLoaded);
  const error = useCartStore((s) => s.error);
  const fetchCart = useCartStore((s) => s.fetchCart);

  const authIsLoaded = useAuthStore((s) => s.isLoaded);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  useEffect(() => {
    if (authIsLoaded) {
      fetchCart();
    }
  }, [authIsLoaded, isLoggedIn, fetchCart]);

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      <h1 className="text-4xl font-extrabold text-gray-900 text-center py-8 tracking-tight">
        Your Cart
      </h1>

      {/* Loading state covering entire viewport */}
      {!isLoaded && (
        <div className="flex-grow flex items-center justify-center">
          <Loader size="lg" />
        </div>
      )}

      {isLoaded && error && (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-red-500 text-xl">Error: {error}</p>
        </div>
      )}

      {isLoaded && !error && items.length === 0 && (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-600 text-2xl">Your cart is empty.</p>
        </div>
      )}

      {isLoaded && !error && items.length > 0 && (
        <div className="flex-grow w-full px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: List of items (span 2 columns on large screens) */}
          <motion.div
            className="col-span-1 lg:col-span-2 space-y-8 grid grid-cols-2"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {items.map((item, idx) => (
              <CartItem key={item._id} item={item} delay={idx * 0.1} />
            ))}
          </motion.div>

          {/* Right: Summary */}
          <div className="col-span-1">
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
}
