"use client";

import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";

// Lazy load the heavy lottie player only on the client
const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((m) => m.Player),
  { ssr: false }
);
import Image from "next/image";
import useCartStore from "@/store/cartStore";

export default function HeaderCartContent() {
  const [isHovered, setIsHovered] = useState(false);

  // Subscribe directly to totalItems in the cart store
  const totalItems = useCartStore((s) => s.totalItems);

  return (
    <Link
      href="/cart"
      className="relative pl-[1rem]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Static icon when not hovered */}
      {!isHovered && (
        <div className="flex items-center justify-center">
          <Image
            src="/icons/shopping-cart.png"
            alt="Cart"
            width={50}
            height={50}
          />
        </div>
      )}

      {/* Lottie animation on hover */}
      {isHovered && (
        <Player
          autoplay
          keepLastFrame
          src="/json/shopping-cart.json"
          style={{ height: "50px", width: "50px" }}
        />
      )}

      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
