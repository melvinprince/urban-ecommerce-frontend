// components/admin/products/ProductForm.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X, PlusCircle } from "lucide-react";
import usePopupStore from "@/store/popupStore";
import adminApiService from "@/lib/adminApiService";
import Image from "next/image";
import SeoFields from "./SeoFields";
import SizeColorInput from "./SizeColorInput";

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
  const fileInputRef = useRef(null);

  const { showError } = usePopupStore();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await adminApiService.categories.getAll();
        setCategories(data);
      } catch (err) {
        showError(err.message);
      }
    })();
  }, [showError]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCategoryToggle = (id) => {
    setFormData((prev) => {
      const arr = [...prev.categories];
      const idx = arr.indexOf(id);
      if (idx === -1) arr.push(id);
      else arr.splice(idx, 1);
      return { ...prev, categories: arr };
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5 - newImages.length);
    setNewImages((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <motion.form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e, formData, existingImages, newImages, deletedImages);
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Title & Slug */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col">
          <label className="mb-1 text-2xl font-medium text-gray-700">
            Title
          </label>
          <input
            name="title"
            placeholder="Product Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="rounded-lg text-2xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-2xl font-medium text-gray-700">
            Slug
          </label>
          <input
            name="slug"
            placeholder="product-slug"
            value={formData.slug}
            onChange={handleChange}
            required
            className="rounded-lg text-2xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col">
        <label className="mb-1 text-2xl font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          placeholder="Product Description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className="rounded-lg text-2xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>

      {/* Price & Stock */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col">
          <label className="mb-1 text-2xl font-medium text-gray-700">
            Price (QAR)
          </label>
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 199.99"
            value={formData.price}
            onChange={handleChange}
            required
            className="rounded-lg text-2xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-2xl font-medium text-gray-700">
            Stock
          </label>
          <input
            name="stock"
            type="number"
            min="0"
            placeholder="e.g. 50"
            value={formData.stock}
            onChange={handleChange}
            required
            className="rounded-lg text-2xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-col">
        <label className="mb-1 text-4xl font-medium text-gray-700">
          Categories
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat._id}
              type="button"
              onClick={() => handleCategoryToggle(cat._id)}
              className={`px-3 py-1 rounded-full text-xl font-medium transition ${
                formData.categories.includes(cat._id)
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sizes & Colors */}
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

      {/* Tags & Discount Price */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col">
          <label className="mb-1 text-2xl font-medium text-gray-700">
            Tags (comma separated)
          </label>
          <input
            name="tags"
            placeholder="e.g. summer,new-arrival"
            value={formData.tags}
            onChange={handleChange}
            className="rounded-lg text-2xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-2xl font-medium text-gray-700">
            Discount Price
          </label>
          <input
            name="discountPrice"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 149.99"
            value={formData.discountPrice}
            onChange={handleChange}
            className="rounded-lg text-2xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Featured & Active checkboxes */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleChange}
            className="h-5 w-5 accent-indigo-600"
          />
          <span className="font-medium text-gray-700">Featured</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-5 w-5 accent-indigo-600"
          />
          <span className="font-medium text-gray-700">Active</span>
        </label>
      </div>

      {/* SEO Fields */}
      <SeoFields formData={formData} setFormData={setFormData} />

      {/* Image Upload */}
      <div className="flex flex-col">
        <label className="mb-1 text-2xl font-medium text-gray-700">
          Images (max 5)
        </label>
        <div
          className="flex flex-wrap gap-4 border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:border-indigo-500 transition"
          onClick={() => fileInputRef.current.click()}
        >
          {existingImages.map((img, idx) => (
            <div
              key={idx}
              className="relative w-24 h-24 rounded-lg overflow-hidden shadow-sm"
            >
              <Image src={img} alt="Existing" fill className="object-cover" />
              <button
                type="button"
                onClick={() => {
                  setDeletedImages((prev) => [...prev, img]);
                  setExistingImages((prev) => prev.filter((_, i) => i !== idx));
                }}
                className="absolute top-1 right-1 bg-white rounded-full p-1 hover:bg-gray-100"
              >
                <X size={12} />
              </button>
            </div>
          ))}

          {newImages.map((file, idx) => (
            <div
              key={idx}
              className="relative w-24 h-24 rounded-lg overflow-hidden shadow-sm"
            >
              <Image
                src={URL.createObjectURL(file)}
                alt="Preview"
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
              <button
                type="button"
                onClick={() => removeNewImage(idx)}
                className="absolute top-1 right-1 bg-white rounded-full p-1 hover:bg-gray-100"
              >
                <X size={12} />
              </button>
            </div>
          ))}

          {existingImages.length + newImages.length < 5 && (
            <div className="flex w-24 h-24 items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition">
              <PlusCircle size={32} className="text-gray-500" />
            </div>
          )}
          <input
            type="file"
            multiple
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Click or drag & drop images
        </p>
      </div>

      {/* Submit */}
      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 transition shadow-md"
        >
          {mode === "create" ? "Create Product" : "Update Product"}
        </button>
      </div>
    </motion.form>
  );
}
