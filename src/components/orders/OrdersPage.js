// app/user/profile/orders/page.jsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import apiService from "@/lib/apiService";
import useAuthStore from "@/store/authStore";
import usePopupStore from "@/store/popupStore";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  shipped: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-green-100 text-green-800",
  refunded: "bg-gray-100 text-gray-800",
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function OrdersPage() {
  const { isLoggedIn, hydrated, initializeAuth } = useAuthStore();
  const { showError } = usePopupStore();
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!hydrated) return;
    if (!isLoggedIn) {
      router.replace("/user/login-register");
      return;
    }
    (async () => {
      try {
        const fetched = await apiService.orders.getMine();
        console.log("🔄 fetched orders:", fetched);
        setOrders(fetched);
      } catch (err) {
        showError(err.message || "Failed to load orders.");
      }
    })();
  }, [hydrated, isLoggedIn, router, showError]);

  if (!hydrated) return null;

  return (
    <div className="w-full min-h-screen bg-gray-50 py-12 z-[100]">
      <div className="w-fulll mx-auto px-6">
        {/* Animated Header */}
        <motion.header
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8 text-center"
        >
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-[3rem] font-eulogy text-gray-800"
          >
            Your Orders
          </motion.h1>
          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-2 text-lg text-gray-600"
          >
            Review your recent purchases and their statuses
          </motion.p>
        </motion.header>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="py-20 text-center text-gray-600"
          >
            No orders found.
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {orders.map((order) => {
              const statusColor =
                STATUS_COLORS[order.status] || STATUS_COLORS.pending;
              const paidBadge = order.isPaid
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white";

              return (
                <Link
                  key={order._id}
                  href={`/user/profile/orders/${order.customOrderId}`}
                  className="block group"
                >
                  <motion.div
                    variants={cardVariants}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 12px 28px rgba(0, 0, 0, 0.15)",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-md"
                  >
                    {/* Top Bar: Status & Payment */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.5 }}
                      className="flex items-center justify-between p-4 bg-gray-100"
                    >
                      <span
                        className={`${statusColor} px-3 py-1 rounded-full text-sm font-medium`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                      <span
                        className={`${paidBadge} px-3 py-1 rounded-full text-sm font-medium`}
                      >
                        {order.isPaid ? "Paid" : "Unpaid"}
                      </span>
                    </motion.div>

                    {/* Main Content */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className="flex-1 p-6 flex flex-col justify-between"
                    >
                      <div>
                        <div className="text-sm text-gray-500">Order ID</div>
                        <div className="text-xl font-semibold text-gray-800">
                          {order.customOrderId}
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="text-sm text-gray-500">Date</div>
                        <div className="text-base text-gray-800">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </div>
                      </div>

                      <div className="mt-4 text-base text-gray-700">
                        <span className="font-medium">Total: </span>QAR{" "}
                        {order.totalAmount}
                      </div>

                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Payment: </span>
                        {order.paymentMethod.toUpperCase()}
                      </div>
                    </motion.div>

                    {/* Footer with View Details */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className="p-4 bg-gray-50 flex justify-end"
                    >
                      <span className="text-sm text-gray-500 group-hover:text-gray-800 transition">
                        View Details →
                      </span>
                    </motion.div>
                  </motion.div>
                </Link>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
