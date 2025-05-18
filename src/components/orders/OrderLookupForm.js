"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    } else if (email.trim()) {
      router.push(
        `/user/profile/orders/email-orders?email=${encodeURIComponent(
          email.trim()
        )}`
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Order ID</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded"
          placeholder="Enter your 5-digit Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Email (optional)
        </label>
        <input
          type="email"
          className="w-full border px-3 py-2 rounded"
          placeholder="Your email used during checkout"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
      >
        Track My Order
      </button>
    </form>
  );
}
