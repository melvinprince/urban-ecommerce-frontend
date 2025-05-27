"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import adminApiService from "@/lib/adminApiService";
import usePopupStore from "@/store/popupStore";
import Loader from "@/components/common/Loader";

export default function AdminTicketDetailsPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyFiles, setReplyFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showError, showSuccess } = usePopupStore();
  const router = useRouter();

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const res = await adminApiService.tickets.getById(id);
        setTicket(res.data);
      } catch (err) {
        showError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id, showError]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return showError("Message is required");
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("message", replyMessage);
      for (const file of replyFiles) {
        formData.append("files", file); // ✅ Corrected key
      }
      await adminApiService.tickets.reply(id, formData);
      showSuccess("Reply sent");
      setReplyMessage("");
      setReplyFiles([]);
      router.refresh();
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !ticket) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Ticket: {ticket.subject}</h1>
      <p>
        <strong>User:</strong> {ticket.user?.name} ({ticket.user?.email})
      </p>
      <p>
        <strong>Order Ref:</strong> {ticket.orderRef || "N/A"}
      </p>
      <p>
        <strong>Status:</strong> {ticket.status}
      </p>

      <h2 className="text-xl font-semibold mt-6">Messages</h2>
      <div className="border p-4 space-y-4 mt-2">
        {ticket.messages.map((msg, idx) => (
          <div key={idx} className="border p-2 rounded">
            <p>
              <strong>{msg.sender === "admin" ? "Admin" : "User"}</strong>
            </p>
            <p>{msg.text}</p>
            {msg.attachments && msg.attachments.length > 0 && (
              <div className="mt-2 space-y-1 text-sm">
                {msg.attachments.map((file, i) => (
                  <a
                    key={i}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {file.url.split("/").pop()}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-6">Reply</h2>
      <form onSubmit={handleReply} className="space-y-4 mt-2">
        <textarea
          value={replyMessage}
          onChange={(e) => setReplyMessage(e.target.value)}
          placeholder="Your message"
          className="border p-2 w-full"
        />
        <input
          type="file"
          multiple
          onChange={(e) => setReplyFiles(e.target.files)}
          className="border p-2 w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send Reply
        </button>
      </form>
    </div>
  );
}
