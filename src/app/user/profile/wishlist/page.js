import { Suspense } from "react";
import Loader from "@/components/common/Loader";
import WishlistContent from "@/components/wishlist/WishlistContent";

export default function WishlistPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>

      <Suspense fallback={<Loader />}>
        <WishlistContent />
      </Suspense>
    </div>
  );
}
