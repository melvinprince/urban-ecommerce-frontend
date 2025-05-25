"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import ProductGrid from "@/components/products/ProductGrid";
import ProductFilters from "@/components/products/ProductFilters";
import Loader from "@/components/common/Loader";
import apiService from "@/lib/apiService";

export default function CategoryProductsContent() {
  const { slug } = useParams(); // /categories/:slug
  const searchParams = useSearchParams();
  const router = useRouter();

  const pageParam = Number(searchParams.get("page") || 1);

  const [products, setProducts] = useState([]);
  const [totalPages, setTotal] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* fetch whenever slug OR any ?key=value changes */
  useEffect(() => {
    if (!slug) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        // copy current search params → plain object
        const obj = {};
        searchParams.forEach((v, k) => {
          obj[k] = v;
        });

        // add the locked category for backend only
        const res = await apiService.products.getAll({
          ...obj,
          category: slug,
        });
        console.log("Fetched products:", res);

        setProducts(res.data.products || []);
        setTotal(res.meta?.pages || 1); // meta.pages from backend
      } catch (err) {
        setError(err.message || "Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug, searchParams]);

  /* pagination */
  const handlePageChange = (p) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", p);
    router.push(`/categories/${slug}?${params.toString()}`);
  };

  /* windowed buttons */
  const windowSize = 5;
  const half = Math.floor(windowSize / 2);
  let start = Math.max(1, pageParam - half);
  let end = Math.min(totalPages, start + windowSize - 1);
  if (end - start < windowSize - 1) start = Math.max(1, end - windowSize + 1);

  if (loading) return <Loader />;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 capitalize">
        Products in &quot;{slug.replace(/-/g, " ")}&quot;
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* filters without category tree */}
        <ProductFilters showCategory={false} />

        <div className="flex-1">
          <ProductGrid products={products} />

          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2 flex-wrap">
              <button
                onClick={() => handlePageChange(pageParam - 1)}
                disabled={pageParam <= 1}
                className="px-3 py-1 rounded bg-gray-200 text-black disabled:opacity-50"
              >
                Prev
              </button>

              {Array.from({ length: end - start + 1 }, (_, i) => {
                const p = start + i;
                return (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`px-3 py-1 rounded ${
                      p === pageParam
                        ? "bg-black text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(pageParam + 1)}
                disabled={pageParam >= totalPages}
                className="px-3 py-1 rounded bg-gray-200 text-black disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
