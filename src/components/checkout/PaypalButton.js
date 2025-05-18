"use client";

import { PayPalButtons } from "@paypal/react-paypal-js";
import { convertToUSD } from "@/lib/helpers";
import { createPaypalOrder, capturePaypalOrder } from "@/lib/api";

export default function PayPalButton({ amount, onSuccess, onError }) {
  const usdAmount = convertToUSD(amount); // Convert QAR to USD

  return (
    <div className="mt-4">
      <PayPalButtons
        style={{
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "paypal",
        }}
        createOrder={async () => {
          try {
            const res = await createPaypalOrder(usdAmount); // res = { data: { id: "..." } }
            return res.data.id; // ✅ This should return the PayPal order ID
          } catch (err) {
            console.error("❌ Failed to create PayPal order:", err.message);
            onError?.(err);
          }
        }}
        onApprove={async (data) => {
          try {
            const captureResult = await capturePaypalOrder(data.orderID);
            console.log("✅ PayPal Payment Captured:", captureResult);
            onSuccess?.(captureResult); // Call order placement logic
          } catch (err) {
            console.error("❌ Failed to capture PayPal order:", err.message);
            onError?.(err);
          }
        }}
        onError={(err) => {
          console.error("❌ PayPal Button Error:", err);
          onError?.(err);
        }}
      />
    </div>
  );
}
