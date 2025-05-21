// frontend/src/components/checkout/CouponInput.jsx
"use client";

import { useState } from "react";
import usePopupStore from "@/store/popupStore";
import useCheckoutStore from "@/store/checkoutStore";

export default function CouponInput() {
  const [code, setCode] = useState("");
  const applyCoupon = useCheckoutStore((s) => s.applyCoupon);
  const clearCoupon = useCheckoutStore((s) => s.clearCoupon);
  const coupon = useCheckoutStore((s) => s.coupon);
  const address = useCheckoutStore((s) => s.address); // for guest email
  const { showSuccess, showError } = usePopupStore();

  const handleApply = async () => {
    // If guest, ensure email is entered first
    if (!address.email) {
      showError(
        "Please enter your email in shipping details before applying a coupon."
      );
      return;
    }
    await applyCoupon(code.trim().toUpperCase());
    const { error: err, coupon: cpn } = useCheckoutStore.getState();
    if (err) {
      showError(err);
    } else if (cpn) {
      showSuccess(
        `Coupon ${cpn.code} applied! You saved QAR ${cpn.discount.toFixed(2)}.`
      );
      setCode("");
    }
  };

  const handleRemove = () => {
    clearCoupon();
    showSuccess("Coupon removed.");
  };

  return (
    <div className="flex items-center space-x-2">
      {coupon ? (
        <>
          <div className="flex-grow text-sm">
            Applied <strong>{coupon.code}</strong> — saved{" "}
            <strong>QAR {coupon.discount.toFixed(2)}</strong>
          </div>
          <button
            onClick={handleRemove}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Remove
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter coupon code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="border p-2 rounded flex-grow"
          />
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Apply
          </button>
        </>
      )}
    </div>
  );
}
