"use client";

import { Suspense } from "react";
import Loader from "@/components/common/Loader";
import WishlistContent from "@/components/wishlist/WishlistContent";

export default function WishlistPage() {
  return (
    <div className="w-full min-h-[60vh] bg-sgr/50 py-12 px-[10rem]">
      {/* Full-width Container */}
      <div className="w-full mx-auto px-6">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-[4rem] font-eulogy text-black">Your Wishlist</h1>
          <p className="text-xl text-black/70 mt-2">
            Items you’ve saved for later
          </p>
        </div>

        {/* Wishlist Content */}
        <Suspense fallback={<Loader />}>
          <WishlistContent />
        </Suspense>
      </div>
    </div>
  );
}
