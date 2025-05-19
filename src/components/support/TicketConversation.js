"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { getTicketById, replyToTicket } from "@/lib/api";
import usePopupStore from "@/store/popupStore";
import TicketMessageThread from "@/components/support/TicketMessageThread";
import TicketReplyForm from "@/components/support/TicketReplyForm";

export default function TicketConversation() {
  const params = useSearchParams();
  const ticketId = params.get("id");
  const { showError, showSuccess } = usePopupStore();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const threadRef = useRef(null);

  useEffect(() => {
    async function fetch() {
      try {
        const res = await getTicketById(ticketId);
        setTicket(res);
      } catch (err) {
        showError("Failed to fetch ticket");
      } finally {
        setLoading(false);
      }
    }
    if (ticketId) fetch();
  }, [ticketId, showError]);

  const handleReply = async (formData) => {
    try {
      const updated = await replyToTicket(ticketId, formData);
      showSuccess("Reply sent");
      setTicket(updated);

      // Auto scroll to bottom
      setTimeout(() => {
        threadRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      showError(err.message);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading ticket…</div>;
  if (!ticket)
    return (
      <div className="p-6 text-center text-red-500">Ticket not found.</div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">🎟️ {ticket.subject}</h1>
      <div className="text-sm text-gray-600">
        Status: <span className="font-semibold">{ticket.status}</span>{" "}
        {ticket.orderRef && <>• Order ID: #{ticket.orderRef}</>}
      </div>

      <TicketMessageThread messages={ticket.messages} ref={threadRef} />

      {ticket.status !== "closed" && <TicketReplyForm onSubmit={handleReply} />}
    </div>
  );
}
