"use client";

import ProductForm from "@/components/admin/products/ProductForm";
import usePopupStore from "@/store/popupStore";
import adminApiService from "@/lib/adminApiService";

export default function AddProductPage() {
  const { showError, showSuccess } = usePopupStore();

  const handleSubmit = async (
    e,
    formData,
    existingImages,
    newImages,
    deletedImages,
    router
  ) => {
    e.preventDefault();
    console.log("Creating product with data:", formData);
    console.log("New images:", newImages);

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

      const res = await adminApiService.products.create(payload);
      showSuccess("Product created");
      router.push("/admin/products");
    } catch (err) {
      console.error("Create error:", err);
      showError(err.message || "Failed to create product");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add Product</h1>
      <ProductForm onSubmit={handleSubmit} mode="create" />
    </div>
  );
}
