"use client";

import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

export default function CategoryTile({
  category,
  onHover,
  labelSize = "text-base",
}) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      onMouseEnter={onHover}
      className={clsx(
        "group block relative w-full h-full rounded-lg overflow-hidden",
        "ring-1 ring-gray-200 hover:ring-gray-400"
      )}
      /* 👇 Square tile */
      style={{ aspectRatio: "1 / 1" }}
    >
      <Image
        src={category.image || "/images/categories/girl-boy.jpeg"}
        alt={category.name}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 768px) 50vw, 25vw"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      <span
        className={clsx(
          "absolute bottom-2 left-3 right-3 font-medium text-white truncate",
          labelSize
        )}
      >
        {category.name}
      </span>
    </Link>
  );
}
