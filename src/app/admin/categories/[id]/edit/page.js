"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import adminApiService from "@/lib/adminApiService";
import usePopupStore from "@/store/popupStore";

export default function EditCategoryPage() {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(null);
  const { showError, showSuccess } = usePopupStore();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes, categoriesRes] = await Promise.all([
          adminApiService.categories.getById(id),
          adminApiService.categories.getAll(),
        ]);
        const cat = categoryRes.data;
        setFormData({
          name: cat.name,
          slug: cat.slug,
          parent: cat.parent?._id || "",
          description: cat.description || "",
          metaTitle: cat.metaTitle || "",
          metaDescription: cat.metaDescription || "",
          image: null,
        });
        setCategories(categoriesRes.data.filter((c) => c._id !== id)); // Avoid self as parent
      } catch (err) {
        showError(err.message);
      }
    };
    fetchData();
  }, [id, showError]);

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
      await adminApiService.categories.update(id, payload);
      showSuccess("Category updated");
      router.push("/admin/categories");
    } catch (err) {
      showError(err.message);
    }
  };

  if (!formData) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Category</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="border p-2 w-full"
        />
        <input
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          placeholder="Slug"
          className="border p-2 w-full"
        />

        <label className="block font-semibold">
          Parent Category (optional)
        </label>
        <select
          name="parent"
          value={formData.parent}
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
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2 w-full"
        />

        <input
          name="metaTitle"
          value={formData.metaTitle}
          onChange={handleChange}
          placeholder="Meta Title (SEO)"
          className="border p-2 w-full"
        />
        <textarea
          name="metaDescription"
          value={formData.metaDescription}
          onChange={handleChange}
          placeholder="Meta Description (SEO)"
          className="border p-2 w-full"
        />

        <label className="block font-semibold">
          Thumbnail Image (optional)
        </label>
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
          Update Category
        </button>
      </form>
    </div>
  );
}
