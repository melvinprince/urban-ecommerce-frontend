// File: app/admin/coupons/add/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import adminApiService from "@/lib/adminApiService";
import usePopupStore from "@/store/popupStore";
import Loader from "@/components/common/Loader";

export default function AddCouponPage() {
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage",
    value: "",
    usageLimit: "",
    minSubtotal: "",
    startDate: "",
    expiryDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showError, showSuccess } = usePopupStore();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.code ||
      !formData.value ||
      !formData.startDate ||
      !formData.expiryDate
    ) {
      showError("Please fill all required fields");
      return;
    }
    try {
      setIsSubmitting(true);
      const data = { ...formData, code: formData.code.toUpperCase() };
      await adminApiService.coupons.create(data);
      showSuccess("Coupon created");
      router.push("/admin/coupons");
    } catch (err) {
      showError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-sgr/50 min-h-screen py-12 px-6 md:px-20 flex items-center justify-center"
    >
      <div className="mx-auto bg-white rounded-3xl shadow-lg p-8 w-[50%]">
        <h1 className="text-5xl font-eulogy mb-8 text-gray-800">Add Coupon</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Code */}
          <div>
            <label
              htmlFor="code"
              className="block text-xl font-medium text-gray-700 mb-2"
            >
              Code
            </label>
            <input
              id="code"
              name="code"
              placeholder="Coupon Code"
              value={formData.code}
              onChange={handleChange}
              className="border border-gray-300 rounded-2xl p-3 w-full text-lg focus:outline-none focus:ring-2 focus:ring-sgr"
            />
          </div>

          {/* Type */}
          <div>
            <label
              htmlFor="type"
              className="block text-xl font-medium text-gray-700 mb-2"
            >
              Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="border border-gray-300 rounded-2xl p-3 w-full text-lg bg-white focus:outline-none focus:ring-2 focus:ring-sgr"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>

          {/* Value */}
          <div>
            <label
              htmlFor="value"
              className="block text-xl font-medium text-gray-700 mb-2"
            >
              Value
            </label>
            <input
              id="value"
              name="value"
              type="number"
              placeholder="Discount Value"
              value={formData.value}
              onChange={handleChange}
              className="border border-gray-300 rounded-2xl p-3 w-full text-lg focus:outline-none focus:ring-2 focus:ring-sgr"
            />
          </div>

          {/* Usage Limit */}
          <div>
            <label
              htmlFor="usageLimit"
              className="block text-xl font-medium text-gray-700 mb-2"
            >
              Usage Limit
            </label>
            <input
              id="usageLimit"
              name="usageLimit"
              type="number"
              placeholder="Maximum Uses"
              value={formData.usageLimit}
              onChange={handleChange}
              className="border border-gray-300 rounded-2xl p-3 w-full text-lg focus:outline-none focus:ring-2 focus:ring-sgr"
            />
          </div>

          {/* Minimum Subtotal */}
          <div>
            <label
              htmlFor="minSubtotal"
              className="block text-xl font-medium text-gray-700 mb-2"
            >
              Minimum Subtotal
            </label>
            <input
              id="minSubtotal"
              name="minSubtotal"
              type="number"
              placeholder="Minimum Order Amount"
              value={formData.minSubtotal}
              onChange={handleChange}
              className="border border-gray-300 rounded-2xl p-3 w-full text-lg focus:outline-none focus:ring-2 focus:ring-sgr"
            />
          </div>

          {/* Start Date */}
          <div>
            <label
              htmlFor="startDate"
              className="block text-xl font-medium text-gray-700 mb-2"
            >
              Start Date
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              className="border border-gray-300 rounded-2xl p-3 w-full text-lg focus:outline-none focus:ring-2 focus:ring-sgr"
            />
          </div>

          {/* Expiry Date */}
          <div>
            <label
              htmlFor="expiryDate"
              className="block text-xl font-medium text-gray-700 mb-2"
            >
              Expiry Date
            </label>
            <input
              id="expiryDate"
              name="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={handleChange}
              className="border border-gray-300 rounded-2xl p-3 w-full text-lg focus:outline-none focus:ring-2 focus:ring-sgr"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-sgr hover:bg-ogr text-white px-5 py-3 rounded-full text-xl transition disabled:opacity-50"
            >
              {isSubmitting ? <Loader /> : "Create Coupon"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
