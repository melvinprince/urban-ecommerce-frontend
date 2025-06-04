// app/admin/products/add/page.jsx
"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import usePopupStore from "@/store/popupStore";
import AdminProductsPage from "@/components/admin/products/ProductForm";

export default function AddProductPage() {
  const { showError, showSuccess } = usePopupStore();
  const router = useRouter();

  const handleSubmit = async (
    e,
    formData,
    existingImages,
    newImages,
    deletedImages
  ) => {
    e.preventDefault();
    try {
      const payload = new FormData();

      // Append form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "categories") {
          value.forEach((catId) => payload.append("categories", catId));
        } else if (Array.isArray(value)) {
          value.forEach((v) => payload.append(key, v));
        } else {
          payload.append(key, value);
        }
      });

      // Append new images
      newImages.forEach((file) => payload.append("images", file));

      await adminApiService.products.create(payload);
      showSuccess("Product created successfully");
      router.push("/admin/products");
    } catch (err) {
      console.error("Create error:", err);
      showError(err.message || "Failed to create product");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-sgr/50 min-h-screen py-12 px-6 md:px-20"
    >
      <div className="mx-auto bg-white rounded-3xl shadow-lg p-8">
        <h1 className="text-5xl font-eulogy mb-6 text-gray-800">Add Product</h1>
        <AdminProductsPage onSubmit={handleSubmit} mode="create" />
      </div>
    </motion.div>
  );
}
