// File: app/admin/tickets/page.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import adminApiService from "@/lib/adminApiService";
import usePopupStore from "@/store/popupStore";
import Loader from "@/components/common/Loader";

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showError } = usePopupStore();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const res = await adminApiService.tickets.getAll();
        setTickets(res.data);
      } catch (err) {
        showError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [showError]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-sgr/50 min-h-screen py-12 px-6 md:px-20"
    >
      <div className="mx-auto bg-white rounded-3xl shadow-lg p-8 w-[70%]">
        <h1 className="text-5xl font-eulogy mb-8 text-gray-800">
          Support Tickets
        </h1>

        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Loader />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4 border text-left text-2xl">ID</th>
                  <th className="p-4 border text-left text-2xl">Subject</th>
                  <th className="p-4 border text-left text-2xl">User</th>
                  <th className="p-4 border text-left text-2xl">Status</th>
                  <th className="p-4 border text-left text-2xl">Date</th>
                  <th className="p-4 border text-left text-2xl">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket._id} className="hover:bg-gray-50">
                    <td className="p-4 border text-2xl">{ticket._id}</td>
                    <td className="p-4 border text-2xl">{ticket.subject}</td>
                    <td className="p-4 border text-2xl">
                      {ticket.user?.name || "N/A"}
                    </td>
                    <td className="p-4 border text-2xl">{ticket.status}</td>
                    <td className="p-4 border text-2xl">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 border">
                      <Link
                        href={`/admin/tickets/${ticket._id}`}
                        className="text-blue-600 text-2xl hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
                {tickets.length === 0 && (
                  <tr>
                    <td className="p-4 border text-center text-2xl" colSpan="6">
                      No tickets found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
