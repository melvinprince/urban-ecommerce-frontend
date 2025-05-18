"use client";

import { useEffect, useState } from "react";
import { getMyOrders } from "@/lib/api";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const orders = await getMyOrders();
        setOrders(orders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) return <div className="p-6">Loading orders...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (orders.length === 0) return <div className="p-6">No orders found.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order._id}
            href={`/user/profile/orders/${order.customOrderId}`}
          >
            <div className="p-4 border rounded shadow hover:bg-gray-50 cursor-pointer">
              <div className="flex justify-between">
                <div>
                  <div className="text-sm text-gray-500">Order ID</div>
                  <div className="font-medium">{order.customOrderId}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Date</div>
                  <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Total: QAR {order.totalAmount} •{" "}
                {order.paymentMethod.toUpperCase()} •{" "}
                {order.isPaid ? "Paid" : "Not Paid"}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
