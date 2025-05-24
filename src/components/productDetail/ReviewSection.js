"use client";
import { useEffect, useState } from "react";
import apiService from "@/lib/apiService";
import useAuthStore from "@/store/authStore";
import usePopupStore from "@/store/popupStore";
import StarRating from "@/components/common/StarRating";

export default function ReviewsSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const { isLoggedIn } = useAuthStore();
  const { showError, showSuccess } = usePopupStore();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiService.reviews.getForProduct(productId);
        setReviews(Array.isArray(res) ? res : []);
      } catch (err) {
        setReviews([]);
      }
    })();
  }, [productId]);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const res = await apiService.reviews.submit({
        product: productId,
        rating: Number(rating),
        comment,
      });
      showSuccess(res.message || "Review submitted.");
      const updated = await apiService.reviews.getForProduct(productId);
      setReviews(updated);
      setComment("");
      setRating(5);
    } catch (err) {
      showError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-2">Customer Reviews</h3>

      {isLoggedIn && (
        <div className="mb-4 border p-4 rounded">
          <h4 className="mb-2">Leave a Review</h4>
          <StarRating rating={rating} onChange={setRating} />
          <textarea
            className="w-full border rounded p-2 mt-2"
            rows={3}
            placeholder="Write your comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-2 px-4 py-2 bg-black text-white rounded disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      )}

      <div className="space-y-4">
        {!Array.isArray(reviews) || reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="border p-4 rounded">
              <div className="font-semibold flex items-center gap-2">
                {r.user?.name || "User"} –
                <StarRating rating={r.rating} readonly size={16} />
              </div>
              <p>{r.comment}</p>
              <small className="text-gray-500">
                {new Date(r.createdAt).toLocaleDateString()}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
