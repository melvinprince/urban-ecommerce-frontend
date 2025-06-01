// app/checkout/page.jsx  →  OrderConfirmationPage
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import useCartStore from "@/store/cartStore";
import useCheckoutStore from "@/store/checkoutStore";

import InvoiceDownloadButton from "@/components/invoice/InvoiceDownloadButton";
import SvgIcon from "@/components/common/SvgIcon"; // if you have a helper

/* glass style shortcut */
const glass =
  "bg-white/30 backdrop-blur-lg border border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.12)]";

export default function OrderConfirmationPage() {
  /* ---------------- state / stores ---------------- */
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("id");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartCleared, setCartCleared] = useState(false);

  const clearCart = useCartStore((s) => s.clearCart);
  const fromBuyNow = useCheckoutStore((s) => s.fromBuyNow);
  const clearBuyNowProduct = useCheckoutStore((s) => s.clearBuyNowProduct);

  /* ---------------- fetch order ------------------- */
  useEffect(() => {
    (async () => {
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

        /* cleanup */
        if (!fromBuyNow && !cartCleared) {
          clearCart();
          setCartCleared(true);
        }
        clearBuyNowProduct();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId, cartCleared, clearCart, fromBuyNow, clearBuyNowProduct]);

  /* ---------------- early states ------------------ */
  if (loading) return <Loading />;
  if (error) return <ErrorMsg msg={error} />;
  if (!order) return null;

  /* ---------------- page -------------------------- */
  return (
    <main className="min-h-screen w-full relative overflow-hidden">
      {/* soft blobs */}
      <Blob className="top-[-120px] left-[-140px] bg-emerald-300" />
      <Blob className="bottom-[-160px] right-[-110px] bg-pink-300" />

      {/* content */}
      <section className="relative mx-auto max-w-6xl w-full px-6 py-20">
        {/* logo */}
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-center mb-12"
        >
          <Image
            src="/brandData/URBAN-logo-transparent.png"
            alt="Company logo"
            width={160}
            height={80}
            className="h-24 w-auto"
          />
        </motion.div>

        {/* headline */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center text-5xl md:text-7xl font-extrabold text-emerald-700 mb-16"
        >
          Thank you for your order! 🎉
        </motion.h1>

        {/* GRID ------------------------------------------------------- */}
        <AnimatePresence>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.07 } },
            }}
            className="grid lg:grid-cols-2 gap-12"
          >
            {/* order meta */}
            <Card>
              <Title>Order Details</Title>
              <Info label="Order ID" value={order.customOrderId} bold />
              <Info
                label="Placed on"
                value={new Date(order.createdAt).toLocaleString()}
              />
            </Card>

            {/* payment summary */}
            <Card>
              <Title>Payment</Title>
              <Info label="Method" value={order.paymentMethod.toUpperCase()} />
              <Info
                label="Status"
                value={order.isPaid ? "Paid ✅" : "Not Paid ❌"}
              />
              {order.paidAt && (
                <Info
                  label="Paid At"
                  value={new Date(order.paidAt).toLocaleString()}
                />
              )}
              <Info
                label="Total"
                value={`${order.totalAmount.toFixed(2)} QAR`}
                bold
              />
            </Card>

            {/* shipping */}
            <Card>
              <Title>Shipping Address</Title>
              <p className="font-medium text-lg">{order.address.fullName}</p>
              <p className="text-base text-gray-700">
                {order.address.email} • {order.address.phone}
              </p>
              <p className="text-base text-gray-700">
                {order.address.street}, {order.address.city}
              </p>
              <p className="text-base text-gray-700">
                {order.address.postalCode}, {order.address.country}
              </p>
            </Card>

            {/* items */}
            <Card>
              <Title>Items</Title>
              <ul className="max-h-[20rem] space-y-4 overflow-y-auto pr-2">
                {order.items.map((it, idx) => (
                  <li key={idx} className={`p-4 rounded-lg border ${glass}`}>
                    <p className="font-semibold line-clamp-1 text-lg">
                      {it.product.title}
                    </p>
                    <p className="text-base text-gray-600">
                      {it.size && <>Size: {it.size} &nbsp;</>}
                      {it.color && <>Color: {it.color} &nbsp;</>}
                      Qty: {it.quantity}
                    </p>
                    <p className="font-bold text-ogr mt-2 text-lg">
                      {(it.price * it.quantity).toFixed(2)} QAR
                    </p>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="mt-20 flex justify-center">
          <InvoiceDownloadButton order={order} />
        </div>
      </section>
    </main>
  );
}

/* ---------------- reusable small components ---------------- */
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <span className="animate-pulse text-2xl font-medium">Loading order…</span>
  </div>
);

const ErrorMsg = ({ msg }) => (
  <div className="min-h-screen flex items-center justify-center text-red-600">
    <p className="text-xl font-semibold">Error: {msg}</p>
  </div>
);

const Card = ({ children }) => (
  <motion.section
    variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
    className={`rounded-3xl p-8 space-y-5 ${glass}`}
  >
    {children}
  </motion.section>
);

const Title = ({ children, icon }) => (
  <h3 className="flex items-center gap-3 font-semibold text-xl mb-3">
    {children}
  </h3>
);

const Info = ({ label, value, bold }) => (
  <p className={`${bold ? "font-semibold text-lg" : "text-lg text-gray-700"}`}>
    {label}: <span className="font-medium">{value}</span>
  </p>
);

const Blob = ({ className }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1.4, opacity: 0.12 }}
    transition={{ duration: 1.4, ease: "easeOut" }}
    className={`pointer-events-none fixed w-[32rem] h-[32rem] rounded-full blur-[180px] ${className}`}
  />
);
