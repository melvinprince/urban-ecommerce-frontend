"use client";

import { useEffect } from "react";
import Loader from "@/components/common/Loader";
import WishlistItem from "@/components/wishlist/WishlistItem";
import useWishlistStore from "@/store/wishlistStore";

export default function WishlistContent() {
  const items = useWishlistStore((s) => s.items);
  const isLoaded = useWishlistStore((s) => s.isLoaded);
  const error = useWishlistStore((s) => s.error);
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  if (!isLoaded) {
    return <Loader />;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  if (items.length === 0) {
    return (
      <p className="text-center py-10 text-black/70">Your wishlist is empty.</p>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-8 mx-auto">
      {items.map((item) => (
        <WishlistItem key={item._id} item={item} />
      ))}
    </div>
  );
}
