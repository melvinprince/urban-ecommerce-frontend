// File: app/admin/tickets/[id]/page.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
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
  const messagesEndRef = useRef(null);

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
        scrollToBottom();
      }
    };
    fetchTicket();
  }, [id, showError]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [ticket]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return showError("Message is required");
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("message", replyMessage);
      for (const file of replyFiles) {
        formData.append("files", file);
      }
      await adminApiService.tickets.reply(id, formData);
      showSuccess("Reply sent");
      setReplyMessage("");
      setReplyFiles([]);
      const res = await adminApiService.tickets.getById(id);
      setTicket(res.data);
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  if (loading || !ticket) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-sgr/50">
        <Loader />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-sgr/50 min-h-screen py-12 px-6 md:px-20 flex items-center justify-center"
    >
      <div className="mx-auto bg-white rounded-3xl shadow-lg w-full flex flex-col h-[80vh]">
        <div className="p-8 border-b">
          <h1 className="text-5xl  text-gray-800">Ticket: {ticket.subject}</h1>
          <p className="mt-2 text-2xl text-gray-600">
            <span className="font-semibold">User:</span>{" "}
            {ticket.user?.name || "N/A"} ({ticket.user?.email || "N/A"})
          </p>
          <p className="mt-1 text-2xl text-gray-600">
            <span className="font-semibold">Order Ref:</span>{" "}
            {ticket.orderRef || "N/A"}
          </p>
          <p className="mt-1 text-2xl text-gray-600">
            <span className="font-semibold">Status:</span> {ticket.status}
          </p>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {ticket.messages.map((msg, idx) => {
            const isAdmin = msg.sender === "admin";
            return (
              <div
                key={idx}
                className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] p-4 rounded-xl ${
                    isAdmin
                      ? "bg-sgr text-white self-end"
                      : "bg-gray-100 text-gray-800 self-start"
                  }`}
                >
                  <p className="text-2xl">{msg.text}</p>
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-2 space-y-1 text-lg bg-white p-4 rounded-full">
                      {msg.attachments.map((file, i) => (
                        <a
                          key={i}
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-blue-600 underline"
                        >
                          {file.url.split("/").pop()}
                        </a>
                      ))}
                    </div>
                  )}
                  <p className="mt-2 text-xs text-gray-500 text-right">
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply Form */}
        <div className="border-t p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Reply</h2>
          <form onSubmit={handleReply} className="space-y-4">
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your message..."
              rows={3}
              className="w-full border border-gray-300 rounded-2xl p-4 text-xl focus:outline-none focus:ring-2 focus:ring-sgr resize-none"
            />
            <input
              type="file"
              multiple
              onChange={(e) => setReplyFiles(Array.from(e.target.files))}
              className="block w-full bg-white border border-gray-300 rounded-2xl p-4 text-lg file:cursor-pointer file:rounded-full file:border-0 file:bg-sgr file:text-white file:px-4 file:py-2 hover:file:bg-ogr transition"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-sgr hover:bg-ogr text-white px-6 py-3 rounded-full text-xl transition"
            >
              Send Reply
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
