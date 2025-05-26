"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/categories", label: "Categories" },
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/coupons", label: "Coupons" },
    { href: "/admin/tickets", label: "Tickets" },
    { href: "/admin/users", label: "Users" },
  ];

  return (
    <aside className="w-64 h-screen border-r p-4">
      <nav className="space-y-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block text-lg font-semibold ${
              pathname.startsWith(link.href) ? "text-blue-600" : "text-gray-700"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
