"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
        if (formData[key]) payload.append(key, formData[key]);
      }
      await adminApiService.categories.create(payload);
      showSuccess("Category created");
      router.push("/admin/categories");
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add Category</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          name="slug"
          placeholder="Slug"
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <label className="block font-semibold">
          Parent Category (optional)
        </label>
        <select
          name="parent"
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value="">-- None --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="metaTitle"
          placeholder="Meta Title (SEO)"
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <textarea
          name="metaDescription"
          placeholder="Meta Description (SEO)"
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <label className="block font-semibold">Thumbnail Image</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Category
        </button>
      </form>
    </div>
  );
}
