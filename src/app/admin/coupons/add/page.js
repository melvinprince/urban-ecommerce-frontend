"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import adminApiService from "@/lib/adminApiService";
import usePopupStore from "@/store/popupStore";

export default function AddCouponPage() {
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage",
    value: "",
    usageLimit: 1,
    minSubtotal: 0,
    startDate: "",
    expiryDate: "",
  });
  const { showError, showSuccess } = usePopupStore();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData, code: formData.code.toUpperCase() };
      await adminApiService.coupons.create(data);
      showSuccess("Coupon created");
      router.push("/admin/coupons");
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add Coupon</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="code"
          placeholder="Code"
          value={formData.code}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <label className="block font-semibold">Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed</option>
        </select>

        <input
          name="value"
          type="number"
          placeholder="Value"
          value={formData.value}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          name="usageLimit"
          type="number"
          placeholder="Usage Limit"
          value={formData.usageLimit}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          name="minSubtotal"
          type="number"
          placeholder="Minimum Subtotal"
          value={formData.minSubtotal}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <label className="block font-semibold">Start Date</label>
        <input
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <label className="block font-semibold">Expiry Date</label>
        <input
          name="expiryDate"
          type="date"
          value={formData.expiryDate}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Coupon
        </button>
      </form>
    </div>
  );
}
