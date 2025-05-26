"use client";

import { useState, useEffect } from "react";
import adminApiService from "@/lib/adminApiService";
import usePopupStore from "@/store/popupStore";

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const { showError, showSuccess } = usePopupStore();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await adminApiService.products.getReviews(productId);
        console.log("Fetched reviews:", res);
        setReviews(res.data);
      } catch (err) {
        console.log("Error fetching reviews:", err);
        showError(err.message);
      }
    };

    fetchReviews();
  }, [productId, showError]);

  const handleDelete = async (reviewId) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      await adminApiService.products.deleteReview(reviewId);
      setReviews(reviews.filter((r) => r._id !== reviewId));
      showSuccess("Review deleted");
    } catch (err) {
      console.log("Error deleting review:", err);

      showError(err.message);
    }
  };

  if (reviews.length === 0) {
    return (
      <div className="mt-6 border p-4 rounded bg-gray-50">
        <h2 className="text-lg font-semibold mb-2">Reviews</h2>
        <p>No reviews for this product yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 border p-4 rounded bg-gray-50">
      <h2 className="text-lg font-semibold mb-4">Reviews ({reviews.length})</h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="border p-2 rounded bg-white flex justify-between items-start"
          >
            <div>
              <p className="text-sm font-semibold">
                {review.user?.name || "User"}
              </p>
              <p className="text-xs text-gray-600">{review.user?.email}</p>
              <p className="mt-1 text-yellow-600">⭐ {review.rating}</p>
              <p className="mt-1">{review.comment}</p>
            </div>
            <button
              onClick={() => handleDelete(review._id)}
              className="text-red-600 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
