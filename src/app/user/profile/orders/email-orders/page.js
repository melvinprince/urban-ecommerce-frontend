"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getOrdersByEmail } from "@/lib/api";
import Link from "next/link";
import Loader from "@/components/common/Loader";
import usePopupStore from "@/store/popupStore";

export default function EmailOrdersPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = usePopupStore();

  useEffect(() => {
    if (!email) return;

    async function fetchOrders() {
      try {
        const data = await getOrdersByEmail(email);
        setOrders(data);
      } catch (err) {
        showError(err.message || "Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [email, showError]);

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Orders for {email}</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-sm">No orders found for this email.</p>
      ) : (
        orders.map((order) => (
          <Link
            key={order._id}
            href={`/user/profile/orders/${order.customOrderId}`}
          >
            <div className="p-4 border rounded shadow hover:bg-gray-50">
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
                QAR {order.totalAmount} • {order.paymentMethod.toUpperCase()} •{" "}
                {order.isPaid ? "Paid" : "Not Paid"}
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
