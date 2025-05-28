"use client";

import { useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import Image from "next/image";

export default function HeaderSearchIcon() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isHovered && (
        <Image src="/icons/search.png" alt="Search" width={50} height={50} />
      )}

      {isHovered && (
        <Player
          autoplay
          keepLastFrame
          src="/json/search.json"
          style={{ height: "50px", width: "50px" }}
        />
      )}
    </div>
  );
}
