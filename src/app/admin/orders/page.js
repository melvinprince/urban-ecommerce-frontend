"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import adminApiService from "@/lib/adminApiService";
import usePopupStore from "@/store/popupStore";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const { showError, showSuccess } = usePopupStore();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await adminApiService.orders.getAll();
        setOrders(res.data);
      } catch (err) {
        showError(err.message);
      }
    };

    fetchOrders();
  }, [showError]);

  const handleCancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      await adminApiService.orders.cancel(id);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: "cancelled" } : order
        )
      );
      showSuccess("Order cancelled");
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Order ID</th>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="p-2 border">{order.customOrderId}</td>
                <td className="p-2 border">
                  {order.user
                    ? `${order.user.name} (${order.user.email})`
                    : "Guest"}
                </td>
                <td className="p-2 border">${order.totalAmount}</td>
                <td className="p-2 border">{order.status}</td>
                <td className="p-2 border">
                  <Link
                    href={`/admin/orders/${order._id}`}
                    className="text-blue-600 mr-2"
                  >
                    View
                  </Link>
                  {order.status !== "cancelled" && (
                    <button
                      onClick={() => handleCancel(order._id)}
                      className="text-red-600"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td className="p-2 border text-center" colSpan="5">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
