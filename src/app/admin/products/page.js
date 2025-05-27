"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import adminApiService from "@/lib/adminApiService";
import usePopupStore from "@/store/popupStore";
import useConfirmStore from "@/store/useConfirmStore";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const { showError, showSuccess } = usePopupStore();
  const { openConfirm } = useConfirmStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await adminApiService.products.getAll();
        setProducts(res.data);
      } catch (err) {
        showError(err.message);
      }
    };

    fetchProducts();
  }, [showError]);

  const handleDelete = (id) => {
    openConfirm({
      message: "Are you sure you want to delete this product?",
      onConfirm: async () => {
        try {
          await adminApiService.products.delete(id);
          setProducts(products.filter((p) => p._id !== id));
          showSuccess("Product deleted");
        } catch (err) {
          showError(err.message);
        }
      },
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/admin/products/add"
          className="text-blue-600 font-semibold"
        >
          Add Product
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Stock</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td className="p-2 border">
                  {product.images?.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <span>No image</span>
                  )}
                </td>
                <td className="p-2 border">
                  <a
                    href={`/product/${product.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {product.title}
                  </a>
                </td>
                <td className="p-2 border">${product.price}</td>
                <td className="p-2 border">{product.stock}</td>

                <td className="p-2 border">
                  <Link
                    href={`/admin/products/${product._id}/edit`}
                    className="text-blue-600 mr-2"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td className="p-2 border text-center" colSpan="5">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
