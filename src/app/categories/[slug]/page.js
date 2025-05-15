"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductGrid from "@/components/products/ProductGrid";
import { getProducts } from "@/lib/api"; // 🆕 Clean API import

export default function CategoryProductsPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await getProducts({ category: slug }); // 🆕
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchProducts(); // 🆕 Avoid unnecessary fetch if slug is undefined
  }, [slug]);

  if (loading) return <div className="p-6">Loading products…</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 capitalize">
        Products in &quot;{slug.replace(/-/g, " ")}&quot;
      </h1>
      <ProductGrid products={products} />
    </div>
  );
}
