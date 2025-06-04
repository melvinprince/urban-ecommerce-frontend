"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import adminApiService from "@/lib/adminApiService";
import usePopupStore from "@/store/popupStore";
import OrdersTable from "@/components/admin/orders/OrdersTable";
import Loader from "@/components/common/Loader";
import OrdersFilter from "@/components/admin/orders/OrdersFilter";
import SummaryCards from "@/components/admin/orders/SummaryCards";
import Pagination from "@/components/admin/orders/Pagination";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({
    email: "",
    status: "",
    isPaid: "",
  });
  const [pagination, setPagination] = useState({
    totalOrders: 0,
    totalPages: 1,
    currentPage: 1,
  });
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const { showError, showSuccess } = usePopupStore();

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        ...filters,
      };
      const res = await adminApiService.orders.getAll(params);
      setOrders(res.data.orders);
      setPagination(res.data.pagination);
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await adminApiService.orders.getSummary();
        setSummary(res.data);
      } catch (err) {
        showError(err.message);
      }
    };
    fetchSummary();
  }, [showError]);

  useEffect(() => {
    fetchOrders(1);
  }, [filters]);

  const handleCancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      await adminApiService.orders.cancel(id);
      fetchOrders(pagination.currentPage);
      showSuccess("Order cancelled");
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-sgr/50 min-h-screen py-12 px-6 md:px-20"
    >
      <div className="mx-auto bg-white rounded-3xl shadow-lg p-8">
        <h1 className="text-5xl font-eulogy mb-8 text-gray-800">Orders</h1>

        {summary && <SummaryCards data={summary} />}

        <OrdersFilter filters={filters} setFilters={setFilters} />

        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Loader />
          </div>
        ) : (
          <>
            <OrdersTable orders={orders} onCancel={handleCancel} />
            <Pagination
              pagination={pagination}
              onPageChange={(page) => fetchOrders(page)}
            />
          </>
        )}
      </div>
    </motion.div>
  );
}
