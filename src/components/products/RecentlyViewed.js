"use client";

import { useEffect, useState } from "react";
import useRecentlyViewedStore from "@/store/recentlyViewedStore";
import { getProductsByIds } from "@/lib/api"; // you'll need to define this if not already
import ProductGrid from "@/components/products/ProductGrid";
import Loader from "@/components/common/Loader";

export default function RecentlyViewed() {
  const { items: productIds } = useRecentlyViewedStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!productIds.length) {
        setLoading(false);
        return;
      }

      try {
        const res = await getProductsByIds(productIds);
        setProducts(res || []);
      } catch (err) {
        console.error("Failed to fetch recently viewed products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [productIds]);

  if (loading) return <Loader />;
  if (!products.length) return null;

  return (
    <section className="my-10 px-4">
      <h2 className="text-xl font-semibold mb-4">Recently Viewed</h2>
      <ProductGrid products={products} />
    </section>
  );
}
