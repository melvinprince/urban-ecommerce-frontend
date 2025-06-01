// frontend/src/components/checkout/AddressCarousel.jsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import useAuthStore from "@/store/authStore";
import useCheckoutStore from "@/store/checkoutStore";

export default function AddressCarousel() {
  const auth = useAuthStore();
  const savedAddresses = auth.user?.addresses || [];
  const setAddress = useCheckoutStore((s) => s.setAddress);

  const [startIdx, setStartIdx] = useState(0);
  const visible = savedAddresses.slice(startIdx, startIdx + 3);

  const canPrev = startIdx > 0;
  const canNext = startIdx + 3 < savedAddresses.length;

  const selectAddress = (addr) => {
    setAddress({
      fullName: addr.fullName,
      email: addr.email,
      phone: addr.phone,
      street: addr.street,
      city: addr.city,
      postalCode: addr.postalCode,
      country: addr.country,
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-3xl shadow-lg p-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Choose Shipping Address
      </h2>

      {savedAddresses.length === 0 ? (
        <p className="text-gray-500">
          You have no saved addresses. Please add one in your profile.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 mb-4">
            {visible.map((addr) => (
              <motion.div
                key={addr._id}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                onClick={() => selectAddress(addr)}
                className="border rounded-xl p-3 cursor-pointer hover:border-ogr"
              >
                <div className="font-medium text-gray-800">{addr.fullName}</div>
                <div className="text-sm text-gray-600">
                  {addr.street}, {addr.city}, {addr.postalCode}, {addr.country}
                </div>
                <div className="text-sm text-gray-600">
                  {addr.phone} • {addr.email}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStartIdx((i) => Math.max(0, i - 3))}
              disabled={!canPrev}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                canPrev
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Previous
            </button>

            <button
              onClick={() =>
                setStartIdx((i) => Math.min(i + 3, savedAddresses.length - 3))
              }
              disabled={!canNext}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                canNext
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </motion.section>
  );
}
