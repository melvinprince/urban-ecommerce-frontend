// components/admin/products/ReviewSection.jsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import adminApiService from "@/lib/adminApiService";
import usePopupStore from "@/store/popupStore";
import { Trash2 } from "lucide-react";

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const { showError, showSuccess } = usePopupStore();

  useEffect(() => {
    (async () => {
      try {
        const res = await adminApiService.products.getReviews(productId);
        setReviews(res.data);
      } catch (err) {
        showError(err.message);
      }
    })();
  }, [productId, showError]);

  const handleDelete = async (reviewId) => {
    const confirmed = window.confirm("Delete this review?");
    if (!confirmed) return;

    try {
      await adminApiService.products.deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      showSuccess("Review deleted");
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="border-t pt-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Reviews ({reviews.length})
      </h2>

      {reviews.length === 0 ? (
        <div className="p-6 bg-gray-50 rounded-lg text-center text-gray-600">
          No reviews for this product yet.
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, idx) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-xl shadow p-4 flex justify-between items-start"
            >
              <div className="space-y-1">
                <p className="font-medium text-lg text-gray-800">
                  {review.user?.name || "Anonymous"}
                </p>
                <p className="text-sm text-gray-500">{review.user?.email}</p>
                <p className="mt-1 text-yellow-600 font-semibold">
                  ⭐ {review.rating}
                </p>
                <p className="mt-1 text-gray-700">{review.comment}</p>
              </div>
              <button
                onClick={() => handleDelete(review._id)}
                className="text-red-600 hover:text-red-800 transition"
              >
                <Trash2 size={20} />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
