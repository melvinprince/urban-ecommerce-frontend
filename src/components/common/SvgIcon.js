// components/common/SvgIcon.jsx

"use client";

import Image from "next/image";

export default function SvgIcon({
  src,
  alt = "Icon",
  width = 24,
  height = 24,
  className = "",
}) {
  if (!src) {
    console.warn("SvgIcon requires a valid `src` prop.");
    return null;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`inline ${className}`}
      unoptimized
    />
  );
}
