"use client";

import { useEffect, useState } from "react";
import apiService from "@/lib/apiService";
import ProductGrid from "@/components/products/ProductGrid";
import Loader from "@/components/common/Loader";

export default function HomeProductSection({ title, query = {} }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await apiService.products.getAll({ ...query });
        if (mounted) {
          setProducts(res.data || []);
        }
      } catch (err) {
        console.error("❌ Failed to load products for:", title, err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [query, title]);

  return (
    <section className="my-10">
      {title && <h2 className="text-2xl font-semibold mb-6">{title}</h2>}
      {loading ? (
        <Loader />
      ) : products?.length ? (
        <ProductGrid products={products} />
      ) : (
        <p className="text-gray-500">No products found.</p>
      )}
    </section>
  );
}
