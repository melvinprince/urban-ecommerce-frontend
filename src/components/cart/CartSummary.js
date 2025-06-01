"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import useCartStore from "@/store/cartStore";
import { useRouter } from "next/navigation";
import Loader from "@/components/common/Loader";
import SvgIcon from "../common/SvgIcon";

export default function CartSummary() {
  const { totalItems, subtotal } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    // Simulate any pre-checkout logic if needed:
    setTimeout(() => {
      setLoading(false);
      router.push("/checkout");
    }, 500);
  };

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-6 sticky top-20"
    >
      <div>
        <h2 className="text-5xl font-bold text-gray-900 mb-4">Order Summary</h2>

        <div className="flex justify-between text-3xl text-gray-700 mb-2">
          <span className="">Total Items:</span>
          <span>{totalItems}</span>
        </div>

        <div className="flex justify-between text-3xl font-extrabold text-gray-900">
          <span>Subtotal:</span>
          <span>{subtotal.toFixed(2)} QAR</span>
        </div>

        <p className="text-lg text-gray-500 mt-1">
          Taxes and shipping calculated at checkout.
        </p>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-fit h-fit px-[2rem] py-3 bg-ogr text-2xl text-white font-semibold rounded-xl hover:bg-opacity-90 transition disabled:opacity-50 flex items-center justify-center hover:cursor-pointer self-end"
      >
        {loading ? "Checking Out..." : "Proceed to Checkout"}
        {!loading && <SvgIcon src="/svg/checkout.svg" className="ml-[1rem]" />}
      </button>
    </motion.div>
  );
}
