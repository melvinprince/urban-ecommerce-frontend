"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import adminApiService from "@/lib/adminApiService";
import usePopupStore from "@/store/popupStore";

export default function EditCouponPage() {
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const { showError, showSuccess } = usePopupStore();
  const router = useRouter();

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const res = await adminApiService.coupons.getById(id);
        const c = res.data;
        setFormData({
          code: c.code,
          type: c.type,
          value: c.value,
          usageLimit: c.usageLimit,
          minSubtotal: c.minSubtotal,
          startDate: c.startDate.slice(0, 10), // format as YYYY-MM-DD
          expiryDate: c.expiryDate.slice(0, 10),
        });
      } catch (err) {
        showError(err.message);
      }
    };
    fetchCoupon();
  }, [id, showError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData, code: formData.code.toUpperCase() };
      await adminApiService.coupons.update(id, data);
      showSuccess("Coupon updated");
      router.push("/admin/coupons");
    } catch (err) {
      showError(err.message);
    }
  };

  if (!formData) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Coupon</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="code"
          value={formData.code}
          onChange={handleChange}
          placeholder="Code"
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
          value={formData.value}
          onChange={handleChange}
          placeholder="Value"
          className="border p-2 w-full"
        />
        <input
          name="usageLimit"
          type="number"
          value={formData.usageLimit}
          onChange={handleChange}
          placeholder="Usage Limit"
          className="border p-2 w-full"
        />
        <input
          name="minSubtotal"
          type="number"
          value={formData.minSubtotal}
          onChange={handleChange}
          placeholder="Minimum Subtotal"
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
          Update Coupon
        </button>
      </form>
    </div>
  );
}
