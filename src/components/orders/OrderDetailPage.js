"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loader from "@/components/common/Loader";
import usePopupStore from "@/store/popupStore";
import InvoiceDownloadButton from "../invoice/InvoiceDownloadButton";
import EditOrderFormModal from "@/components/orders/EditOrderFormModal";
import { cancelOrder, cancelOrderAsGuest, getOrderByCustomId } from "@/lib/api";
import useAuthStore from "@/store/authStore";

export default function OrderDetailPage() {
  const { id } = useParams(); // customOrderId
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);

  const { showError, showSuccess } = usePopupStore();
  const auth = useAuthStore();

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

  async function handleCancelOrder() {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmed) return;

    try {
      if (auth?.isLoggedIn) {
        const updated = await cancelOrder(order.customOrderId);
        showSuccess("Order cancelled successfully");
        setOrder(updated);
      } else {
        const email = prompt("Please enter the email used during checkout:");
        if (!email || !email.trim())
          return showError("Email is required to cancel the order.");

        const updated = await cancelOrderAsGuest({
          customOrderId: order.customOrderId,
          email: email.trim(),
        });

        showSuccess("Order cancelled successfully");
        setOrder(updated);
      }
    } catch (err) {
      showError(err.message);
    }
  }

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
        <p>{order.address?.fullName}</p>
        <p>
          {order.address?.street}, {order.address?.city}
        </p>
        <p>
          {order.address?.country} - {order.address?.postalCode}
        </p>
        <p>📧 {order.address?.email}</p>
        <p>📞 {order.address?.phone}</p>
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

      <div className="mt-4 flex flex-col gap-3">
        <InvoiceDownloadButton order={order} />

        {order.canModify && (
          <>
            <button
              onClick={handleCancelOrder}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Cancel Order
            </button>

            <button
              onClick={() => setShowEditForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              ✏️ Edit Order Details
            </button>
          </>
        )}
      </div>

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
