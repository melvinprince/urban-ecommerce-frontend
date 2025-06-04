// File: components/support/TicketReplyForm.jsx
"use client";

import { useState } from "react";
import Loader from "@/components/common/Loader";

export default function TicketReplyForm({ onSubmit }) {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

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
      if (!allowedTypes.includes(file.type)) return false;
      if (file.size > 20 * 1024 * 1024) return false;
      return true;
    });
    setFiles(valid.slice(0, 3));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("message", message);
    files.forEach((file) => formData.append("files", file));

    await onSubmit(formData);

    setMessage("");
    setFiles([]);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        required
        placeholder="Write your reply..."
        className="w-full border border-gray-300 rounded-2xl p-4 text-lg focus:outline-none focus:ring-2 focus:ring-sgr resize-none"
      />
      <input
        type="file"
        multiple
        accept="image/*,.pdf,video/mp4"
        onChange={handleFileChange}
        className="block bg-gray-200 p-4 rounded-full cursor-pointer w-full text-sm"
      />
      {files.length > 0 && (
        <ul className="mt-2 text-sm  text-gray-600 space-y-1">
          {files.map((f, idx) => (
            <li key={idx}>{f.name}</li>
          ))}
        </ul>
      )}
      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 bg-ogr hover:bg-ogr/90 text-white px-6 py-3 rounded-full text-xl transition disabled:opacity-50 cursor-pointer"
      >
        {loading ? <Loader /> : "Send Reply"}
      </button>
    </form>
  );
}
