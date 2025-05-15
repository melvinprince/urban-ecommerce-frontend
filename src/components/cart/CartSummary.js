"use client";

import { useRouter } from "next/navigation";
import useCartStore from "@/store/cartStore";

export default function CartSummary() {
  const { totalItems, subtotal } = useCartStore();
  const router = useRouter();

  return (
    <div className="border-t pt-4 mt-4">
      <div className="flex justify-between text-lg font-semibold">
        <span>Total Items:</span>
        <span>{totalItems}</span>
      </div>
      <div className="flex justify-between text-xl font-bold mt-2">
        <span>Subtotal:</span>
        <span>{subtotal.toFixed(2)} QAR</span>
      </div>
      <button
        onClick={() => router.push("/checkout")}
        className="w-full mt-6 bg-ogr text-white py-3 rounded hover:bg-opacity-90 transition"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}
