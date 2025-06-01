// components/checkout/PaymentMethod.jsx
"use client";

import { motion } from "framer-motion";
import SvgIcon from "@/components/common/SvgIcon"; // optional: use any icon helper

const METHODS = [
  {
    id: "paypal",
    label: "Pay with PayPal",
    icon: "/svg/paypal.svg", // provide your own 24×24 svg
  },
  {
    id: "cod",
    label: "Cash on Delivery",
    icon: "/svg/cash.svg", // optional icon
  },
];

export default function PaymentMethod({ paymentMethod, setPaymentMethod }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-gray-200 p-8 bg-white/40 backdrop-blur-xl
                 shadow-[0_6px_18px_rgba(0,0,0,0.12)] space-y-4"
    >
      <h2 className="text-xl font-semibold">Payment Method</h2>

      <div className="flex flex-col gap-4">
        {METHODS.map(({ id, label, icon }) => {
          const selected = paymentMethod === id;

          return (
            <motion.label
              key={id}
              whileHover={{ y: -2 }}
              className={`relative flex items-center gap-4 rounded-2xl p-4 cursor-pointer
                         border transition
                         ${
                           selected
                             ? "border-ogr ring-2 ring-ogr/40"
                             : "border-gray-300"
                         }`}
            >
              {/* hidden radio */}
              <input
                type="radio"
                name="payment"
                value={id}
                checked={selected}
                onChange={() => setPaymentMethod(id)}
                className="sr-only"
              />

              {/* label text */}
              <span className="font-medium text-lg">{label}</span>

              {/* animated check badge */}
              {selected && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute top-2 right-2 h-5 w-5 rounded-full bg-ogr text-white
                             flex items-center justify-center text-[10px] font-bold"
                >
                  ✓
                </motion.span>
              )}
            </motion.label>
          );
        })}
      </div>
    </motion.section>
  );
}
