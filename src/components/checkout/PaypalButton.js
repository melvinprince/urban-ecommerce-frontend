"use client";

import { PayPalButtons } from "@paypal/react-paypal-js";
import { convertToUSD } from "@/lib/helpers";
import apiService from "@/lib/apiService";

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
            const res = await apiService.paypal.createOrder(usdAmount);
            return res.data.id; // ✅ This should return the PayPal order ID
          } catch (err) {
            console.error("❌ Failed to create PayPal order:", err.message);
            onError?.(err);
          }
        }}
        onApprove={async (data) => {
          try {
            const captureResult = await apiService.paypal.captureOrder(
              data.orderID
            );
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
