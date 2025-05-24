"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import apiService from "@/lib/apiService";
import useAuthStore from "@/store/authStore";
import usePopupStore from "@/store/popupStore";

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
        const orders = await apiService.orders.getMine();
        setOrders(orders);
      } catch (err) {
        showError(err.message || "Failed to load orders.");
      }
    })();
  }, [hydrated, isLoggedIn, router, showError]);

  if (!hydrated) return null;

  if (orders.length === 0) {
    return <div className="p-6">No orders found.</div>;
  }

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
