"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductGrid from "@/components/products/ProductGrid";

export default function CategoryProductsPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      console.log("Fetching products for category slug:", slug); // ✅ Log 1
      try {
        const API = process.env.NEXT_PUBLIC_BACKEND_URL;
        const url = `${API}/api/products?category=${slug}`;
        console.log("API URL:", url); // ✅ Log 2

        const res = await fetch(url);
        console.log("Fetch Response Status:", res.status); // ✅ Log 3

        if (!res.ok) throw new Error(`Status ${res.status}`);

        const responseData = await res.json();
        console.log("Full API Response:", responseData); // ✅ Log 4

        const { data } = responseData;
        console.log("Extracted Products Array:", data); // ✅ Log 5

        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err.message); // ✅ Log 6
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
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
