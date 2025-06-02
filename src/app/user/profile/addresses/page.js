"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import apiService from "@/lib/apiService";

import AddressFormModal from "@/components/user/AddressFormModal";
import ConfirmModal from "@/components/common/ConfirmModal";
import useConfirmStore from "@/store/useConfirmStore";
import usePopupStore from "@/store/popupStore";
import SvgIcon from "@/components/common/SvgIcon";

export default function AddressBookPage() {
  /* ───────────── state */
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null); // null → add
  const [showModal, setShowModal] = useState(false);

  /* ───────────── stores */
  const { showSuccess, showError } = usePopupStore();
  const { openConfirm } = useConfirmStore();

  /* ───────────── fetch */
  const fetchAddresses = useCallback(async () => {
    try {
      const { data } = await apiService.addresses.get();
      setAddresses(Array.isArray(data) ? data : []);
    } catch (e) {
      showError(`Failed to load addresses ${e}`);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  /* ───────────── delete (wrapped in confirm modal) */
  const handleDelete = async (idx) => {
    openConfirm({
      message: "Delete this address?",
      onConfirm: async () => {
        try {
          await apiService.addresses.delete(idx);
          showSuccess("Address deleted");
          setAddresses((prev) => prev.filter((_, i) => i !== idx));
        } catch (err) {
          showError(err.message || "Delete failed");
        }
      },
      onCancel: () => {}, // no-op
    });
  };

  /* ───────────── save */
  const handleSave = async (newAddress) => {
    try {
      if (editingIndex !== null) {
        await apiService.addresses.update(editingIndex, newAddress);
        setAddresses((p) =>
          p.map((a, i) => (i === editingIndex ? { ...a, ...newAddress } : a))
        );
        showSuccess("Address updated");
      } else {
        await fetchAddresses(); // freshly added by modal itself
        showSuccess("Address added");
      }
      setShowModal(false);
      setEditingIndex(null);
    } catch (err) {
      showError(err.message || "Save failed");
    }
  };

  /* ───────────── UI */
  return (
    <div className="min-h-[60vh] bg-sgr/50 py-12 px-6 md:px-20">
      {/* global confirm portal */}
      <ConfirmModal />

      <div className="max-w-5xl mx-auto space-y-8">
        {/* header row */}
        <div className="flex items-center justify-between">
          <h1 className="text-[2.5rem] font-eulogy text-gray-800 text-xl">
            My Address Book
          </h1>
          <button
            onClick={() => {
              setEditingIndex(null);
              setShowModal(true);
            }}
            className="rounded-full text-2xl bg-sgr hover:bg-ogr cursor-pointer text-white px-6 py-3 transition"
          >
            <SvgIcon src="/svg/plus.svg" /> Add Address
          </button>
        </div>

        {/* list */}
        {loading ? (
          <p className="text-gray-600">Loading…</p>
        ) : addresses.length === 0 ? (
          <p className="text-gray-600">You haven’t saved any addresses yet.</p>
        ) : (
          <motion.div
            layout
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {addresses.map((addr, idx) => (
              <motion.div
                key={idx}
                layout
                whileHover={{
                  y: -4,
                  boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                    {addr.label}
                    {addr.isDefault && (
                      <span className="ml-2 text-lg font-bold text-green-700">
                        • Default
                      </span>
                    )}
                  </h2>
                  <div className="flex gap-3 text-lg">
                    <button
                      onClick={() => {
                        setEditingIndex(idx);
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(idx)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-3 text-gray-700 space-y-1 text-lg flex-1">
                  <p>{addr.fullName}</p>
                  <p>
                    {addr.street}, {addr.city}
                  </p>
                  <p>
                    {addr.postalCode}, {addr.country}
                  </p>
                  <p>{addr.email}</p>
                  <p>{addr.phone}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

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
