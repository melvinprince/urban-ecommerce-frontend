"use client";

import { useEffect } from "react";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import useCartStore from "@/store/cartStore";
import Loader from "@/components/common/Loader";

export default function CartContent() {
  const items = useCartStore((state) => state.items);
  const isLoaded = useCartStore((state) => state.isLoaded);
  const error = useCartStore((state) => state.error);
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (!isLoaded) {
    return <Loader />; // 👈 Using centralized Loader
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  if (items.length === 0) {
    return (
      <p className="text-center py-10 text-gray-600">Your cart is empty.</p>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItem key={item._id} item={item} />
      ))}
      <CartSummary />
    </div>
  );
}
