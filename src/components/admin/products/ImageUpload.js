"use client";

export default function ImageUpload({
  existingImages = [],
  setExistingImages,
  newImages = [],
  setNewImages,
  onDelete,
}) {
  const handleFileChange = (e) => {
    setNewImages(Array.from(e.target.files));
  };

  const handleDelete = (imgUrl) => {
    setExistingImages((prev) => prev.filter((img) => img !== imgUrl));
    if (onDelete) onDelete(imgUrl);
  };

  return (
    <div>
      <label className="block font-semibold">Product Images</label>

      {existingImages.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {existingImages.map((img, idx) => (
            <div key={`${img}-${idx}`} className="relative">
              <img
                src={img}
                alt="Product"
                className="w-24 h-24 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => handleDelete(img)}
                className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded-bl"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="border p-2 w-full mt-2"
      />
    </div>
  );
}
