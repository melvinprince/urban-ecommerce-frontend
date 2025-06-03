// components/orders/OrderLookupForm.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function OrderLookupForm() {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!orderId.trim() && !email.trim()) {
      setError("Please enter Order ID or Email");
      return;
    }
    setError("");
    if (orderId.trim()) {
      router.push(`/user/profile/orders/${orderId.trim()}`);
    } else {
      router.push(
        `/user/profile/orders/email-orders?email=${encodeURIComponent(
          email.trim()
        )}`
      );
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="grid gap-6"
    >
      {/* order id */}
      <div>
        <label className="block mb-2 font-medium text-gray-700">Order ID</label>
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="e.g. ORD-12345"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* email */}
      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Email&nbsp;<span className="text-gray-400">(optional)</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email used at checkout"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* error */}
      {error && <p className="text-red-600 text-sm -mt-3">{error}</p>}

      {/* submit */}
      <motion.button
        type="submit"
        whileTap={{ scale: 0.97 }}
        className="w-full rounded-full bg-black text-white py-3 text-lg hover:bg-gray-800 transition"
      >
        Track My Order
      </motion.button>
    </motion.form>
  );
}
