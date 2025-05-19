"use client";

import { useState } from "react";

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        required
        placeholder="Write your reply..."
        className="w-full border p-2 rounded"
      />
      <input
        type="file"
        multiple
        accept="image/*,.pdf,video/mp4"
        onChange={handleFileChange}
        className="block"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-ogr text-white px-4 py-2 rounded"
      >
        {loading ? "Sending…" : "Send Reply"}
      </button>
    </form>
  );
}
