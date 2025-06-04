// File: app/user/tickets/view-ticket/page.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import apiService from "@/lib/apiService";
import usePopupStore from "@/store/popupStore";
import TicketMessageThread from "@/components/support/TicketMessageThread";
import TicketReplyForm from "@/components/support/TicketReplyForm";
import Loader from "@/components/common/Loader";

export default function TicketConversation() {
  const params = useSearchParams();
  const ticketId = params.get("id");
  const { showError, showSuccess } = usePopupStore();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const threadRef = useRef(null);

  useEffect(() => {
    async function fetchTicket() {
      try {
        setLoading(true);
        const res = await apiService.tickets.getById(ticketId);
        setTicket(res);
      } catch (err) {
        showError("Failed to fetch ticket");
      } finally {
        setLoading(false);
        scrollToBottom();
      }
    }
    if (ticketId) fetchTicket();
  }, [ticketId, showError]);

  const scrollToBottom = () => {
    threadRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [ticket]);

  const handleReply = async (formData) => {
    try {
      setLoading(true);
      const updated = await apiService.tickets.reply(ticketId, formData);
      showSuccess("Reply sent");
      setTicket(updated);
    } catch (err) {
      showError(err.message || "Failed to send reply");
    } finally {
      setLoading(false);
      setTimeout(() => scrollToBottom(), 100);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-sgr/50">
        <Loader />
      </div>
    );
  }
  if (!ticket) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-sgr/50">
        <p className="text-2xl text-gray-700">Ticket not found.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-sgr/50 min-h-screen py-12 px-6 md:px-20"
    >
      <div className="mx-auto bg-white rounded-3xl shadow-lg max-w-3xl flex flex-col h-[80vh]">
        <div className="p-6 border-b">
          <h1 className="text-5xl font-eulogy text-gray-800">
            {ticket.subject}
          </h1>
          <p className="mt-2 text-xl text-gray-600">
            Status: <span className="font-semibold">{ticket.status}</span>
            {ticket.orderRef && (
              <span className="ml-4">
                • Order ID:{" "}
                <span className="font-medium text-2xl">{ticket.orderRef}</span>
              </span>
            )}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          <TicketMessageThread messages={ticket.messages} ref={threadRef} />
        </div>

        {ticket.status !== "closed" && (
          <div className="border-t p-6">
            <TicketReplyForm onSubmit={handleReply} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
