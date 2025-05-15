"use client";

export default function ProductGallery({ images }) {
  if (!images || images.length === 0) {
    return (
      <div className="w-full bg-gray-100 rounded-lg aspect-square flex items-center justify-center">
        <span className="text-gray-400">No images available</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="w-full bg-gray-100 rounded-lg overflow-hidden aspect-square">
        <img
          src={images[0]}
          alt="Main product image"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Thumbnails if more images */}
      {images.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {images.slice(1).map((img, index) => (
            <div
              key={index}
              className="w-1/2 bg-gray-100 rounded-lg overflow-hidden aspect-square"
            >
              <img
                src={img}
                alt={`Product thumbnail ${index + 2}`}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
