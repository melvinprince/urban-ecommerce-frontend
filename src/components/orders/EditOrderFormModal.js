"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import apiService from "@/lib/apiService";
import usePopupStore from "@/store/popupStore";
import useAuthStore from "@/store/authStore";

export default function EditOrderFormModal({ order, onClose, onSuccess }) {
  const { showSuccess, showError } = usePopupStore();
  const { isLoggedIn } = useAuthStore();

  const [form, setForm] = useState({ ...order.address });
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  /* fetch saved addresses (logged-in users) */
  useEffect(() => {
    if (!isLoggedIn) return;

    async function fetchAddresses() {
      try {
        const res = await apiService.addresses.get();
        setAddresses(Array.isArray(res.data) ? res.data.filter(Boolean) : []);
      } catch (err) {
        console.error("Failed to fetch addresses", err);
      }
    }

    fetchAddresses();
  }, [isLoggedIn]);

  /* helpers */
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSelectSaved = (addr) => setForm(addr);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { address: form };

      if (!isLoggedIn) {
        const email = prompt(
          "Please enter the email used when placing the order:"
        );
        if (!email?.trim()) {
          showError("Email is required to verify your order.");
          setLoading(false);
          return;
        }
        payload.email = email.trim();
      }

      const updated = await apiService.orders.edit(
        order.customOrderId,
        payload
      );
      showSuccess("Order updated!");
      onSuccess(updated?.data || updated);
      onClose();
    } catch (err) {
      showError(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* ui */
  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          key="modal"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl w-11/12 max-w-lg p-8 space-y-6"
        >
          <h2 className="text-3xl font-semibold text-gray-800">
            Edit Shipping Address
          </h2>

          {/* saved addresses */}
          {isLoggedIn && addresses.length > 0 && (
            <div className="space-y-3">
              <p className="text-xl text-gray-600">
                Select one of your saved addresses:
              </p>
              <div className="max-h-52 overflow-y-auto space-y-3 pr-1">
                {addresses.map((addr) => (
                  <button
                    key={addr._id}
                    type="button"
                    onClick={() => handleSelectSaved(addr)}
                    className="w-full text-left border border-gray-300 hover:border-blue-500 rounded-xl p-3 text-xl transition"
                  >
                    <div className="font-medium">{addr.label}</div>
                    <p>{addr.fullName}</p>
                    <p>
                      {addr.street}, {addr.city}
                    </p>
                    <p>
                      {addr.country} – {addr.postalCode}
                    </p>
                    <p className="text-lg text-gray-500">
                      📧 {addr.email} • 📞 {addr.phone}
                    </p>
                    {addr.isDefault && (
                      <span className="text-green-600 text-xs font-bold">
                        Default
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* form */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            {[
              "fullName",
              "email",
              "phone",
              "street",
              "city",
              "postalCode",
              "country",
            ].map((field) => (
              <input
                key={field}
                name={field}
                required
                value={form[field] || ""}
                onChange={handleChange}
                placeholder={
                  field === "postalCode"
                    ? "Postal Code"
                    : field.charAt(0).toUpperCase() + field.slice(1)
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            ))}

            {/* actions */}
            <div className="flex justify-end gap-4 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
