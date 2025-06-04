// app/admin/products/page.jsx
"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Pencil, Trash2, Plus } from "lucide-react";
import Image from "next/image";
import adminApiService from "@/lib/adminApiService";
import usePopupStore from "@/store/popupStore";
import useConfirmStore from "@/store/useConfirmStore";
import AdminSearchBar from "@/components/admin/products/AdminSearchBar";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const { showError, showSuccess } = usePopupStore();
  const { openConfirm } = useConfirmStore();

  /* Fetch products once */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await adminApiService.products.getAll();
        setProducts(data);
      } catch (err) {
        showError(err.message);
      }
    })();
  }, [showError]);

  /* Delete handler */
  const handleDelete = useCallback(
    (id) =>
      openConfirm({
        message: "Delete this product?",
        onConfirm: async () => {
          try {
            await adminApiService.products.delete(id);
            setProducts((p) => p.filter((x) => x._id !== id));
            showSuccess("Product deleted");
          } catch (err) {
            showError(err.message);
          }
        },
      }),
    [openConfirm, showError, showSuccess]
  );

  /* Filtered list based on search query */
  const filtered = useMemo(() => {
    if (!query) return products;
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q))
    );
  }, [products, query]);

  return (
    <div>
      {/* Header with search and add button */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-eulogy text-gray-800">Products</h1>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-5 w-full sm:w-auto">
          <AdminSearchBar onSearch={setQuery} />
          <Link
            href="/admin/products/add"
            className="mt-3 sm:mt-0 inline-flex items-center gap-2 rounded-full
                       bg-sgr hover:bg-ogr text-white px-[2rem] py-[1rem] w-[20rem]
                       transition shadow-md text-2xl"
          >
            <Plus size={18} /> Add Product
          </Link>
        </div>
      </div>

      {/* Product grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((p, i) => (
          <motion.div
            key={p._id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="relative rounded-3xl overflow-hidden shadow-lg bg-white group hover:shadow-2xl transition"
          >
            {/* Image container */}
            <div className="relative h-40 w-full bg-gray-100">
              {p.images?.[0] ? (
                <Image
                  src={p.images[0]}
                  alt={p.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>

            {/* Body */}
            <div className="p-5 space-y-2">
              <h2 className="text-2xl font-semibold line-clamp-2 text-gray-800">
                {p.title}
              </h2>
              {p.sku && <p className="text-lg text-gray-500">SKU: {p.sku}</p>}

              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">
                  QAR {p.price.toFixed(2)}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-lg font-medium ${
                    p.stock > 5
                      ? "bg-emerald-100 text-emerald-700"
                      : p.stock > 0
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {p.stock} in stock
                </span>
              </div>
            </div>

            {/* Overlay actions */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">
              <Link
                href={`/admin/products/${p._id}/edit`}
                className="p-3 bg-white rounded-full hover:bg-gray-100 transition-shadow shadow-sm"
              >
                <Pencil size={18} className="text-gray-700" />
              </Link>
              <button
                onClick={() => handleDelete(p._id)}
                className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-shadow shadow-sm"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-10">
            Nothing matches “{query}”.
          </div>
        )}
      </div>
    </div>
  );
}
