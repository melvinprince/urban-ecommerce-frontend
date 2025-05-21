"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductGrid from "@/components/products/ProductGrid";
import ProductFilters from "@/components/products/ProductFilters";
import { searchProducts } from "@/lib/api";
import Loader from "@/components/common/Loader";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("q") || "";
  const pageParam = Number(searchParams.get("page") || 1);

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const obj = {};
      searchParams.forEach((v, k) => {
        obj[k] = v;
      });

      const res = await searchProducts(obj);
      setProducts(res?.data?.products || []);
      setTotalPages(res?.data?.pages || 1);
      setLoading(false);
    };
    fetchData();
  }, [searchParams]);

  /* keep pagination when filters stay same */
  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page);
    router.push(`/search?${params.toString()}`);
  };

  // Pagination window logic
  const windowSize = 5;
  const half = Math.floor(windowSize / 2);
  let start = Math.max(1, pageParam - half);
  let end = Math.min(totalPages, start + windowSize - 1);
  if (end - start < windowSize - 1) start = Math.max(1, end - windowSize + 1);

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">
        Search results for "<span className="italic">{query}</span>"
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        <ProductFilters />
        <div className="flex-1">
          {loading ? (
            <Loader text="Loading products..." />
          ) : products.length > 0 ? (
            <>
              <ProductGrid products={products} />
              <div className="flex justify-center mt-8 gap-2 flex-wrap">
                <button
                  onClick={() => handlePageChange(pageParam - 1)}
                  disabled={pageParam <= 1}
                  className="px-3 py-1 rounded bg-gray-200 text-black disabled:opacity-50"
                >
                  Prev
                </button>
                {Array.from({ length: end - start + 1 }, (_, i) => {
                  const pageNum = start + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded ${
                        pageNum === pageParam
                          ? "bg-black text-white"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      {pageNum}
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
            </>
          ) : (
            <p className="text-gray-500">No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
