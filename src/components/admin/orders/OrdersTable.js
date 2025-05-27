"use client";

import Link from "next/link";
import { formatDate } from "@/lib/formatDate";

export default function OrdersTable({ orders, onCancel }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Order ID</th>
            <th className="p-2 border">User</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Placed At</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order) => (
            <tr key={order._id}>
              <td className="p-2 border">{order.customOrderId}</td>
              <td className="p-2 border">
                {order.user
                  ? `${order.user.name} (${order.user.email})`
                  : "Guest"}
              </td>
              <td className="p-2 border">${order.totalAmount}</td>
              <td className="p-2 border capitalize">{order.status}</td>
              <td className="p-2 border">{formatDate(order.createdAt)}</td>
              <td className="p-2 border">
                <Link
                  href={`/admin/orders/${order._id}`}
                  className="text-blue-600 mr-2"
                >
                  View
                </Link>
                {order.status !== "cancelled" && (
                  <button
                    onClick={() => onCancel(order._id)}
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
              <td className="p-2 border text-center" colSpan="6">
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
