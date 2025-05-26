import AdminProtector from "@/components/admin/AdminProtector";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <AdminProtector>
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </AdminProtector>
  );
}
