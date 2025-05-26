"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import adminApiService from "@/lib/adminApiService";
import usePopupStore from "@/store/popupStore";

export default function AdminOrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const { showError, showSuccess } = usePopupStore();
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await adminApiService.orders.getById(id);
        setOrder(res.data);
        setStatus(res.data.status);
        setIsPaid(res.data.isPaid);
      } catch (err) {
        showError(err.message);
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

  if (!order) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Order Details</h1>
      <p>
        <strong>Order ID:</strong> {order.customOrderId}
      </p>
      <p>
        <strong>User:</strong>{" "}
        {order.user ? `${order.user.name} (${order.user.email})` : "Guest"}
      </p>
      <p>
        <strong>Status:</strong> {order.status}
      </p>
      <p>
        <strong>Paid:</strong> {order.isPaid ? "Yes" : "No"}
      </p>
      <p>
        <strong>Total:</strong> ${order.totalAmount}
      </p>

      <h2 className="text-xl font-semibold mt-4">Items:</h2>
      <ul className="list-disc ml-6">
        {order.items.map((item, idx) => (
          <li key={idx}>
            {item.product?.title || "Product Deleted"} - {item.quantity} x $
            {item.price}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mt-4">Shipping Address:</h2>
      <p>{order.address.fullName}</p>
      <p>{order.address.email}</p>
      <p>{order.address.phone}</p>
      <p>
        {order.address.street}, {order.address.city}, {order.address.country}
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label className="block font-semibold mb-1">Update Status:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 w-full max-w-xs"
          >
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={handleUpdate}
            className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
          >
            Update Status
          </button>
        </div>

        <div>
          <button
            onClick={handlePaymentUpdate}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Mark as {isPaid ? "Unpaid" : "Paid"}
          </button>
        </div>
      </div>
    </div>
  );
}
