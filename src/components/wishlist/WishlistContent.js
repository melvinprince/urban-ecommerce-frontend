"use client";

import { useEffect } from "react";
import WishlistItem from "@/components/wishlist/WishlistItem";
import useWishlistStore from "@/store/wishlistStore";
import Loader from "@/components/common/Loader";

export default function WishlistContent() {
  const items = useWishlistStore((s) => s.items);
  const isLoaded = useWishlistStore((s) => s.isLoaded);
  const error = useWishlistStore((s) => s.error);
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  if (!isLoaded) {
    return <Loader />; // ✅ Unified Loader
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  if (items.length === 0) {
    return (
      <p className="text-center py-10 text-gray-600">Your wishlist is empty.</p>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <WishlistItem key={item._id} item={item} />
      ))}
    </div>
  );
}
