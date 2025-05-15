"use client";

export default function ProductInfo({ product }) {
  if (!product) return null;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>

      <p className="text-xl font-semibold text-green-700">
        {product.discountPrice ?? product.price} QAR
      </p>

      {product.shortDescription && (
        <p className="text-gray-700">{product.shortDescription}</p>
      )}

      {product.description && (
        <div className="text-gray-600">
          <p className="font-semibold">Description:</p>
          <p>{product.description}</p>
        </div>
      )}

      {product.sizes?.length > 0 && (
        <div>
          <p className="font-semibold">Available Sizes:</p>
          <p>{product.sizes.join(", ")}</p>
        </div>
      )}

      {product.colors?.length > 0 && (
        <div>
          <p className="font-semibold">Available Colors:</p>
          <p>{product.colors.join(", ")}</p>
        </div>
      )}

      <div>
        <p className="font-semibold">Stock:</p>
        <p>
          {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
        </p>
      </div>
    </div>
  );
}
