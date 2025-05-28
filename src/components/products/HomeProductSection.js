"use client";

import { useEffect, useState } from "react";
import apiService from "@/lib/apiService";
import ProductGrid from "@/components/products/ProductGrid";
import Loader from "@/components/common/Loader";
import ScrollingText from "../common/ScrollingText";

export default function HomeProductSection({ title, query = {} }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await apiService.products.getAll({ ...query });

        if (mounted) {
          setProducts(res.data.products || []);
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
    <section className="my-[1.5rem] mx-[5rem]">
      {title && (
        <ScrollingText
          text={title}
          baseVelocity={100}
          size={20}
          direction="leftToRight"
        />
      )}
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
