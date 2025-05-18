"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getOrderByCustomId } from "@/lib/api";
import Loader from "@/components/common/Loader";
import usePopupStore from "@/store/popupStore";

export default function OrderDetailPage() {
  const { id } = useParams(); // customOrderId
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showError } = usePopupStore();

  useEffect(() => {
    async function fetchOrder() {
      try {
        const data = await getOrderByCustomId(id);
        setOrder(data);
      } catch (err) {
        showError(err.message || "Failed to fetch order");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchOrder();
  }, [id, showError]);

  if (loading) return <Loader />;
  if (!order)
    return (
      <div className="p-6 text-center text-gray-600">Order not found.</div>
    );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>
      <div className="mb-4">
        <p>
          <strong>Order ID:</strong> {order.customOrderId}
        </p>
        <p>
          <strong>Placed on:</strong>{" "}
          {new Date(order.createdAt).toLocaleString()}
        </p>
        <p>
          <strong>Status:</strong> {order.isPaid ? "Paid" : "Not Paid"} (
          {order.paymentMethod})
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
        <p>{order.address.fullName}</p>
        <p>
          {order.address.street}, {order.address.city}
        </p>
        <p>
          {order.address.country} - {order.address.postalCode}
        </p>
        <p>📞 {order.address.phone}</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Items</h2>
        <ul className="divide-y divide-gray-200">
          {order.items.map((item, i) => (
            <li key={i} className="py-2">
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">{item.product?.title}</div>
                  <div className="text-sm text-gray-500">
                    {item.size && `Size: ${item.size}`}{" "}
                    {item.color && `Color: ${item.color}`}
                  </div>
                </div>
                <div className="text-sm text-gray-700">
                  QAR {item.price} × {item.quantity}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 text-right font-semibold">
        Total: QAR {order.totalAmount}
      </div>
    </div>
  );
}
