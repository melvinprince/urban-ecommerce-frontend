// app/admin/products/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import ProductForm from "@/components/admin/products/ProductForm";
import ReviewSection from "@/components/admin/products/ReviewSection";
import adminApiService from "@/lib/adminApiService";
import usePopupStore from "@/store/popupStore";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [initialData, setInitialData] = useState(null);
  const { showError, showSuccess } = usePopupStore();

  useEffect(() => {
    (async () => {
      try {
        const res = await adminApiService.products.getById(id);
        const product = res.data;
        setInitialData({
          title: product.title,
          slug: product.slug,
          description: product.description,
          price: product.price,
          stock: product.stock,
          categories: product.categories.map((c) => c._id),
          sizes: product.sizes,
          colors: product.colors,
          tags: product.tags.join(", "),
          discountPrice: product.discountPrice || "",
          isFeatured: product.isFeatured,
          isActive: product.isActive,
          images: product.images || [],
          seoTitle: product.seoTitle || "",
          seoDescription: product.seoDescription || "",
          seoKeywords: product.seoKeywords || "",
        });
      } catch (err) {
        showError(err.message);
      }
    })();
  }, [id, showError]);

  const handleSubmit = async (
    e,
    formData,
    existingImages,
    newImages,
    deletedImages
  ) => {
    e.preventDefault();
    deletedImages = deletedImages || [];

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "categories") {
          value.forEach((catId) => payload.append("categories", catId));
        } else if (Array.isArray(value)) {
          value.forEach((v) => payload.append(key, v));
        } else {
          payload.append(key, value);
        }
      });

      newImages.forEach((file) => payload.append("images", file));
      deletedImages.forEach((img) => payload.append("deletedImages", img));

      await adminApiService.products.update(id, payload);
      showSuccess("Product updated");
      router.push("/admin/products");
    } catch (err) {
      showError(err.message);
    }
  };

  if (!initialData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sgr/50">
        <p className="text-xl text-gray-600">Loading product...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-sgr/50 min-h-screen py-12 px-6 md:px-20"
    >
      <div className="mx-auto bg-white rounded-3xl shadow-lg p-10 space-y-8">
        <h1 className="text-3xl font-eulogy text-gray-800">Edit Product</h1>

        <ProductForm
          initialData={initialData}
          onSubmit={handleSubmit}
          mode="edit"
        />

        <ReviewSection productId={id} />
      </div>
    </motion.div>
  );
}
