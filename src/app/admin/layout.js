// app/admin/layout.jsx
"use client";

import { useState } from "react";
import AdminProtector from "@/components/admin/AdminProtector";
import ConfirmModal from "@/components/common/ConfirmModal";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AdminProtector>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar
          collapsed={collapsed}
          toggle={() => setCollapsed(!collapsed)}
        />
        <main
          className="flex-1 p-6 md:p-10 overflow-y-auto"
          /* subtle fade-in for every admin page */
        >
          {children}
          <ConfirmModal />
        </main>
      </div>
    </AdminProtector>
  );
}
