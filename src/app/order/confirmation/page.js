"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import useCartStore from "@/store/cartStore";
import useCheckoutStore from "@/store/checkoutStore";

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartCleared, setCartCleared] = useState(false);

  const clearCart = useCartStore((s) => s.clearCart);
  const { buyNowProduct, fromBuyNow, clearBuyNowProduct } = useCheckoutStore();

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setError("Invalid order ID");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${orderId}`
        );
        const json = await res.json();

        if (!res.ok) throw new Error(json.message || "Failed to fetch order");

        setOrder(json.data);

        // ✅ Clear cart only if it's NOT a Buy Now checkout
        if (!fromBuyNow && !cartCleared) {
          clearCart();
          setCartCleared(true);
        }

        // ✅ Always clean up Buy Now state
        clearBuyNowProduct();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId, cartCleared, clearCart, fromBuyNow, clearBuyNowProduct]);

  if (loading)
    return <div className="p-6 text-center">Loading order details…</div>;
  if (error)
    return <div className="p-6 text-red-500 text-center">Error: {error}</div>;
  if (!order) return null;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center text-green-700">
        🎉 Thank you for your order!
      </h1>
      <div className="text-center text-gray-600">
        Order ID: <strong>{order._id}</strong>
        <br />
        Placed on: {new Date(order.createdAt).toLocaleString()}
      </div>

      <section className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Payment Summary</h2>
        <p>
          Method: <strong>{order.paymentMethod.toUpperCase()}</strong>
        </p>
        <p>
          Status: <strong>{order.isPaid ? "Paid ✅" : "Not Paid ❌"}</strong>
        </p>
        {order.paidAt && (
          <p>Paid At: {new Date(order.paidAt).toLocaleString()}</p>
        )}
        <p className="font-bold mt-2">
          Total: {order.totalAmount.toFixed(2)} QAR
        </p>
      </section>

      <section className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Shipping Details</h2>
        <p>{order.address.fullName}</p>
        <p>
          {order.address.email} • {order.address.phone}
        </p>
        <p>
          {order.address.street}, {order.address.city}
        </p>
        <p>
          {order.address.postalCode}, {order.address.country}
        </p>
      </section>

      <section className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Items</h2>
        <ul className="space-y-3">
          {order.items.map((item, idx) => (
            <li key={idx} className="border rounded p-2">
              <div className="font-medium">{item.product.title}</div>
              <div className="text-sm text-gray-600">
                {item.size && <>Size: {item.size} • </>}
                {item.color && <>Color: {item.color} • </>}
                Qty: {item.quantity}
              </div>
              <div className="text-green-700 font-semibold">
                {(item.price * item.quantity).toFixed(2)} QAR
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
