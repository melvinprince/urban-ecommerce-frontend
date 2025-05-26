"use client";

import { useState, useEffect } from "react";
import ProductForm from "@/components/admin/products/ProductForm";
import adminApiService from "@/lib/adminApiService";
import usePopupStore from "@/store/popupStore";
import { useParams } from "next/navigation";
import ReviewSection from "@/components/admin/products/ReviewSection";

export default function EditProductPage() {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const { showError, showSuccess } = usePopupStore();

  useEffect(() => {
    const fetchProduct = async () => {
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
    };
    fetchProduct();
  }, [id, showError]);

  const handleSubmit = async (
    e,
    formData,
    existingImages,
    newImages,
    deletedImages,
    router
  ) => {
    deletedImages = deletedImages || [];

    console.log("---- handleSubmit called ----");
    console.log("formData:", formData);
    console.log("existingImages:", existingImages);
    console.log("newImages:", newImages);
    console.log("deletedImages (raw):", deletedImages);

    try {
      const payload = new FormData();

      for (const key in formData) {
        if (key === "categories") {
          for (const catId of formData.categories) {
            payload.append("categories", catId);
          }
        } else if (Array.isArray(formData[key])) {
          for (const item of formData[key]) {
            payload.append(key, item);
          }
        } else {
          payload.append(key, formData[key]);
        }
      }

      for (const file of newImages) {
        payload.append("images", file);
      }

      for (const img of deletedImages) {
        console.log("Appending deleted image:", img);
        payload.append("deletedImages", img);
      }

      console.log("Final payload ready - sending to backend...");

      await adminApiService.products.update(id, payload);
      showSuccess("Product updated");
      router.push("/admin/products");
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      showError(err.message);
    }
  };

  if (!initialData) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <ProductForm
        initialData={initialData}
        onSubmit={handleSubmit}
        mode="edit"
      />
      <ReviewSection productId={id} />
    </div>
  );
}
