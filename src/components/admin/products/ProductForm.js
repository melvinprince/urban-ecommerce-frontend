"use client";

import { useState, useEffect } from "react";
import SizeColorInput from "./SizeColorInput";
import ImageUpload from "./ImageUpload";
import SeoFields from "./SeoFields";
import usePopupStore from "@/store/popupStore";
import adminApiService from "@/lib/adminApiService";
import { useRouter } from "next/navigation";

export default function ProductForm({
  initialData = {},
  onSubmit,
  mode = "create",
}) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    stock: "",
    categories: [],
    sizes: [],
    colors: [],
    tags: "",
    discountPrice: "",
    isFeatured: false,
    isActive: true,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    ...initialData,
  });

  const [existingImages, setExistingImages] = useState(
    initialData.images || []
  );
  const [newImages, setNewImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);

  const { showError } = usePopupStore();
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
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(
          e,
          formData,
          existingImages,
          newImages,
          deletedImages || [],
          router
        );
      }}
      className="space-y-4"
    >
      <input
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <input
        name="slug"
        placeholder="Slug"
        value={formData.slug}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <input
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <input
        name="stock"
        placeholder="Stock"
        value={formData.stock}
        onChange={handleChange}
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

      <SizeColorInput
        label="Sizes"
        items={formData.sizes}
        setItems={(sizes) => setFormData((prev) => ({ ...prev, sizes }))}
      />
      <SizeColorInput
        label="Colors"
        items={formData.colors}
        setItems={(colors) => setFormData((prev) => ({ ...prev, colors }))}
      />

      <input
        name="tags"
        placeholder="Tags (comma separated)"
        value={formData.tags}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <input
        name="discountPrice"
        placeholder="Discount Price"
        value={formData.discountPrice}
        onChange={handleChange}
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

      <SeoFields formData={formData} setFormData={setFormData} />

      <ImageUpload
        existingImages={existingImages}
        setExistingImages={setExistingImages}
        newImages={newImages}
        setNewImages={setNewImages}
        onDelete={(img) => {
          setDeletedImages((prev) => {
            const updated = Array.isArray(prev) ? [...prev, img] : [img];
            return updated;
          });
        }}
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {mode === "create" ? "Create Product" : "Update Product"}
      </button>
    </form>
  );
}
