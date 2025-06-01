// components/pages/CheckoutPage.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import useCartStore from "@/store/cartStore";
import useCheckoutStore from "@/store/checkoutStore";
import useAuthStore from "@/store/authStore";

import PayPalButton from "@/components/checkout/PaypalButton";
import ShippingForm from "@/components/checkout/ShippingForm";
import OrderItems from "@/components/checkout/OrderItems";
import PaymentMethod from "@/components/checkout/PaymentMethod";
import CouponInput from "@/components/checkout/CouponInput";
import AddressSelector from "@/components/user/AddressSelector";
import apiService from "@/lib/apiService";

export default function CheckoutPage() {
  /* ---------------- stores & router ---------------- */
  const router = useRouter();
  const auth = useAuthStore();

  const {
    items: cartItems,
    subtotal,
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
    setSubtotal,
    coupon,
    clearCoupon,
  } = useCheckoutStore();

  /* ---------------- refs for scrolling ------------- */
  const addressRef = useRef(null);
  const payRef = useRef(null);

  /* ---------------- local state -------------------- */
  const [error, setError] = useState("");
  const [highlightAddress, setHighlightAddress] = useState(false);
  const [highlightPayment, setHighlightPayment] = useState(false);

  /* ---------------- coupon helpers ----------------- */
  const couponData = coupon?.[0] ?? null;
  const discountAmount = coupon?.[1] ?? 0;

  const buildItems = () => {
    if (buyNowProduct) {
      const { _id, quantity, size, color, discountPrice, price } =
        buyNowProduct;
      return [
        { product: _id, quantity, size, color, price: discountPrice ?? price },
      ];
    }
    return cartItems.map((i) => ({
      product: i.product._id,
      quantity: i.quantity,
      size: i.size,
      color: i.color,
      price: i.product.discountPrice ?? i.product.price,
    }));
  };

  /* ---------------- totals ------------------------- */
  const calculateFinalAmount = () =>
    (
      buildItems().reduce((s, i) => s + i.price * i.quantity, 0) -
      discountAmount
    ).toFixed(2);

  /* ---------------- effects ------------------------ */
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);
  useEffect(() => {
    setSubtotal(subtotal);
  }, [subtotal, setSubtotal]);

  /* ---------------- validation --------------------- */
  const validate = () => {
    const required = [
      "fullName",
      "email",
      "phone",
      "street",
      "city",
      "postalCode",
      "country",
    ];
    const filled = required.every(
      (k) => typeof address[k] === "string" && address[k].trim()
    );
    const hasAddr = auth.isLoggedIn ? !!address?._id : filled;
    const hasPay = !!paymentMethod;

    /* set highlights */
    setHighlightAddress(!hasAddr);
    setHighlightPayment(!hasPay);

    /* scroll to first invalid section */
    if (!hasAddr && addressRef.current)
      addressRef.current.scrollIntoView({ behavior: "smooth" });
    else if (!hasPay && payRef.current)
      payRef.current.scrollIntoView({ behavior: "smooth" });

    if (!hasAddr || !hasPay) {
      setError(
        !hasAddr && !hasPay
          ? "Please select or fill in a shipping address AND choose a payment method."
          : !hasAddr
          ? "Please select or fill in a shipping address."
          : "Please choose a payment method."
      );
      return false;
    }
    return true;
  };

  /* ---------------- place order -------------------- */
  const handlePlaceOrder = async () => {
    setError("");
    if (!validate()) return;

    try {
      /* build order payload … identical to your previous logic … */
      const items = buildItems();
      const totalAmount = items.reduce((s, i) => s + i.price * i.quantity, 0);
      const finalAmount = totalAmount - discountAmount;

      const fullAddr = `${address.street}, ${address.city}, ${address.postalCode}, ${address.country}`;

      const res = await apiService.orders.place({
        items,
        address: { ...address, address: fullAddr },
        paymentMethod,
        isPaid: paymentMethod === "paypal",
        totalAmount: finalAmount,
        couponCode: couponData?.code,
      });

      buyNowProduct ? clearBuyNowProduct() : await clearCart();
      clearCoupon();
      router.push(`/order/confirmation?id=${res.data._id}`);
    } catch (err) {
      setError(err.message || "Something went wrong during order placement.");
    }
  };

  /* ---------------- early states ------------------- */
  if (!isLoaded)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="animate-pulse text-lg font-medium">
          Loading checkout…
        </span>
      </div>
    );
  if (!buyNowProduct && cartItems.length === 0)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="mb-6 text-xl">Your cart is empty.</p>
        <button
          onClick={() => router.push("/categories")}
          className="btn-primary"
        >
          Continue Shopping
        </button>
      </div>
    );

  /* ---------------- page --------------------------- */
  return (
    <main className="relative min-h-screen w-full bg-sgr/20 overflow-hidden">
      {/* decorative blurs … unchanged … */}

      <section className="container mx-auto px-4 py-10">
        <motion.h1 /* fade-in heading */>Checkout</motion.h1>

        <motion.div /* stagger grid */ className="grid lg:grid-cols-2 gap-10">
          {/* ---------- LEFT COLUMN ---------- */}
          <motion.div className="space-y-8">
            {/* address / shipping block */}
            <div
              ref={addressRef}
              className={
                highlightAddress ? "ring-2 ring-red-500 rounded-3xl" : ""
              }
            >
              {auth.isLoggedIn ? (
                <AddressSelector
                  address={address}
                  setAddress={setAddress}
                  type="checkout"
                />
              ) : (
                <ShippingForm
                  address={address}
                  onChange={(e) =>
                    setAddress({ ...address, [e.target.name]: e.target.value })
                  }
                />
              )}
            </div>

            {/* payment method block */}
            <div
              ref={payRef}
              className={
                highlightPayment ? "ring-2 ring-red-500 rounded-3xl" : ""
              }
            >
              <PaymentMethod
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />
            </div>

            {/* coupon + errors */}
            <CouponSection
              couponData={couponData}
              discountAmount={discountAmount}
            />
            {error && <p className="text-red-500">{error}</p>}

            {/* place order btn */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={
                paymentMethod === "paypal" ? undefined : handlePlaceOrder
              }
              disabled={paymentMethod === "paypal"}
              className="bg-sgr rounded-full py-[1rem] text-3xl w-full disabled:opacity-60"
            >
              {paymentMethod === "paypal"
                ? "Please use the PayPal button below"
                : `Place Order – QAR ${calculateFinalAmount()}`}
            </motion.button>
          </motion.div>

          {/* ---------- RIGHT COLUMN ---------- */}
          <motion.div className="sticky top-24">
            <OrderItems
              cartItems={cartItems}
              buyNowProduct={buyNowProduct}
              subtotal={subtotal}
            />
          </motion.div>
        </motion.div>

        {/* PayPal button */}
        {paymentMethod === "paypal" && (
          <motion.div /* fade in */ className="mt-10 flex justify-center">
            <PayPalButton
              amount={
                buyNowProduct
                  ? (buyNowProduct.discountPrice ?? buyNowProduct.price) *
                      buyNowProduct.quantity -
                    discountAmount
                  : subtotal - discountAmount
              }
              onSuccess={handlePlaceOrder}
              onError={() => setError("PayPal checkout failed.")}
            />
          </motion.div>
        )}
      </section>
    </main>
  );
}

/* ------------ small coupon subsection ------------- */
function CouponSection({ couponData, discountAmount }) {
  return (
    <motion.section
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      animate="visible"
      className="rounded-3xl border border-gray-200 p-6 bg-white/60 backdrop-blur-sm"
    >
      <h2 className="font-semibold mb-3 text-lg">Have a coupon?</h2>
      <CouponInput />
      {couponData && (
        <p className="mt-2 text-sm text-emerald-600">
          Discount applied: QAR {discountAmount.toFixed(2)} ({couponData.code})
        </p>
      )}
    </motion.section>
  );
}
