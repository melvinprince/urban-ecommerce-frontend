"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import adminApiService from "@/lib/adminApiService";
import usePopupStore from "@/store/popupStore";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    orders: 0,
    products: 0,
    categories: 0,
    coupons: 0,
    tickets: 0,
    users: 0,
  });

  const { showError } = usePopupStore();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          ordersRes,
          productsRes,
          categoriesRes,
          couponsRes,
          ticketsRes,
          usersRes,
        ] = await Promise.all([
          adminApiService.orders.getSummary(),
          adminApiService.products.getAll(),
          adminApiService.categories.getAll(),
          adminApiService.coupons.getAll(),
          adminApiService.tickets.getAll(),
          adminApiService.users.getAll(),
        ]);

        console.log("Admin Dashboard Stats:", {
          orders: ordersRes.data.length,
          products: productsRes.data.length,
          categories: categoriesRes.data.length,
          coupons: couponsRes.data.length,
          tickets: ticketsRes.data.length,
          users: usersRes.data.length,
        });

        setStats({
          orders: ordersRes.data.totalOrders,
          products: productsRes.data.length,
          categories: categoriesRes.data.length,
          coupons: couponsRes.data.length,
          tickets: ticketsRes.data.length,
          users: usersRes.data.length,
        });
      } catch (err) {
        showError(err.message);
      }
    };

    fetchStats();
  }, [showError]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SummaryCard label="Orders" count={stats.orders} href="/admin/orders" />
        <SummaryCard
          label="Products"
          count={stats.products}
          href="/admin/products"
        />
        <SummaryCard
          label="Categories"
          count={stats.categories}
          href="/admin/categories"
        />
        <SummaryCard
          label="Coupons"
          count={stats.coupons}
          href="/admin/coupons"
        />
        <SummaryCard
          label="Tickets"
          count={stats.tickets}
          href="/admin/tickets"
        />
        <SummaryCard label="Users" count={stats.users} href="/admin/users" />
      </div>
    </div>
  );
}

function SummaryCard({ label, count, href }) {
  return (
    <Link href={href}>
      <div className="p-4 border rounded hover:bg-gray-100 cursor-pointer">
        <h2 className="text-xl font-semibold">{label}</h2>
        <p className="text-2xl">{count}</p>
      </div>
    </Link>
  );
}
