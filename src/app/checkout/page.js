"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useCartStore from "@/store/cartStore";

export default function CheckoutPage() {
  const router = useRouter();

  // Separate selectors to avoid inline object
  const items = useCartStore((s) => s.items);
  const totalItems = useCartStore((s) => s.totalItems);
  const subtotal = useCartStore((s) => s.subtotal);
  const isLoaded = useCartStore((s) => s.isLoaded);
  const fetchCart = useCartStore((s) => s.fetchCart);

  const [address, setAddress] = useState({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (!isLoaded) {
    return <div className="p-6 text-center">Loading checkout…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="p-6 text-center">
        <p>Your cart is empty.</p>
        <button
          onClick={() => router.push("/categories")}
          className="mt-4 bg-ogr text-white px-4 py-2 rounded"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = () => {
    // TODO: call your order API, then:
    router.push("/order/confirmation");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Checkout</h1>

      <section className="border p-4 rounded">
        <h2 className="font-semibold mb-4">Shipping Information</h2>
        <div className="grid grid-cols-1 gap-4">
          {[
            { label: "Full Name", name: "fullName" },
            { label: "Email", name: "email" },
            { label: "Phone", name: "phone" },
            { label: "Street Address", name: "street" },
            { label: "City", name: "city" },
            { label: "Postal Code", name: "postalCode" },
            { label: "Country", name: "country" },
          ].map(({ label, name }) => (
            <div key={name} className="flex flex-col">
              <label className="mb-1 font-medium">{label}</label>
              <input
                type="text"
                name={name}
                value={address[name]}
                onChange={handleChange}
                className="border rounded p-2"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="border p-4 rounded">
        <h2 className="font-semibold mb-4">Order Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Items ({totalItems})</span>
            <span>{subtotal.toFixed(2)} QAR</span>
          </div>
          {/* List items here if desired */}
        </div>
      </section>

      <button
        onClick={handlePlaceOrder}
        className="w-full bg-ogr text-white py-3 rounded hover:bg-opacity-90 transition"
      >
        Place Order
      </button>
    </div>
  );
}
