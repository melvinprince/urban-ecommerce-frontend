"use client";

import { useEffect, useState } from "react";
import adminApiService from "@/lib/adminApiService";
import usePopupStore from "@/store/popupStore";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const { showError, showSuccess } = usePopupStore();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await adminApiService.users.getAll();
        setUsers(res.data);
      } catch (err) {
        showError(err.message);
      }
    };
    fetchUsers();
  }, [showError]);

  const handleRoleToggle = async (user) => {
    const newRole = user.role === "adm" ? "usr" : "adm";
    if (!confirm(`Change role of ${user.name} to ${newRole}?`)) return;
    try {
      await adminApiService.users.update(user._id, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, role: newRole } : u))
      );
      showSuccess(`Role updated to ${newRole}`);
    } catch (err) {
      showError(err.message);
    }
  };

  const handleBanToggle = async (user) => {
    const action = user.banned ? "unban" : "ban";
    if (!confirm(`Are you sure you want to ${action} ${user.name}?`)) return;
    try {
      await adminApiService.users.update(user._id, { banned: !user.banned });
      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, banned: !user.banned } : u
        )
      );
      showSuccess(`User ${action}ned`);
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.role}</td>
                <td className="p-2 border">
                  {user.banned ? "Banned" : "Active"}
                </td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => handleRoleToggle(user)}
                    className="text-blue-600"
                  >
                    {user.role === "adm" ? "Demote" : "Promote"}
                  </button>
                  <button
                    onClick={() => handleBanToggle(user)}
                    className="text-red-600"
                  >
                    {user.banned ? "Unban" : "Ban"}
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td className="p-2 border text-center" colSpan="5">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
