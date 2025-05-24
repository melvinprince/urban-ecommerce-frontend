"use client";

import { useEffect, useState } from "react";
import apiService from "@/lib/apiService"; // Updated import
import usePopupStore from "@/store/popupStore";
import { useRouter } from "next/navigation";

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = usePopupStore();
  const router = useRouter();

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await apiService.tickets.getMine(); // Updated
        setTickets(res);
      } catch (err) {
        showError(err.message || "Failed to load tickets");
      } finally {
        setLoading(false);
      }
    }

    fetchTickets();
  }, [showError]);

  if (loading) return <p className="p-6 text-center">Loading tickets…</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📁 My Support Tickets</h1>
        <button
          onClick={() => router.push("/user/tickets/new-ticket")}
          className="bg-ogr text-white px-4 py-2 rounded"
        >
          ➕ New Ticket
        </button>
      </div>

      {tickets.length === 0 ? (
        <p className="text-gray-600">No tickets submitted yet.</p>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="border p-4 rounded cursor-pointer hover:border-blue-500"
              onClick={() =>
                router.push(`/user/tickets/view-ticket?id=${ticket._id}`)
              }
            >
              <div className="flex justify-between">
                <div>
                  <h2 className="font-semibold">{ticket.subject}</h2>
                  <p className="text-sm text-gray-500">
                    #{ticket._id.slice(-6)} •{" "}
                    {new Date(ticket.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`text-sm px-2 py-1 rounded ${
                    ticket.status === "closed"
                      ? "bg-red-100 text-red-700"
                      : ticket.status === "answered"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {ticket.status}
                </span>
              </div>
              {ticket.orderRef && (
                <p className="text-sm mt-1 text-gray-600">
                  Related to Order: <strong>{ticket.orderRef}</strong>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
