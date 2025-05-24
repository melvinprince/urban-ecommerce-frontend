"use client";

import { useEffect, useState } from "react";
import apiService from "@/lib/apiService";

import AddressFormModal from "@/components/user/AddressFormModal";
import usePopupStore from "@/store/popupStore";

export default function AddressBookPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null); // null = add
  const [showModal, setShowModal] = useState(false);

  const { showSuccess, showError } = usePopupStore();

  const fetchAddresses = async () => {
    try {
      const res = await apiService.addresses.get();
      console.log("[AddressBookPage] 🌐 API response:", res);

      const data = Array.isArray(res.data) ? res.data : [];
      setAddresses(data);
    } catch (e) {
      showError(`Failed to load addresses ${e}`);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDelete = async (index) => {
    const confirm = window.confirm("Delete this address?");
    if (!confirm) return;

    try {
      await apiService.address.delete(editingIndex);
      showSuccess("Address deleted successfully");
      setAddresses((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      showError(err.message || "Failed to delete address");
    }
  };

  const handleSave = async (newAddress) => {
    try {
      if (editingIndex !== null) {
        // update existing
        await apiService.address.update(editingIndex, newAddress);
        setAddresses((prev) =>
          prev.map((addr, i) =>
            i === editingIndex ? { ...addr, ...newAddress } : addr
          )
        );
        showSuccess("Address updated successfully");
      } else {
        // new address already saved by modal's API call
        setAddresses((prev) => [...prev, newAddress]);
        showSuccess("Address added successfully");
      }
      setShowModal(false);
      setEditingIndex(null);
    } catch (err) {
      showError(err.message || "Failed to save address");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Saved Addresses</h1>
        <button
          onClick={() => {
            setEditingIndex(null);
            setShowModal(true);
          }}
          className="bg-ogr text-white px-4 py-2 rounded"
        >
          ➕ Add Address
        </button>
      </div>

      {loading ? (
        <p>Loading addresses...</p>
      ) : addresses.length === 0 ? (
        <p className="text-gray-600">You have no saved addresses yet.</p>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr, i) => (
            <div
              key={i}
              className="border rounded p-4 relative bg-white shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div className="font-semibold">
                  {addr.label}{" "}
                  {addr.isDefault && (
                    <span className="text-green-700 text-sm ml-2">
                      (Default)
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingIndex(i);
                      setShowModal(true);
                    }}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(i)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-700">
                <p>{addr.fullName}</p>
                <p>
                  {addr.street}, {addr.city}
                </p>
                <p>
                  {addr.postalCode}, {addr.country}
                </p>
                <p>
                  {addr.email} • {addr.phone}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AddressFormModal
          initialData={editingIndex !== null ? addresses[editingIndex] : null}
          onClose={() => {
            setShowModal(false);
            setEditingIndex(null);
          }}
          onSuccess={handleSave}
        />
      )}
    </div>
  );
}
