// app/user/profile/orders/page.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Loader from "@/components/common/Loader";
import apiService from "@/lib/apiService";
import useAuthStore from "@/store/authStore";
import usePopupStore from "@/store/popupStore";

/* colour map */
const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  shipped: "bg-blue-100   text-blue-800",
  cancelled: "bg-red-100    text-red-800",
  completed: "bg-green-100  text-green-800",
  refunded: "bg-gray-100   text-gray-800",
};

/* motion */
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const card = {
  hidden: { y: 24 },
  visible: { y: 0 },
};

export default function OrdersPage() {
  /* store */
  const { isLoggedIn, hydrated, initializeAuth } = useAuthStore();
  const { showError } = usePopupStore();

  /* local */
  const [orders, setOrders] = useState([]);

  /* router */
  const router = useRouter();

  /* 1 ▪ hydrate auth store (no Promise returned) */
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  /* 2 ▪ fetch orders once authenticated */
  useEffect(() => {
    if (!hydrated) return;

    if (!isLoggedIn) {
      router.replace("/user/login-register");
      return;
    }

    async function fetchOrders() {
      try {
        const data = await apiService.orders.getMine();
        setOrders(data);
      } catch (err) {
        console.error(err);
        showError(err.message || "Failed to load orders.");
      }
    }

    fetchOrders();
  }, [hydrated, isLoggedIn, router, showError]);

  /* 3 ▪ show loader while store hydrates */
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sgr/50">
        <Loader />
      </div>
    );
  }

  /* 4 ▪ UI */
  return (
    <div className="min-h-[60vh] bg-sgr/50 py-12 px-[10rem]">
      <div className="mx-auto max-w px-6">
        {/* header */}
        <motion.h1
          initial={{ scale: 0.96 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="text-[3rem] font-eulogy text-gray-800 text-center mb-10"
        >
          Your Orders
        </motion.h1>

        {orders.length === 0 ? (
          <p className="text-center text-gray-600 text-lg py-40">
            No orders found.
          </p>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-4 gap-8"
          >
            {orders.map((order) => {
              const badgeStatus =
                STATUS_COLORS[order.status] ?? STATUS_COLORS.pending;
              const badgePaid = order.isPaid
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white";

              return (
                <Link
                  key={order._id}
                  href={`/user/profile/orders/${order.customOrderId}`}
                  className="block"
                >
                  <motion.div
                    variants={card}
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-200 overflow-hidden flex flex-col"
                  >
                    {/* badges */}
                    <div className="p-4 bg-gray-100 flex justify-between">
                      <span
                        className={`${badgeStatus} px-3 py-1 rounded-full text-lg font-medium`}
                      >
                        {order.status.toUpperCase()}
                      </span>
                      <span
                        className={`${badgePaid} px-3 py-1 rounded-full text-lg font-medium`}
                      >
                        {order.isPaid ? "PAID" : "UNPAID"}
                      </span>
                    </div>

                    {/* details */}
                    <div className="p-6 space-y-4 flex flex-col flex-1">
                      <div>
                        <p className="text-xl text-gray-500">ORDER ID</p>
                        <p className="text-2xl font-semibold tracking-wide">
                          {order.customOrderId}
                        </p>
                      </div>

                      <div>
                        <p className="text-xl text-gray-500">DATE</p>
                        <p className="text-2xl">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>

                      <p className="mt-auto pt-2 text-xl font-bold">
                        QAR&nbsp;{order.totalAmount}
                      </p>
                    </div>

                    {/* footer */}
                    <div className="px-6 pb-4 text-right">
                      <span className="text-xl text-gray-500 group-hover:text-gray-800 transition">
                        View details →
                      </span>
                    </div>
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
