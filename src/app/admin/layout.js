import AdminProtector from "@/components/admin/AdminProtector";

export default function AdminLayout({ children }) {
  return (
    <div>
      <AdminProtector>{children}</AdminProtector>
    </div>
  );
}
