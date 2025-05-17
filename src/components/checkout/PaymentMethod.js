"use client";
export default function PaymentMethod({ paymentMethod, setPaymentMethod }) {
  return (
    <section className="border p-4 rounded">
      <h2 className="font-semibold mb-4">Payment Method</h2>
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="payment"
            value="paypal"
            checked={paymentMethod === "paypal"}
            onChange={() => setPaymentMethod("paypal")}
          />
          Pay with PayPal
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="payment"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={() => setPaymentMethod("cod")}
          />
          Cash on Delivery
        </label>
      </div>
    </section>
  );
}
