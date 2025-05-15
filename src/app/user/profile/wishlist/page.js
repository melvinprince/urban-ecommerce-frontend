"use client";

import { useEffect } from "react";
import WishlistItem from "@/components/wishlist/WishlistItem";
import useWishlistStore from "@/store/wishlistStore";

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const isLoaded = useWishlistStore((s) => s.isLoaded);
  const error = useWishlistStore((s) => s.error);
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  if (!isLoaded) {
    return <div className="p-6 text-center">Loading wishlist…</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>
      {items.length === 0 ? (
        <p className="text-center text-gray-600">Your wishlist is empty.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <WishlistItem key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
