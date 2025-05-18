"use client";

import { generateInvoicePdf } from "./generateInvoicePdf";
import { useState } from "react";

export default function InvoiceDownloadButton({ order }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      await generateInvoicePdf(order);
    } catch (e) {
      alert("Failed to generate invoice. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
    >
      {loading ? "Generating…" : "📄 Download Invoice"}
    </button>
  );
}
