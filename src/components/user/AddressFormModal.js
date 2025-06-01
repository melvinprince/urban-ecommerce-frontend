// components/user/AddressFormModal.jsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import apiService from "@/lib/apiService";
import usePopupStore from "@/store/popupStore";
import SvgIcon from "../common/SvgIcon";

/* ------------------- field order ------------------- */
const FIELDS = [
  "label",
  "fullName",
  "email",
  "phone",
  "street",
  "city",
  "postalCode",
  "country",
];

/* ------------- tiny helper for placeholders -------- */
const nice = (s) => s.charAt(0).toUpperCase() + s.slice(1);

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
  const [submitting, setSubmitting] = useState(false);

  /* preload edit data */
  useEffect(() => {
    if (initialData) setForm({ ...initialData });
  }, [initialData]);

  /* ---------- submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      if (initialData) {
        await onSuccess(form); // update path
        showSuccess("Address updated successfully");
      } else {
        const { data } = await apiService.addresses.add(form);
        const newAddr = data.at(-1);
        showSuccess("Address added successfully");
        onSuccess(newAddr); // add path
      }
    } catch (err) {
      showError(err?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <AnimatePresence>
      {/* ------ overlay ------ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 flex items-center justify-center
                   bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        {/* ------ modal card ------ */}
        <motion.div
          initial={{ scale: 0.88, y: 60, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.88, y: -40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8"
        >
          {/* close icon */}
          <button
            onClick={onClose}
            className=" bg-black absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <SvgIcon src="/svg/close.svg" width={18} height={18} />
          </button>

          <h2 className="text-2xl font-semibold mb-6">
            {initialData ? "Edit Address" : "Add New Address"}
          </h2>

          {/* ----------- form ----------- */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {FIELDS.map((field, i) => (
              <motion.input
                key={field}
                value={form[field]}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [field]: e.target.value }))
                }
                placeholder={nice(field)}
                required
                className="w-full border rounded-lg px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
              />
            ))}

            {/* default checkbox */}
            <label className="flex items-center gap-3 pt-1">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) =>
                  setForm((f) => ({ ...f, isDefault: e.target.checked }))
                }
                className="h-5 w-5 accent-indigo-600"
              />
              <span>Set as default</span>
            </label>

            {/* actions */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                disabled={submitting}
                whileTap={{ scale: 0.96 }}
                className="bg-ogr text-white px-5 py-2 rounded-lg
                           hover:bg-ogr/90 transition disabled:opacity-50"
              >
                {submitting
                  ? "Saving…"
                  : initialData
                  ? "Update Address"
                  : "Save Address"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
