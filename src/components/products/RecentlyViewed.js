"use client";

import { useEffect, useState } from "react";
import useRecentlyViewedStore from "@/store/recentlyViewedStore";
import apiService from "@/lib/apiService";
import ProductGrid from "@/components/products/ProductGrid";
import Loader from "@/components/common/Loader";
import ScrollingText from "@/components/common/ScrollingText";

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
        const res = await apiService.products.getByIds(productIds);
        console.log("Fetched recently viewed products:", res);

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
    <section className="my-[1.5rem] mx-[5rem]">
      <ScrollingText
        text="Recently Viewed"
        baseVelocity={100}
        size={20}
        direction="leftToRight"
      />
      <ProductGrid products={products} />
    </section>
  );
}
