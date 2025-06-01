// components/checkout/OrderItems.jsx
"use client";

import { motion } from "framer-motion";
import useCheckoutStore from "@/store/checkoutStore";

/* -------------------------------------------- */
/* reusable helpers */
const currency = (num) => `${parseFloat(num).toFixed(2)} QAR`;
const glass =
  "bg-white/40 backdrop-blur-xl shadow-[0_6px_20px_rgba(0,0,0,0.12)]";

/* -------------------------------------------- */
export default function OrderItems({ cartItems, buyNowProduct, subtotal }) {
  const { coupon } = useCheckoutStore();
  const couponInfo = coupon?.[0] ?? null;
  const discount = coupon?.[1] ?? 0;

  const baseTotal = buyNowProduct
    ? (buyNowProduct.discountPrice ?? buyNowProduct.price) *
      buyNowProduct.quantity
    : subtotal;

  const grandTotal = baseTotal - discount;

  /* ---------------  UI --------------- */
  return (
    <motion.section
      initial={{ opacity: 0, y: 25, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.9, 0.3, 1] }}
      className={`rounded-3xl border border-gray-200 p-8 space-y-6 ${glass}`}
    >
      {/* heading with subtle neon underline */}
      <h2 className="text-2xl font-semibold relative w-fit">
        Order Summary
        <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-gradient-to-r from-ogr to-indigo-500 rounded-full" />
      </h2>

      {/* item cards ---------------------------------------------------- */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 1 },
          visible: { transition: { staggerChildren: 0.05 } },
        }}
        className="space-y-3"
      >
        {buyNowProduct ? (
          <ItemCard key="single" item={buyNowProduct} />
        ) : (
          cartItems.map((ci) => <ItemCard key={ci._id} item={ci} />)
        )}
      </motion.div>

      {/* totals -------------------------------------------------------- */}
      <div className="border-t pt-5 space-y-2 text-[15px] leading-relaxed">
        <Row label="Subtotal" value={currency(baseTotal)} />
        {couponInfo && (
          <Row
            label={`Discount ( ${couponInfo.code} )`}
            value={`- ${currency(discount)}`}
            accent
          />
        )}
        <Row label="Total" value={currency(grandTotal)} bold />
      </div>
    </motion.section>
  );
}

/* -------- reusable rows -------- */
function Row({ label, value, bold, accent }) {
  return (
    <div
      className={`flex justify-between ${
        bold ? "font-bold text-lg" : "font-medium"
      } ${accent ? "text-emerald-600" : ""}`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

/* -------- single item card -------- */
function ItemCard({ item }) {
  const price = (
    item.discountPrice ??
    item.price ??
    item.product?.discountPrice ??
    item.product?.price
  ).toFixed(2);

  const title = item.title ?? item.product?.title ?? "Product";
  const { size, color, quantity: qty } = item;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -3, boxShadow: "0 12px 25px rgba(0,0,0,0.12)" }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className={`rounded-xl border border-gray-200 p-4 ${glass}`}
    >
      <div className="font-semibold text-2xl line-clamp-1">{title}</div>

      {/* meta line */}
      <div className="text-lg text-gray-600 mt-1 flex flex-wrap gap-x-1 gap-y-0.5">
        {size && <span>Size • {size}</span>}
        {color && <span>Color • {color}</span>}
        <span>Qty • {qty}</span>
      </div>

      <div className="font-bold text-ogr text-3xl mt-2">{currency(price)}</div>
    </motion.div>
  );
}
