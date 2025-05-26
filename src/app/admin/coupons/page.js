"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import adminApiService from "@/lib/adminApiService";
import usePopupStore from "@/store/popupStore";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const { showError, showSuccess } = usePopupStore();

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await adminApiService.coupons.getAll();
        setCoupons(res.data);
      } catch (err) {
        showError(err.message);
      }
    };
    fetchCoupons();
  }, [showError]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await adminApiService.coupons.delete(id);
      setCoupons(coupons.filter((c) => c._id !== id));
      showSuccess("Coupon deleted");
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <Link href="/admin/coupons/add" className="text-blue-600 font-semibold">
          Add Coupon
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Code</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Value</th>
              <th className="p-2 border">Usage</th>
              <th className="p-2 border">Validity</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon._id}>
                <td className="p-2 border">{coupon.code}</td>
                <td className="p-2 border">{coupon.type}</td>
                <td className="p-2 border">
                  {coupon.type === "percentage"
                    ? `${coupon.value}%`
                    : `$${coupon.value}`}
                </td>
                <td className="p-2 border">
                  {coupon.usedCount}/{coupon.usageLimit}
                </td>
                <td className="p-2 border">
                  {new Date(coupon.startDate).toLocaleDateString()} -{" "}
                  {new Date(coupon.expiryDate).toLocaleDateString()}
                </td>
                <td className="p-2 border">
                  <Link
                    href={`/admin/coupons/${coupon._id}/edit`}
                    className="text-blue-600 mr-2"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(coupon._id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td className="p-2 border text-center" colSpan="6">
                  No coupons found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
