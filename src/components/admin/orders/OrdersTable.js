"use client";

import Link from "next/link";
import { formatDate } from "@/lib/formatDate";

export default function OrdersTable({ orders, onCancel }) {
  return (
    <div className="overflow-x-auto mb-6">
      <table className="w-full table-auto border-collapse border">
        <thead>
          <tr className="bg-gray-100 text-2xl">
            <th className="p-3 border text-left">Order ID</th>
            <th className="p-3 border text-left">User</th>
            <th className="p-3 border text-left">Amount</th>
            <th className="p-3 border text-left">Status</th>
            <th className="p-3 border text-left">Placed At</th>
            <th className="p-3 border text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order) => (
            <tr key={order._id} className="hover:bg-gray-50 text-lg">
              <td className="p-3 border">{order.customOrderId}</td>
              <td className="p-3 border">
                {order.user
                  ? `${order.user.name} (${order.user.email})`
                  : "Guest"}
              </td>
              <td className="p-3 border">QAR {order.totalAmount.toFixed(2)}</td>
              <td className="p-3 border capitalize">{order.status}</td>
              <td className="p-3 border">{formatDate(order.createdAt)}</td>
              <td className="p-3 border flex items-center gap-4">
                <Link
                  href={`/admin/orders/${order._id}`}
                  className="text-blue-600 hover:underline"
                >
                  View
                </Link>
                {order.status !== "cancelled" && (
                  <button
                    onClick={() => onCancel(order._id)}
                    className="text-red-600 hover:underline"
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td className="p-3 border text-center" colSpan="6">
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
