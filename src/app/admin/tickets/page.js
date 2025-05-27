"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Support Tickets</h1>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Subject</th>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket._id}>
                <td className="p-2 border">{ticket._id}</td>
                <td className="p-2 border">{ticket.subject}</td>
                <td className="p-2 border">{ticket.user?.name || "N/A"}</td>
                <td className="p-2 border">{ticket.status}</td>
                <td className="p-2 border">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2 border">
                  <Link
                    href={`/admin/tickets/${ticket._id}`}
                    className="text-blue-600"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr>
                <td className="p-2 border text-center" colSpan="6">
                  No tickets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
