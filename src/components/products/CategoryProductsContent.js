"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductGrid from "@/components/products/ProductGrid";
import Loader from "@/components/common/Loader";
import { getProducts } from "@/lib/api";

export default function CategoryProductsContent() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await getProducts({ category: slug });
        setProducts(data); // ⬅️ Safe access
      } catch (err) {
        setError(err.message || "Failed to load products.");
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchProducts();
  }, [slug]);

  if (loading) return <Loader />;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <>
      <h1 className="text-2xl font-bold mb-6 capitalize">
        Products in &quot;{slug.replace(/-/g, " ")}&quot;
      </h1>
      <ProductGrid products={products} />
    </>
  );
}
