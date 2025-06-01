// frontend/src/components/checkout/RightPanel.jsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import CouponInput from "./CouponInput";
import PaymentMethod from "./PaymentMethod";
import PayPalButton from "./PaypalButton";
import useCheckoutStore from "@/store/checkoutStore";

export default function RightPanel({
  onPlaceOrder,
  finalAmount,
  error,
  setError,
}) {
  const { paymentMethod, setPaymentMethod, coupon, address } =
    useCheckoutStore();

  const couponData = coupon?.[0] || null;
  const discountAmount = coupon?.[1] || 0;

  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Coupon Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="bg-white rounded-3xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Have a Coupon?
        </h2>
        <CouponInput />

        {couponData && (
          <p className="mt-2 text-sm text-green-600">
            You saved QAR {discountAmount.toFixed(2)} using{" "}
            <strong>{couponData.code}</strong>
          </p>
        )}
      </motion.section>

      {/* Payment Method Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="bg-white rounded-3xl shadow-lg p-6"
      >
        <PaymentMethod
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />
      </motion.section>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500 text-sm"
        >
          {error}
        </motion.p>
      )}

      {/* Final Proceed / PayPal Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="mt-auto"
      >
        {paymentMethod === "paypal" ? (
          <PayPalButton
            amount={finalAmount}
            onSuccess={onPlaceOrder}
            onError={() => setError("PayPal checkout failed.")}
          />
        ) : (
          <button
            onClick={onPlaceOrder}
            className="w-full bg-ogr hover:bg-ogr-dark text-white font-semibold py-4 rounded-full transition-transform transform hover:scale-105 disabled:opacity-50"
          >
            Proceed to Checkout (QAR {finalAmount})
          </button>
        )}
      </motion.div>
    </div>
  );
}
