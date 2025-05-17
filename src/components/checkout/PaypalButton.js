"use client";

import { PayPalButtons } from "@paypal/react-paypal-js";
import { convertToUSD } from "@/lib/helpers"; // Make sure this path is correct

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
        createOrder={(_, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: usdAmount, // Converted to USD string
                  currency_code: "USD",
                },
              },
            ],
          });
        }}
        onApprove={async (data, actions) => {
          try {
            const details = await actions.order.capture();
            console.log("✅ PayPal Payment Captured:", details);
            onSuccess(details);
          } catch (err) {
            console.error("❌ Error during capture:", err);
            onError(err);
          }
        }}
        onError={(err) => {
          console.error("❌ PayPal Error:", err);
          onError(err);
        }}
      />
    </div>
  );
}
