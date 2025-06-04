// components/admin/AdminSidebar.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Layers3,
  PackageCheck,
  Tag,
  Ticket,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ICON = {
  Dashboard: LayoutDashboard,
  Products: Package,
  Categories: Layers3,
  Orders: PackageCheck,
  Coupons: Tag,
  Tickets: Ticket,
  Users: Users,
};

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/tickets", label: "Tickets" },
  { href: "/admin/users", label: "Users" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="sticky top-0 h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800
                 text-white flex flex-col shadow-lg z-30"
    >
      <div className="flex items-center gap-3 h-16 px-4">
        <div className="h-7 w-7 rounded-lg bg-sgr" />
        <span
          className="origin-left text-lg font-bold tracking-wide transition-opacity"
          style={{ opacity: collapsed ? 0 : 1 }}
        >
          Urban&nbsp;Admin
        </span>
      </div>

      <nav className="flex-1 px-2 space-y-1 mt-4">
        {NAV.map(({ href, label }) => {
          const Icon = ICON[label];
          const active =
            href === "/admin"
              ? pathname === "/admin"
              : pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 px-3 py-2 rounded-lg transition
                    ${active ? "bg-sgr text-black" : "hover:bg-white/10"}`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span
                className="origin-left transition-opacity text-2xl"
                style={{ opacity: collapsed ? 0 : 1 }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-2">
        <button
          onClick={() => setCollapsed((s) => !s)}
          className="flex items-center justify-center w-full h-10
                     bg-white/10 hover:bg-white/20 rounded-lg"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </motion.aside>
  );
}
