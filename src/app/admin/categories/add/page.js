// File: app/admin/categories/add/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import adminApiService from "@/lib/adminApiService";
import usePopupStore from "@/store/popupStore";

export default function AddCategoryPage() {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parent: "",
    description: "",
    metaTitle: "",
    metaDescription: "",
    image: null,
  });
  const [categories, setCategories] = useState([]);
  const { showError, showSuccess } = usePopupStore();
  const router = useRouter();

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      for (const key in formData) {
        if (formData[key]) {
          payload.append(key, formData[key]);
        }
      }
      await adminApiService.categories.create(payload);
      showSuccess("Category created");
      router.push("/admin/categories");
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-sgr/50 min-h-screen py-12 px-6 md:px-20 flex items-center justify-center"
    >
      <div className="mx-auto bg-white rounded-3xl shadow-lg p-8 w-full">
        <h1 className="text-5xl font-eulogy mb-6 text-gray-800">
          Add Category
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-xl font-medium text-gray-700 mb-2"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              placeholder="Category Name"
              onChange={handleChange}
              className="border border-gray-300 rounded-2xl p-3 w-full text-lg focus:outline-none focus:ring-2 focus:ring-sgr"
            />
          </div>

          {/* Slug */}
          <div>
            <label
              htmlFor="slug"
              className="block text-xl font-medium text-gray-700 mb-2"
            >
              Slug
            </label>
            <input
              id="slug"
              name="slug"
              placeholder="category-slug"
              onChange={handleChange}
              className="border border-gray-300 rounded-2xl p-3 w-full text-lg focus:outline-none focus:ring-2 focus:ring-sgr"
            />
          </div>

          {/* Parent Category */}
          <div>
            <label
              htmlFor="parent"
              className="block text-xl font-medium text-gray-700 mb-2"
            >
              Parent Category (optional)
            </label>
            <select
              id="parent"
              name="parent"
              onChange={handleChange}
              className="border border-gray-300 rounded-2xl p-3 w-full text-lg bg-white focus:outline-none focus:ring-2 focus:ring-sgr"
            >
              <option value="">— None —</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-xl font-medium text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Category Description"
              onChange={handleChange}
              rows={4}
              className="border border-gray-300 rounded-2xl p-3 w-full text-lg focus:outline-none focus:ring-2 focus:ring-sgr resize-none"
            />
          </div>

          {/* Meta Title (SEO) */}
          <div>
            <label
              htmlFor="metaTitle"
              className="block text-xl font-medium text-gray-700 mb-2"
            >
              Meta Title (SEO)
            </label>
            <input
              id="metaTitle"
              name="metaTitle"
              placeholder="SEO Meta Title"
              onChange={handleChange}
              className="border border-gray-300 rounded-2xl p-3 w-full text-lg focus:outline-none focus:ring-2 focus:ring-sgr"
            />
          </div>

          {/* Meta Description (SEO) */}
          <div>
            <label
              htmlFor="metaDescription"
              className="block text-xl font-medium text-gray-700 mb-2"
            >
              Meta Description (SEO)
            </label>
            <textarea
              id="metaDescription"
              name="metaDescription"
              placeholder="SEO Meta Description"
              onChange={handleChange}
              rows={3}
              className="border border-gray-300 rounded-2xl p-3 w-full text-lg focus:outline-none focus:ring-2 focus:ring-sgr resize-none"
            />
          </div>

          {/* Thumbnail Image */}
          <div>
            <label
              htmlFor="image"
              className="block text-xl font-medium text-gray-700 mb-2"
            >
              Thumbnail Image
            </label>
            <input
              id="image"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full bg-gray-200 border border-gray-300 rounded-2xl p-3 text-lg focus:outline-none focus:ring-2 focus:ring-sgr file:cursor-pointer file:rounded-full file:border-0 file:bg-sgr file:text-white file:px-4 file:py-2 file:text-sm hover:file:bg-ogr"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-sgr hover:bg-ogr text-white px-5 py-3 rounded-full text-xl transition"
            >
              Create Category
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
