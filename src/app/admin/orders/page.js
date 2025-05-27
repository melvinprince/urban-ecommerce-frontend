"use client";

import { useState, useEffect } from "react";
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
      setOrders(res.data.orders); // ✅ Fix here
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
  }, []);

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
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
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
  );
}
