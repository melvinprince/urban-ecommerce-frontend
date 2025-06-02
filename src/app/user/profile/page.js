"use client";

import { Heart, ShoppingBag, MapPin } from "lucide-react";
import dynamic from "next/dynamic";

const ProfileTile = dynamic(() => import("@/components/user/ProfileTile"), {
  ssr: false,
});

export default function Page() {
  return (
    <div className="h-[60vh] bg-sgr/50 py-12 flex flex-col items-center">
      {/* Profile Header */}
      <div className="flex flex-col items-center space-y-2">
        <h1 className="text-[5rem] text-black font-eulogy">Hello, Jane Doe</h1>
        <p className="text-2xl text-black/80">Manage your account settings</p>
      </div>

      {/* Action Tiles */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[5rem] px-4 ">
        <ProfileTile
          href="/profile/wishlist"
          src="/json/heart.json"
          title="Wishlist"
          description="Review and manage items you’ve saved for later"
        />
        <ProfileTile
          href="/profile/orders"
          src="/json/credit-card.json"
          title="Orders"
          description="Track your purchases and view order history"
        />
        <ProfileTile
          href="/profile/addresses"
          src="/json/location.json"
          title="Addresses"
          description="Add or edit your shipping and billing addresses"
        />
      </div>
    </div>
  );
}
