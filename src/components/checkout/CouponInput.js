// components/checkout/CouponInput.jsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import shallow from "zustand/shallow";
import usePopupStore from "@/store/popupStore";
import useCheckoutStore from "@/store/checkoutStore";
import SvgIcon from "@/components/common/SvgIcon"; // optional

const glass =
  "bg-white/40 backdrop-blur-md border border-gray-200 shadow-[0_4px_14px_rgba(0,0,0,0.1)]";

export default function CouponInput() {
  const [code, setCode] = useState("");

  /* -------- safe selectors (no new object each time) -------- */
  const coupon = useCheckoutStore((s) => s.coupon);
  const address = useCheckoutStore((s) => s.address);
  const applyCoupon = useCheckoutStore((s) => s.applyCoupon);
  const clearCoupon = useCheckoutStore((s) => s.clearCoupon);

  const { showSuccess, showError } = usePopupStore();

  /* -------- handlers -------- */
  const handleApply = async () => {
    if (!address?.email) {
      return showError("Enter your email in shipping details first.");
    }
    await applyCoupon(code.trim().toUpperCase());
    const { error, coupon: cpn } = useCheckoutStore.getState();
    if (error) {
      showError(error);
    } else if (cpn) {
      showSuccess(`Coupon ${cpn[0].code} applied! Saved QAR ${cpn[1]}.`);
      setCode("");
    }
  };

  const handleRemove = () => {
    clearCoupon();
    showSuccess("Coupon removed.");
  };

  /* -------- UI -------- */
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col sm:flex-row gap-4"
    >
      <AnimatePresence mode="wait">
        {coupon ? (
          /* ----- applied badge ----- */
          <motion.div
            key="badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={`flex items-center justify-between flex-grow px-4 py-3 rounded-2xl ${glass}`}
          >
            <span className="text-sm font-medium tracking-wide">
              <span className="mr-1 text-ogr">{coupon[0].code}</span>
              saved <strong>QAR {coupon[1]}</strong>
            </span>
            <button
              onClick={handleRemove}
              className="ml-4 text-xs font-semibold text-red-600 hover:text-red-700 transition"
            >
              Remove
            </button>
          </motion.div>
        ) : (
          /* ----- input + apply btn ----- */
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col sm:flex-row gap-4 flex-grow"
          >
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              placeholder="Coupon code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className={`flex-grow rounded-xl py-2 px-3 text-sm uppercase tracking-widest
                          border border-gray-300 focus:ring-2 focus:ring-ogr/40 outline-none
                          transition ${glass}`}
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              disabled={!code.trim()}
              onClick={handleApply}
              className="flex items-center gap-1 bg-sgr text-white px-5 py-2
                         rounded-xl disabled:opacity-40 disabled:cursor-not-allowed
                         hover:bg-ogr/90 transition text-2xl justify-center"
            >
              Apply
              <SvgIcon
                src="/svg/doubleArrow-right.svg"
                width={14}
                height={14}
                className="pl-1"
              />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
