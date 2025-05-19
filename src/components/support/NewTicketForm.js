"use client";

import { useEffect, useState } from "react";
import { getMyOrders, createTicket } from "@/lib/api";
import usePopupStore from "@/store/popupStore";
import { useRouter } from "next/navigation";

export default function NewTicketForm() {
  const [subject, setSubject] = useState("");
  const [orderRef, setOrderRef] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const { showSuccess, showError } = usePopupStore();
  const router = useRouter();

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await getMyOrders();
        setOrders(data || []);
      } catch (err) {
        console.error("Failed to load orders", err);
      }
    }
    fetchOrders();
  }, []);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
      "video/mp4",
    ];
    const valid = selected.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        showError(`File type not allowed: ${file.name}`);
        return false;
      }
      if (file.size > 20 * 1024 * 1024) {
        showError(`File too large (max 20MB): ${file.name}`);
        return false;
      }
      return true;
    });
    if (valid.length > 3) {
      showError("Maximum 3 files allowed");
      return;
    }
    setFiles(valid);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!subject.trim() || !message.trim()) {
      showError("Subject and message are required.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("subject", subject);
      formData.append("message", message);
      if (orderRef) formData.append("orderRef", orderRef);
      files.forEach((file) => formData.append("files", file));

      await createTicket(formData);
      showSuccess("Support ticket created.");
      router.push("/user/tickets");
    } catch (err) {
      showError(err.message || "Failed to create ticket.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold">📝 Submit a Support Ticket</h1>

      <div>
        <label className="block font-medium mb-1">Subject</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1">
          Related Order (Optional)
        </label>
        <select
          value={orderRef}
          onChange={(e) => setOrderRef(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">-- Select Order ID --</option>
          {orders.map((order) => (
            <option key={order._id} value={order.customOrderId}>
              #{order.customOrderId}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1">
          Attach Files (Image, PDF, or Video) — Max 3 files / 20MB each
        </label>
        <input
          type="file"
          multiple
          accept="image/*,.pdf,video/mp4"
          onChange={handleFileChange}
          className="block w-full text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-ogr text-white px-4 py-2 rounded"
      >
        {loading ? "Submitting…" : "Submit Ticket"}
      </button>
    </form>
  );
}
