// File: app/admin/coupons/page.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import adminApiService from "@/lib/adminApiService";
import usePopupStore from "@/store/popupStore";
import useConfirmStore from "@/store/useConfirmStore";
import Loader from "@/components/common/Loader";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showError, showSuccess } = usePopupStore();
  const { openConfirm } = useConfirmStore();

  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      try {
        const res = await adminApiService.coupons.getAll();
        setCoupons(res.data);
      } catch (err) {
        showError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, [showError]);

  const handleDelete = (id) => {
    openConfirm({
      message: "Are you sure you want to delete this coupon?",
      onConfirm: async () => {
        try {
          setLoading(true);
          await adminApiService.coupons.delete(id);
          setCoupons((prev) => prev.filter((c) => c._id !== id));
          showSuccess("Coupon deleted");
        } catch (err) {
          showError(err.message);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-sgr/50 min-h-screen py-12 px-6 md:px-20 flex items-center justify-center"
    >
      <div className="mx-auto bg-white rounded-3xl shadow-lg p-8 w-[80%]">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-eulogy text-gray-800">Coupons</h1>
          <Link
            href="/admin/coupons/add"
            className="inline-flex items-center gap-2 bg-sgr hover:bg-ogr text-white px-5 py-3 rounded-full text-xl transition"
          >
            + Add Coupon
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Loader />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4 border text-left text-lg">Code</th>
                  <th className="p-4 border text-left text-lg">Type</th>
                  <th className="p-4 border text-left text-lg">Value</th>
                  <th className="p-4 border text-left text-lg">Usage</th>
                  <th className="p-4 border text-left text-lg">Validity</th>
                  <th className="p-4 border text-left text-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-gray-50">
                    <td className="p-4 border text-lg">{coupon.code}</td>
                    <td className="p-4 border text-lg">{coupon.type}</td>
                    <td className="p-4 border text-lg">
                      {coupon.type === "percentage"
                        ? `${coupon.value}%`
                        : `QAR ${coupon.value}`}
                    </td>
                    <td className="p-4 border text-lg">
                      {coupon.usedCount}/{coupon.usageLimit}
                    </td>
                    <td className="p-4 border text-lg">
                      {new Date(coupon.startDate).toLocaleDateString()} –{" "}
                      {new Date(coupon.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 border flex items-center gap-4 text-lg">
                      <Link
                        href={`/admin/coupons/${coupon._id}/edit`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(coupon._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {coupons.length === 0 && (
                  <tr>
                    <td className="p-4 border text-center text-lg" colSpan="6">
                      No coupons found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
