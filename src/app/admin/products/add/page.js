"use client";

import { useState, useEffect } from "react";
import adminApiService from "@/lib/adminApiService";
import usePopupStore from "@/store/popupStore";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    stock: "",
    categories: [],
    sizes: "",
    colors: "",
    tags: "",
    discountPrice: "",
    isFeatured: false,
    isActive: true,
    images: [],
  });

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
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setFormData((prev) => ({ ...prev, images: files }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      for (const key in formData) {
        if (key === "images") {
          for (const file of formData.images) {
            payload.append("images", file);
          }
        } else if (key === "categories") {
          for (const catId of formData.categories) {
            payload.append("categories", catId);
          }
        } else {
          payload.append(key, formData[key]);
        }
      }
      payload.set(
        "sizes",
        formData.sizes
          .split(",")
          .map((s) => s.trim())
          .join(",")
      );
      payload.set(
        "colors",
        formData.colors
          .split(",")
          .map((c) => c.trim())
          .join(",")
      );
      payload.set(
        "tags",
        formData.tags
          .split(",")
          .map((t) => t.trim())
          .join(",")
      );

      await adminApiService.products.create(payload);
      showSuccess("Product created");
      router.push("/admin/products");
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Title"
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          name="slug"
          placeholder="Slug"
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          name="price"
          placeholder="Price"
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          name="stock"
          placeholder="Stock"
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <label className="block font-semibold">Categories</label>
        <select
          multiple
          name="categories"
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              categories: Array.from(e.target.selectedOptions, (o) => o.value),
            }))
          }
          className="border p-2 w-full"
        >
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          name="sizes"
          placeholder="Sizes (comma separated)"
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          name="colors"
          placeholder="Colors (comma separated)"
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          name="tags"
          placeholder="Tags (comma separated)"
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          name="discountPrice"
          placeholder="Discount Price (optional)"
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <label className="block">
          <input type="checkbox" name="isFeatured" onChange={handleChange} />{" "}
          Featured
        </label>
        <label className="block">
          <input
            type="checkbox"
            name="isActive"
            onChange={handleChange}
            checked={formData.isActive}
          />{" "}
          Active
        </label>

        <input
          type="file"
          name="images"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Product
        </button>
      </form>
    </div>
  );
}
