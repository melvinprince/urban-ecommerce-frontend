"use client";

import { useEffect, useState } from "react";
import apiService from "@/lib/apiService";
import usePopupStore from "@/store/popupStore";
import useAuthStore from "@/store/authStore";

export default function EditOrderFormModal({ order, onClose, onSuccess }) {
  const { showSuccess, showError } = usePopupStore();
  const auth = useAuthStore();
  const isLoggedIn = auth?.isLoggedIn;

  const [form, setForm] = useState({ ...order.address });
  const [guestEmail, setGuestEmail] = useState(order?.address?.email || "");
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    if (!isLoggedIn) return;

    async function fetchAddresses() {
      try {
        const res = await apiService.addresses.get();
        const valid = Array.isArray(res.data) ? res.data.filter(Boolean) : [];
        setAddresses(valid);
      } catch (err) {
        console.error("Failed to fetch saved addresses", err);
      }
    }

    fetchAddresses();
  }, [isLoggedIn]);

  const handleSelectSavedAddress = (addr) => {
    setForm(addr);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let payload = { address: form };

      if (!isLoggedIn) {
        const email = prompt(
          "Please enter the email used when placing the order:"
        );
        if (!email || !email.trim()) {
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
      showSuccess("Order updated");
      onSuccess(updated);
      onClose();
    } catch (err) {
      showError(err.message || "Failed to update order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded max-w-md w-full shadow-lg space-y-4">
        <h2 className="text-lg font-bold">Edit Order Address</h2>

        {isLoggedIn && addresses.length > 0 && (
          <>
            <p className="text-sm text-gray-600">
              Choose from saved addresses:
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto border p-2 rounded">
              {addresses
                .filter((addr) => addr && typeof addr === "object")
                .map((addr, i) => (
                  <div
                    key={i}
                    className="border p-2 rounded cursor-pointer hover:border-blue-500"
                    onClick={() => handleSelectSavedAddress(addr)}
                  >
                    <div className="font-semibold">{addr.label}</div>
                    <p>{addr.fullName}</p>
                    <p>
                      {addr.street}, {addr.city}
                    </p>
                    <p>
                      {addr.country} - {addr.postalCode}
                    </p>
                    <p>
                      📧 {addr.email} • 📞 {addr.phone}
                    </p>
                    {addr.isDefault && (
                      <span className="text-green-700 text-xs">(Default)</span>
                    )}
                  </div>
                ))}
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
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
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="w-full border p-2 rounded"
            />
          ))}

          <div className="flex justify-end gap-4 pt-3">
            <button type="button" onClick={onClose} className="text-gray-600">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-ogr text-white px-4 py-2 rounded"
            >
              {loading ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
