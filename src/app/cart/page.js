"use client";

import { useEffect } from "react";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import useCartStore from "@/store/cartStore";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const isLoaded = useCartStore((state) => state.isLoaded);
  const error = useCartStore((state) => state.error);
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (!isLoaded) {
    return <div className="p-6 text-center">Loading cart…</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {items.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}
          <CartSummary />
        </div>
      )}
    </div>
  );
}
