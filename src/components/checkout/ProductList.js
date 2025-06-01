// frontend/src/components/checkout/ProductList.jsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import useCartStore from "@/store/cartStore";

export default function ProductList() {
  const { items: cartItems, buyNowProduct, subtotal } = useCartStore();

  // Build a uniform array of items (either “buy now” or full cart)
  const listItems = buyNowProduct
    ? [
        {
          id: buyNowProduct._id,
          title: buyNowProduct.title,
          size: buyNowProduct.size,
          color: buyNowProduct.color,
          quantity: buyNowProduct.quantity,
          price: buyNowProduct.discountPrice ?? buyNowProduct.price,
          image: buyNowProduct.images?.[0] || null,
        },
      ]
    : cartItems.map((item) => ({
        id: item.product._id,
        title: item.product.title,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.product.discountPrice ?? item.product.price,
        image: item.product.images?.[0] || null,
      }));

  return (
    <motion.section
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="flex-1 flex flex-col bg-white rounded-3xl shadow-lg p-6 "
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order Items</h2>

      {/* Scrollable area up to 80% of viewport height */}
      <div className="flex-1 max-h-[80vh] overflow-y-auto overflow-x-hidden space-y-4 pr-2">
        {listItems.length === 0 ? (
          <p className="text-gray-500">No items in your order.</p>
        ) : (
          listItems.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="flex gap-4 items-center border rounded-xl p-3"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-16 w-16 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <div className="font-medium text-gray-800">{item.title}</div>
                <div className="text-sm text-gray-600">
                  {item.size && <>Size: {item.size} • </>}
                  {item.color && <>Color: {item.color} • </>}
                  Qty: {item.quantity}
                </div>
              </div>
              <div className="font-semibold text-green-700">
                QAR {item.price.toFixed(2)}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Subtotal at bottom of list */}
      <div className="pt-4 border-t mt-4 flex justify-between items-center">
        <span className="font-semibold text-gray-700">Subtotal:</span>
        <span className="font-bold text-xl text-gray-900">
          QAR {subtotal.toFixed(2)}
        </span>
      </div>
    </motion.section>
  );
}
