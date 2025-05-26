"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import adminApiService from "@/lib/adminApiService";
import usePopupStore from "@/store/popupStore";

export default function EditProductPage() {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState(null);
  const { showError, showSuccess } = usePopupStore();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoriesRes] = await Promise.all([
          adminApiService.products.getById(id),
          adminApiService.categories.getAll(),
        ]);
        setProduct(productRes.data);
        setCategories(categoriesRes.data);
        setFormData({
          title: productRes.data.title,
          slug: productRes.data.slug,
          description: productRes.data.description,
          price: productRes.data.price,
          stock: productRes.data.stock,
          categories: productRes.data.categories.map((c) => c._id),
          sizes: productRes.data.sizes.join(", "),
          colors: productRes.data.colors.join(", "),
          tags: productRes.data.tags.join(", "),
          discountPrice: productRes.data.discountPrice || "",
          isFeatured: productRes.data.isFeatured,
          isActive: productRes.data.isActive,
          images: [],
        });
      } catch (err) {
        showError(err.message);
      }
    };
    fetchData();
  }, [id, showError]);

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

      await adminApiService.products.update(id, payload);
      showSuccess("Product updated");
      router.push("/admin/products");
    } catch (err) {
      showError(err.message);
    }
  };

  if (!formData) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="border p-2 w-full"
        />
        <input
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          placeholder="Slug"
          className="border p-2 w-full"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2 w-full"
        />
        <input
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          className="border p-2 w-full"
        />
        <input
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          placeholder="Stock"
          className="border p-2 w-full"
        />

        <label className="block font-semibold">Categories</label>
        <select
          multiple
          name="categories"
          value={formData.categories}
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
          value={formData.sizes}
          onChange={handleChange}
          placeholder="Sizes (comma separated)"
          className="border p-2 w-full"
        />
        <input
          name="colors"
          value={formData.colors}
          onChange={handleChange}
          placeholder="Colors (comma separated)"
          className="border p-2 w-full"
        />
        <input
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Tags (comma separated)"
          className="border p-2 w-full"
        />
        <input
          name="discountPrice"
          value={formData.discountPrice}
          onChange={handleChange}
          placeholder="Discount Price"
          className="border p-2 w-full"
        />

        <label className="block">
          <input
            type="checkbox"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleChange}
          />{" "}
          Featured
        </label>
        <label className="block">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
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
          Update Product
        </button>
      </form>
    </div>
  );
}
