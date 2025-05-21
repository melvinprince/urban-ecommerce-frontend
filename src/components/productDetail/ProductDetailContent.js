"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductGallery from "@/components/productDetail/ProductGallery";
import ProductInfo from "@/components/productDetail/ProductInfo";
import Loader from "@/components/common/Loader";
import { getProductBySlug } from "@/lib/api";
import useRecentlyViewedStore from "@/store/recentlyViewedStore"; 

export default function ProductDetailContent() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addItem } = useRecentlyViewedStore(); 

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data } = await getProductBySlug(slug);
        setProduct(data);


        if (data?._id) addItem(data._id); 
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load product.");
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchProduct();
  }, [slug]);

  if (loading) return <Loader />;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
  if (!product) return <div className="p-6">Product not found.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <ProductGallery images={product.images} />
      <ProductInfo product={product} />
    </div>
  );
}
