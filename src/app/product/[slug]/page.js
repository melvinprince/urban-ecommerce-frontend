"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductGallery from "@/components/productDetail/ProductGallery";
import ProductInfo from "@/components/productDetail/ProductInfo";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        const API = process.env.NEXT_PUBLIC_BACKEND_URL;
        const res = await fetch(`${API}/api/products/${slug}`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const { data } = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  if (loading) return <div className="p-6">Loading product…</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
  if (!product) return <div className="p-6">Product not found.</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <ProductGallery images={product.images} />
        <ProductInfo product={product} />
      </div>
    </div>
  );
}
