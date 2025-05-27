"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import adminApiService from "@/lib/adminApiService";
import usePopupStore from "@/store/popupStore";
import useConfirmStore from "@/store/useConfirmStore";
import CategoryTable from "@/components/admin/categories/CategoryTable";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const { showError, showSuccess } = usePopupStore();
  const { openConfirm } = useConfirmStore();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await adminApiService.categories.getAll();
        setCategories(res.data);
      } catch (err) {
        showError(err.message);
      }
    };

    fetchCategories();
  }, [showError]);

  const handleDelete = (id) => {
    openConfirm({
      message: "Are you sure you want to delete this category?",
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Link
          href="/admin/categories/add"
          className="text-blue-600 font-semibold"
        >
          Add Category
        </Link>
      </div>

      <CategoryTable categories={categories} onDelete={handleDelete} />
    </div>
  );
}
