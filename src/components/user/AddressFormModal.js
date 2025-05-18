"use client";

import { useState, useEffect } from "react";
import { addUserAddress } from "@/lib/api";
import usePopupStore from "@/store/popupStore";

export default function AddressFormModal({
  initialData = null,
  onClose,
  onSuccess,
}) {
  const { showSuccess, showError } = usePopupStore();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
    isDefault: false,
    label: "My Address",
  });

  useEffect(() => {
    if (initialData) setForm({ ...initialData });
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (initialData) {
        // Edit mode — delegate update handling to parent
        await onSuccess(form);
        showSuccess("Address updated successfully");
      } else {
        // Add mode
        const data = await addUserAddress(form);
        const newAddress = data[data.length - 1]; // latest address from array
        showSuccess("Address added successfully");
        onSuccess(newAddress);
      }
    } catch (err) {
      showError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded max-w-md w-full shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? "Edit Address" : "Add New Address"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {[
            "label",
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
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="w-full border rounded p-2"
              required
            />
          ))}

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) =>
                setForm({ ...form, isDefault: e.target.checked })
              }
            />
            Set as default address
          </label>

          <div className="flex justify-end gap-4 pt-3">
            <button type="button" onClick={onClose} className="text-gray-600">
              Cancel
            </button>
            <button
              type="submit"
              className="bg-ogr text-white px-4 py-2 rounded"
            >
              {initialData ? "Update" : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
