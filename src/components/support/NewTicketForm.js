// File: app/user/tickets/new-ticket/page.jsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import apiService from "@/lib/apiService";
import usePopupStore from "@/store/popupStore";
import { useRouter } from "next/navigation";
import Loader from "@/components/common/Loader";

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
        const data = await apiService.orders.getMine();
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
    const valid = [];
    for (const file of selected) {
      if (!allowedTypes.includes(file.type)) {
        showError(`File type not allowed: ${file.name}`);
        continue;
      }
      if (file.size > 20 * 1024 * 1024) {
        showError(`File too large (max 20MB): ${file.name}`);
        continue;
      }
      valid.push(file);
    }
    if (valid.length > 3) {
      showError("Maximum 3 files allowed");
      return;
    }
    setFiles(valid);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      showError("Subject and message are required.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("subject", subject);
      formData.append("message", message);
      if (orderRef) formData.append("orderRef", orderRef);
      files.forEach((file) => formData.append("files", file));

      await apiService.tickets.create(formData);
      showSuccess("Support ticket created.");
      router.push("/user/tickets");
    } catch (err) {
      showError(err.message || "Failed to create ticket.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-sgr/50 min-h-[60vh] py-12 px-6 md:px-20 flex items-center justify-center"
    >
      <div className="mx-auto bg-white rounded-3xl shadow-lg w-[50%] p-8">
        <h1 className="text-5xl font-eulogy mb-6 text-gray-800">
          📝 Submit a Support Ticket
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Subject */}
          <div>
            <label
              htmlFor="subject"
              className="block text-xl font-medium text-gray-700 mb-2"
            >
              Subject
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-gray-300 rounded-2xl p-4 text-lg focus:outline-none focus:ring-2 focus:ring-sgr"
              placeholder="Brief summary of your issue"
              required
            />
          </div>

          {/* Related Order */}
          <div>
            <label
              htmlFor="orderRef"
              className="block text-xl font-medium text-gray-700 mb-2"
            >
              Related Order (Optional)
            </label>
            <select
              id="orderRef"
              value={orderRef}
              onChange={(e) => setOrderRef(e.target.value)}
              className="w-full border border-gray-300 rounded-2xl p-4 text-lg bg-white focus:outline-none focus:ring-2 focus:ring-sgr"
            >
              <option value="">— Select Order ID —</option>
              {orders.map((order) => (
                <option key={order._id} value={order.customOrderId}>
                  #{order.customOrderId}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-xl font-medium text-gray-700 mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full border border-gray-300 rounded-2xl p-4 text-lg focus:outline-none focus:ring-2 focus:ring-sgr resize-none"
              placeholder="Describe your issue in detail..."
              required
            />
          </div>

          {/* Attach Files */}
          <div>
            <label className="block text-xl font-medium text-gray-700 mb-2">
              Attach Files (Images, PDF, or Video) — Max 3 files / 20MB each
            </label>
            <input
              type="file"
              multiple
              accept="image/*,.pdf,video/mp4"
              onChange={handleFileChange}
              className="block w-full bg-white border border-gray-300 rounded-2xl p-4 text-lg focus:outline-none focus:ring-2 focus:ring-sgr file:cursor-pointer file:rounded-full file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
            {files.length > 0 && (
              <ul className="mt-2 text-sm text-gray-600 space-y-1">
                {files.map((f, idx) => (
                  <li key={idx}>{f.name}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-ogr hover:bg-ogr/90 text-white px-6 py-3 rounded-full text-xl transition disabled:opacity-50"
            >
              {loading ? <Loader /> : "Submit Ticket"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
