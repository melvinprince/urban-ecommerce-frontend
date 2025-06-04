// File: app/admin/orders/[id]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import adminApiService from "@/lib/adminApiService";
import usePopupStore from "@/store/popupStore";
import { formatDate } from "@/lib/formatDate";
import Loader from "@/components/common/Loader";
import InvoiceDownloadButton from "@/components/invoice/InvoiceDownloadButton";

export default function AdminOrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showError, showSuccess } = usePopupStore();
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await adminApiService.orders.getById(id);
        setOrder(res.data);
        setStatus(res.data.status);
        setIsPaid(res.data.isPaid);
      } catch (err) {
        showError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, showError]);

  const handleUpdate = async () => {
    try {
      await adminApiService.orders.update(id, { status });
      showSuccess("Order status updated");
      router.refresh();
    } catch (err) {
      showError(err.message);
    }
  };

  const handlePaymentUpdate = async () => {
    try {
      await adminApiService.orders.updatePayment(id, { isPaid: !isPaid });
      setIsPaid(!isPaid);
      showSuccess(`Order marked as ${!isPaid ? "paid" : "unpaid"}`);
    } catch (err) {
      showError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-sgr/50">
        <Loader />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-sgr/50">
        <p className="text-2xl text-gray-700">Order not found.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-sgr/50 min-h-screen py-12 px-6 md:px-20 flex items-center justify-center"
    >
      <div className="mx-auto bg-white rounded-3xl shadow-lg p-8 w-full">
        <h1 className="text-5xl font-eulogy mb-8 text-gray-800">
          Order Details
        </h1>

        <div className="space-y-4">
          <p className="text-2xl">
            <span className="text-3xl font-semibold">Order ID:</span>{" "}
            {order.customOrderId}
          </p>
          <p className="text-2xl">
            <span className="font-semibold text-3xl">User:</span>{" "}
            {order.user ? `${order.user.name} (${order.user.email})` : "Guest"}
          </p>
          <p className="text-2xl">
            <span className="font-semibold text-3xl">Status:</span>{" "}
            {order.status}
          </p>
          <p className="text-2xl">
            <span className="font-semibold text-3xl">Paid:</span>{" "}
            {order.isPaid ? "Yes" : "No"}
          </p>
          <p className="text-2xl">
            <span className="font-semibold text-3xl">Payment Method:</span>{" "}
            {order.paymentMethod}
          </p>
          <p className="text-2xl">
            <span className="font-semibold text-3xl">Coupon:</span>{" "}
            {order.coupon?.code
              ? `${order.coupon.code} (${order.coupon.discount} off)`
              : "None"}
          </p>
          <p className="text-2xl">
            <span className="font-semibold text-3xl">Placed At:</span>{" "}
            {formatDate(order.createdAt)}
          </p>
          <p className="text-2xl">
            <span className="font-semibold text-3xl">Paid At:</span>{" "}
            {order.paidAt ? formatDate(order.paidAt) : "N/A"}
          </p>
          <p className="text-2xl">
            <span className="font-semibold text-3xl">Total:</span> QAR{" "}
            {order.totalAmount.toFixed(2)}
          </p>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Items</h2>
        <ul className="list-disc ml-6 space-y-2">
          {order.items.map((item, idx) => (
            <li key={idx} className="text-xl">
              <span className="font-medium">
                {item.product?.title || "Product Deleted"}
              </span>{" "}
              – {item.quantity} × QAR {item.price.toFixed(2)}
            </li>
          ))}
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Shipping Address</h2>
        <div className="space-y-1 text-xl">
          <p>{order.address.fullName}</p>
          <p>{order.address.email}</p>
          <p>{order.address.phone}</p>
          <p>
            {order.address.street}, {order.address.city},{" "}
            {order.address.country}
          </p>
        </div>

        <div className="mt-8 space-y-8">
          <div>
            <label className="block text-xl font-medium text-gray-700 mb-2">
              Update Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 rounded-2xl p-3 w-full text-lg focus:outline-none focus:ring-2 focus:ring-sgr"
            >
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={handleUpdate}
              className="mt-4 inline-flex items-center gap-2 bg-sgr hover:bg-ogr text-white px-5 py-3 rounded-full text-xl transition"
            >
              Update Status
            </button>
          </div>

          <div>
            <button
              onClick={handlePaymentUpdate}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-full text-xl transition"
            >
              Mark as {isPaid ? "Unpaid" : "Paid"}
            </button>
          </div>

          <div>
            <InvoiceDownloadButton order={order} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
