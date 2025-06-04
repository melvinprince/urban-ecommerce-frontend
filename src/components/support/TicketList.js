// File: app/user/tickets/page.jsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import apiService from "@/lib/apiService";
import usePopupStore from "@/store/popupStore";
import { useRouter } from "next/navigation";
import Loader from "@/components/common/Loader";

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = usePopupStore();
  const router = useRouter();

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await apiService.tickets.getMine();
        setTickets(res);
      } catch (err) {
        showError(err.message || "Failed to load tickets");
      } finally {
        setLoading(false);
      }
    }

    fetchTickets();
  }, [showError]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-sgr/50 min-h-[60vh] py-12 px-6 md:px-20"
    >
      <div className="mx-auto bg-white rounded-3xl shadow-lg max-w-4xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-eulogy text-gray-800">
            My Support Tickets
          </h1>
          <button
            onClick={() => router.push("/user/tickets/new-ticket")}
            className="inline-flex items-center gap-2 bg-ogr hover:bg-indigo-700 text-white px-5 py-3 rounded-full text-xl transition"
          >
            ➕ New Ticket
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Loader />
          </div>
        ) : tickets.length === 0 ? (
          <p className="text-center text-lg text-gray-600">
            No tickets submitted yet.
          </p>
        ) : (
          <div className="space-y-6">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="border border-gray-200 rounded-2xl shadow-sm p-6 cursor-pointer hover:shadow-md transition"
                onClick={() =>
                  router.push(`/user/tickets/view-ticket?id=${ticket._id}`)
                }
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-medium text-gray-800">
                      {ticket.subject}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      #{ticket._id.slice(-6)} •{" "}
                      {new Date(ticket.createdAt).toLocaleString()}
                    </p>
                    {ticket.orderRef && (
                      <p className="text-sm text-gray-600 mt-1">
                        Related to Order:{" "}
                        <span className="font-medium">{ticket.orderRef}</span>
                      </p>
                    )}
                  </div>
                  <span
                    className={`text-sm px-3 py-1 rounded-full ${
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
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
