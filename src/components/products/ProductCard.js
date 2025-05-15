"use client";

import Link from "next/link";

export default function ProductCard({ product }) {
  if (!product) return null;

  const firstImage =
    product.images?.[0] || "https://via.placeholder.com/300x300?text=No+Image";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="aspect-w-1 aspect-h-1 bg-gray-100">
        <img
          src={firstImage}
          alt={product.title}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 truncate">
          {product.title}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {product.discountPrice ?? product.price} QAR
        </p>
      </div>
    </Link>
  );
}
