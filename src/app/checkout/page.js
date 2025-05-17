"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useCartStore from "@/store/cartStore";
import useCheckoutStore from "@/store/checkoutStore";
import PayPalButton from "@/components/checkout/PaypalButton";

export default function CheckoutPage() {
  const router = useRouter();

  // Cart store
  const {
    items: cartItems,
    subtotal,
    totalItems,
    isLoaded,
    fetchCart,
  } = useCartStore();

  // Checkout store
  const {
    address,
    setAddress,
    paymentMethod,
    setPaymentMethod,
    buyNowProduct,
    clearBuyNowProduct,
  } = useCheckoutStore();

  const [error, setError] = useState("");

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    setError("");

    const hasAddress = Object.values(address).every((v) => v.trim() !== "");
    const hasItems = buyNowProduct || (cartItems && cartItems.length > 0);
    const hasPayment = !!paymentMethod;

    if (!hasAddress || !hasItems || !hasPayment) {
      setError("Please complete all fields and select a payment method.");
      return;
    }

    try {
      const items = [];

      if (buyNowProduct) {
        const { product, quantity, size, color } = buyNowProduct;
        items.push({
          product: product._id,
          quantity,
          size,
          color,
          price: product.discountPrice ?? product.price,
        });
      } else {
        for (const item of cartItems) {
          items.push({
            product: item.product._id,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            price: item.product.discountPrice ?? item.product.price,
          });
        }
      }

      const totalAmount = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Optionally: include auth token if required
          },
          body: JSON.stringify({
            items,
            address,
            paymentMethod,
            isPaid: paymentMethod === "paypal",
            totalAmount,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to place order.");

      // ✅ Success
      if (buyNowProduct) clearBuyNowProduct();
      else useCartStore.getState().clearCart(); // assuming you have this

      router.push(`/order/confirmation?id=${data.data._id}`);
    } catch (err) {
      setError(err.message || "Something went wrong during order placement.");
    }
  };

  const renderItems = () => {
    if (buyNowProduct) {
      const { product, quantity, size, color } = buyNowProduct;
      return (
        <div className="border p-2 rounded">
          <div className="font-medium">{product.title}</div>
          <div className="text-sm text-gray-600">
            {size && <>Size: {size} • </>}
            {color && <>Color: {color} • </>}
            Qty: {quantity}
          </div>
          <div className="font-bold text-green-700 mt-1">
            {(product.discountPrice ?? product.price).toFixed(2)} QAR
          </div>
        </div>
      );
    }

    return cartItems.map((item) => (
      <div key={item._id} className="border p-2 rounded">
        <div className="font-medium">{item.product.title}</div>
        <div className="text-sm text-gray-600">
          {item.size && <>Size: {item.size} • </>}
          {item.color && <>Color: {item.color} • </>}
          Qty: {item.quantity}
        </div>
        <div className="font-bold text-green-700 mt-1">
          {(item.product.discountPrice ?? item.product.price).toFixed(2)} QAR
        </div>
      </div>
    ));
  };

  if (!isLoaded)
    return <div className="p-6 text-center">Loading checkout…</div>;

  if (!buyNowProduct && cartItems.length === 0) {
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

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Checkout</h1>

      {/* Address Form */}
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

      {/* Order Items */}
      <section className="border p-4 rounded space-y-2">
        <h2 className="font-semibold mb-4">Order Summary</h2>
        {renderItems()}
        <div className="flex justify-between font-semibold mt-4 pt-2 border-t">
          <span>Subtotal:</span>
          <span>
            {buyNowProduct
              ? (
                  (buyNowProduct.product.discountPrice ??
                    buyNowProduct.product.price) * buyNowProduct.quantity
                ).toFixed(2)
              : subtotal.toFixed(2)}{" "}
            QAR
          </span>
        </div>
      </section>

      {/* Payment Method */}
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

      {/* Error / Action */}
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={paymentMethod === "paypal" ? undefined : handlePlaceOrder}
        disabled={paymentMethod === "paypal"}
        className="w-full bg-ogr text-white py-3 rounded hover:bg-opacity-90 transition disabled:opacity-50"
      >
        {paymentMethod === "paypal"
          ? "Please use the PayPal button below"
          : "Place Order"}
      </button>
      {paymentMethod === "paypal" && (
        <PayPalButton
          amount={
            buyNowProduct
              ? (buyNowProduct.product.discountPrice ??
                  buyNowProduct.product.price) * buyNowProduct.quantity
              : subtotal
          }
          onSuccess={async () => {
            try {
              const items = [];

              if (buyNowProduct) {
                const { product, quantity, size, color } = buyNowProduct;
                items.push({
                  product: product._id,
                  quantity,
                  size,
                  color,
                  price: product.discountPrice ?? product.price,
                });
              } else {
                for (const item of cartItems) {
                  items.push({
                    product: item.product._id,
                    quantity: item.quantity,
                    size: item.size,
                    color: item.color,
                    price: item.product.discountPrice ?? item.product.price,
                  });
                }
              }

              const totalAmount = items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              );

              const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    items,
                    address,
                    paymentMethod: "paypal",
                    isPaid: true,
                    totalAmount,
                  }),
                }
              );

              const data = await res.json();
              if (!res.ok)
                throw new Error(data.message || "Failed to place order");

              if (buyNowProduct) clearBuyNowProduct();
              else useCartStore.getState().clearCart();

              router.push(`/order/confirmation?id=${data.data._id}`);
            } catch (err) {
              setError(err.message);
            }
          }}
          onError={(err) => setError("PayPal checkout failed.")}
        />
      )}
    </div>
  );
}
