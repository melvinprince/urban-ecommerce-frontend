// app/admin/page.jsx  (route for /admin)
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Package, Boxes, Layers3, Tag, Ticket, Users } from "lucide-react";
import adminApiService from "@/lib/adminApiService";
import usePopupStore from "@/store/popupStore";

const CARDS = [
  {
    key: "orders",
    label: "Orders",
    icon: Package,
    color: "from-indigo-500 to-purple-500",
    href: "/admin/orders",
  },
  {
    key: "products",
    label: "Products",
    icon: Boxes,
    color: "from-blue-500 to-cyan-500",
    href: "/admin/products",
  },
  {
    key: "categories",
    label: "Categories",
    icon: Layers3,
    color: "from-emerald-500 to-teal-500",
    href: "/admin/categories",
  },
  {
    key: "coupons",
    label: "Coupons",
    icon: Tag,
    color: "from-yellow-500 to-amber-500",
    href: "/admin/coupons",
  },
  {
    key: "tickets",
    label: "Tickets",
    icon: Ticket,
    color: "from-pink-500 to-rose-500",
    href: "/admin/tickets",
  },
  {
    key: "users",
    label: "Users",
    icon: Users,
    color: "from-gray-500 to-slate-500",
    href: "/admin/users",
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(() =>
    Object.fromEntries(CARDS.map((c) => [c.key, 0]))
  );
  const { showError } = usePopupStore();

  useEffect(() => {
    (async () => {
      try {
        const [o, p, c, cp, t, u] = await Promise.all([
          adminApiService.orders.getSummary(),
          adminApiService.products.getAll(),
          adminApiService.categories.getAll(),
          adminApiService.coupons.getAll(),
          adminApiService.tickets.getAll(),
          adminApiService.users.getAll(),
        ]);
        setStats({
          orders: o.data.totalOrders,
          products: p.data.length,
          categories: c.data.length,
          coupons: cp.data.length,
          tickets: t.data.length,
          users: u.data.length,
        });
      } catch (err) {
        showError(err.message);
      }
    })();
  }, [showError]);

  return (
    <>
      <h1 className="text-3xl font-eulogy mb-10 text-gray-800">Dashboard</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((c, i) => (
          <Link key={c.key} href={c.href}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className={`relative overflow-hidden rounded-3xl p-6 cursor-pointer shadow-lg
                         bg-gradient-to-br ${c.color}`}
            >
              <c.icon className="h-10 w-10 text-white/80" />

              <div className="mt-6">
                <p className="text-white/80 text-lg">{c.label}</p>
                <p className="text-4xl font-bold text-white">{stats[c.key]}</p>
              </div>

              {/* decorative blob */}
              <span
                className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-white/10"
                aria-hidden
              />
            </motion.div>
          </Link>
        ))}
      </div>
    </>
  );
}
