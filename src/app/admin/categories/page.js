"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import adminApiService from "@/lib/adminApiService";
import usePopupStore from "@/store/popupStore";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const { showError, showSuccess } = usePopupStore();

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

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await adminApiService.categories.delete(id);
      setCategories(categories.filter((c) => c._id !== id));
      showSuccess("Category deleted");
    } catch (err) {
      showError(err.message);
    }
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

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Slug</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id}>
                <td className="p-2 border">{cat.name}</td>
                <td className="p-2 border">{cat.slug}</td>
                <td className="p-2 border">
                  <Link
                    href={`/admin/categories/${cat._id}/edit`}
                    className="text-blue-600 mr-2"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td className="p-2 border text-center" colSpan="3">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
