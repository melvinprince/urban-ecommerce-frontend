// File: app/admin/categories/page.jsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import adminApiService from "@/lib/adminApiService";
import usePopupStore from "@/store/popupStore";
import useConfirmStore from "@/store/useConfirmStore";
import buildCategoryTree from "@/components/admin/categories/helpers";
import CategoryAccordionList from "@/components/admin/categories/CategoryAccordionList";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const { showError, showSuccess } = usePopupStore();
  const { openConfirm } = useConfirmStore();

  useEffect(() => {
    (async () => {
      try {
        const res = await adminApiService.categories.getAll();

        // Assume res.data is an array of category objects, each with at least:
        // { _id, name, parent (or parentId), ... }
        setCategories(res.data);
      } catch (err) {
        showError(err.message);
      }
    })();
  }, [showError]);

  const handleDelete = (id) => {
    openConfirm({
      message: "Delete this category?",
      onConfirm: async () => {
        try {
          await adminApiService.categories.delete(id);
          setCategories((prev) => prev.filter((c) => c._id !== id));
          showSuccess("Category deleted");
        } catch (err) {
          showError(err.message);
        }
      },
    });
  };

  // Build a nested tree from the flat array
  const tree = buildCategoryTree(categories);

  return (
    <div className="bg-sgr/50 min-h-screen py-12 px-6 md:px-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto bg-white rounded-3xl shadow-lg p-8"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-eulogy text-gray-800">Categories</h1>
          <Link
            href="/admin/categories/add"
            className="inline-flex items-center gap-2 bg-sgr hover:bg-ogr text-white px-5 py-3 rounded-full transition text-xl"
          >
            + Add Category
          </Link>
        </div>

        {/* Pass the nested tree into CategoryAccordionList */}
        <CategoryAccordionList categories={tree} onDelete={handleDelete} />
      </motion.div>
    </div>
  );
}
