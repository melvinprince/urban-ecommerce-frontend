"use client";

export default function SeoFields({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="border p-4 rounded bg-gray-50 space-y-4">
      <h2 className="text-lg font-semibold">SEO Metadata</h2>

      <input
        name="seoTitle"
        placeholder="Meta Title"
        value={formData.seoTitle || ""}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <textarea
        name="seoDescription"
        placeholder="Meta Description"
        value={formData.seoDescription || ""}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <input
        name="seoKeywords"
        placeholder="Meta Keywords (comma separated)"
        value={formData.seoKeywords || ""}
        onChange={handleChange}
        className="border p-2 w-full"
      />
    </div>
  );
}
