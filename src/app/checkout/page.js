"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useCartStore from "@/store/cartStore";
import useCheckoutStore from "@/store/checkoutStore";
import PayPalButton from "@/components/checkout/PaypalButton";
import ShippingForm from "@/components/checkout/ShippingForm";
import OrderItems from "@/components/checkout/OrderItems";
import PaymentMethod from "@/components/checkout/PaymentMethod";
import { placeOrder } from "@/lib/api";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items: cartItems,
    subtotal,
    totalItems,
    isLoaded,
    fetchCart,
    clearCart,
  } = useCartStore();

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

  const buildItems = () => {
    if (buyNowProduct) {
      const { _id, quantity, size, color, discountPrice, price } =
        buyNowProduct;
      return [
        {
          product: _id,
          quantity,
          size,
          color,
          price: discountPrice ?? price,
        },
      ];
    }
    return cartItems.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      price: item.product.discountPrice ?? item.product.price,
    }));
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
      const items = buildItems();
      const totalAmount = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const data = await placeOrder({
        items,
        address,
        paymentMethod,
        isPaid: paymentMethod === "paypal",
        totalAmount,
      });

      if (buyNowProduct) clearBuyNowProduct();
      else await clearCart();

      router.push(`/order/confirmation?id=${data.data._id}`);
    } catch (err) {
      setError(err.message || "Something went wrong during order placement.");
    }
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

      <ShippingForm address={address} onChange={handleChange} />
      <OrderItems
        cartItems={cartItems}
        buyNowProduct={buyNowProduct}
        subtotal={subtotal}
      />
      <PaymentMethod
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />

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
              ? (buyNowProduct.discountPrice ?? buyNowProduct.price) *
                buyNowProduct.quantity
              : subtotal
          }
          onSuccess={handlePlaceOrder}
          onError={() => setError("PayPal checkout failed.")}
        />
      )}
    </div>
  );
}
