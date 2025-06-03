// app/user/profile/orders/[id]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Loader from "@/components/common/Loader";
import EditOrderFormModal from "@/components/orders/EditOrderFormModal";
import ConfirmModal from "@/components/common/ConfirmModal";
import apiService from "@/lib/apiService";
import usePopupStore from "@/store/popupStore";
import useAuthStore from "@/store/authStore";
import useConfirmStore from "@/store/useConfirmStore";
import InvoiceDownloadButton from "../invoice/InvoiceDownloadButton";

export default function OrderDetailPage() {
  /* ────────── local state */
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);

  /* ────────── stores */
  const { showError, showSuccess } = usePopupStore();
  const { isLoggedIn } = useAuthStore();
  const { openConfirm } = useConfirmStore();

  /* ────────── fetch order */
  useEffect(() => {
    async function fetchOrder() {
      try {
        const data = await apiService.orders.getByCustomId(id);
        setOrder(data);
      } catch (err) {
        showError(err.message || "Failed to fetch order");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchOrder();
  }, [id, showError]);

  /* ────────── real cancel */
  async function doCancel() {
    try {
      let updated;
      if (isLoggedIn) {
        updated = await apiService.orders.cancel(order.customOrderId);
      } else {
        const email = prompt("Please enter the email used during checkout:");
        if (!email?.trim())
          return showError("Email is required to cancel the order.");
        updated = await apiService.orders.cancelGuest({
          customOrderId: order.customOrderId,
          email: email.trim(),
        });
      }
      showSuccess("Order cancelled successfully");
      setOrder(updated);
    } catch (err) {
      showError(err.message);
    }
  }

  /* ────────── open confirm modal */
  function handleCancelOrder() {
    openConfirm({
      message: "Are you sure you want to cancel this order?",
      onConfirm: () => doCancel(),
      onCancel: () => {},
    });
  }

  /* ────────── gates */
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-sgr/50">
        <Loader />
      </div>
    );
  if (!order)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Order not found.
      </div>
    );

  /* ────────── UI */
  return (
    <div className="min-h-[60vh] bg-sgr/50 py-[2rem] px-[10rem] flex items-center justify-center">
      {/* global confirm modal listens to store */}
      <ConfirmModal />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-10 space-y-8"
      >
        {/* header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-eulogy text-gray-800">
              Order&nbsp;#{order.customOrderId}
            </h1>
            <p className="text-gray-500 mt-1 text-2xl">
              Placed on&nbsp;
              {new Date(order.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-4 py-1 rounded-full font-medium text-2xl ${
                order.isPaid
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {order.isPaid ? "PAID" : "UNPAID"}
            </span>
            <span className="px-4 py-1 rounded-full text-2xl bg-gray-200 text-gray-700">
              {order.paymentMethod.toUpperCase()}
            </span>
          </div>
        </div>

        {/* address & totals */}
        <div className="grid md:grid-cols-2 gap-10">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className="space-y-2"
          >
            <h2 className="text-2xl font-semibold">Shipping Address</h2>
            <div className="text-gray-700 leading-relaxed text-xl">
              <p>{order.address?.fullName}</p>
              <p>
                {order.address?.street}, {order.address?.city}
              </p>
              <p>
                {order.address?.country} – {order.address?.postalCode}
              </p>
              <p>📧 {order.address?.email}</p>
              <p>📞 {order.address?.phone}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
            className="bg-gray-50 rounded-2xl p-6 shadow-inner"
          >
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 text-gray-700">
              {order.items.map((it, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-xl">
                    {it.quantity} × {it.product?.title}
                  </span>
                  <span className="text-xl">
                    QAR&nbsp;{(it.price * it.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4 flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>QAR&nbsp;{order.totalAmount}</span>
            </div>
          </motion.div>
        </div>

        {/* actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <InvoiceDownloadButton order={order} />

          {order.canModify && (
            <div className="flex gap-3">
              <button
                onClick={handleCancelOrder}
                className="px-5 py-3 text-2xl rounded-full bg-red-600 hover:bg-red-700 text-white transition"
              >
                Cancel Order
              </button>
              <button
                onClick={() => setShowEditForm(true)}
                className="px-5 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition text-2xl"
              >
                Edit Details
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>

      {showEditForm && (
        <EditOrderFormModal
          order={order}
          onClose={() => setShowEditForm(false)}
          onSuccess={(updated) => setOrder(updated?.data || updated)}
        />
      )}
    </div>
  );
}
