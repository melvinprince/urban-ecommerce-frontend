// File: app/admin/users/page.jsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import adminApiService from "@/lib/adminApiService";
import usePopupStore from "@/store/popupStore";
import useConfirmStore from "@/store/useConfirmStore";
import Loader from "@/components/common/Loader";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState("all"); // "all", "adm", "usr"
  const { showError, showSuccess } = usePopupStore();
  const { openConfirm } = useConfirmStore();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await adminApiService.users.getAll();
        setUsers(res.data);
      } catch (err) {
        showError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [showError]);

  const handleRoleToggle = (user) => {
    const newRole = user.role === "adm" ? "usr" : "adm";
    openConfirm({
      message: `Change role of ${user.name} to ${newRole}?`,
      onConfirm: async () => {
        try {
          await adminApiService.users.update(user._id, { role: newRole });
          setUsers((prev) =>
            prev.map((u) => (u._id === user._id ? { ...u, role: newRole } : u))
          );
          showSuccess(`Role updated to ${newRole}`);
        } catch (err) {
          showError(err.message);
        }
      },
    });
  };

  const handleBanToggle = (user) => {
    const action = user.banned ? "unban" : "ban";
    openConfirm({
      message: `Are you sure you want to ${action} ${user.name}?`,
      onConfirm: async () => {
        try {
          await adminApiService.users.update(user._id, {
            banned: !user.banned,
          });
          setUsers((prev) =>
            prev.map((u) =>
              u._id === user._id ? { ...u, banned: !user.banned } : u
            )
          );
          showSuccess(`User ${action}ned`);
        } catch (err) {
          showError(err.message);
        }
      },
    });
  };

  // Filter users based on selected role
  const filteredUsers = users.filter((user) => {
    if (filterRole === "all") return true;
    return user.role === filterRole;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-sgr/50 min-h-screen py-12 px-6 md:px-20"
    >
      <div className="mx-auto bg-white rounded-3xl shadow-lg p-8 max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-5xl font-eulogy text-gray-800">Users</h1>

          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <label
              htmlFor="roleFilter"
              className="text-lg font-medium text-gray-700"
            >
              Filter by Role:
            </label>
            <select
              id="roleFilter"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="border border-gray-300 rounded-2xl p-3 text-lg focus:outline-none focus:ring-2 focus:ring-sgr"
            >
              <option value="all">All</option>
              <option value="adm">Admins</option>
              <option value="usr">Users</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Loader />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4 border text-left text-lg">Name</th>
                  <th className="p-4 border text-left text-lg">Email</th>
                  <th className="p-4 border text-left text-lg">Role</th>
                  <th className="p-4 border text-left text-lg">Status</th>
                  <th className="p-4 border text-left text-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="p-4 border text-lg">{user.name}</td>
                    <td className="p-4 border text-lg">{user.email}</td>
                    <td className="p-4 border text-lg capitalize">
                      {user.role === "adm" ? "Admin" : "User"}
                    </td>
                    <td className="p-4 border text-lg">
                      {user.banned ? "Banned" : "Active"}
                    </td>
                    <td className="p-4 border flex items-center gap-6">
                      <button
                        onClick={() => handleRoleToggle(user)}
                        className="text-blue-600 hover:underline text-lg"
                      >
                        {user.role === "adm" ? "Demote" : "Promote"}
                      </button>
                      <button
                        onClick={() => handleBanToggle(user)}
                        className="text-red-600 hover:underline text-lg"
                      >
                        {user.banned ? "Unban" : "Ban"}
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td className="p-4 border text-center text-lg" colSpan="5">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
