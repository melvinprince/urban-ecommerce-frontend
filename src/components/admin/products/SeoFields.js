// components/admin/products/SeoFields.jsx
"use client";

export default function SeoFields({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="border border-gray-200 rounded-2xl bg-gray-50 p-6 space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">SEO Metadata</h2>

      <div className="space-y-3">
        <div className="flex flex-col">
          <label className="mb-1 text-lg font-medium text-gray-700">
            Meta Title
          </label>
          <input
            name="seoTitle"
            placeholder="Enter meta title"
            value={formData.seoTitle || ""}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-lg font-medium text-gray-700">
            Meta Description
          </label>
          <textarea
            name="seoDescription"
            placeholder="Enter meta description"
            value={formData.seoDescription || ""}
            onChange={handleChange}
            rows="3"
            className="border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-lg font-medium text-gray-700">
            Meta Keywords
          </label>
          <input
            name="seoKeywords"
            placeholder="keyword1, keyword2, keyword3"
            value={formData.seoKeywords || ""}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}
