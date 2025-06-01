"use client";

import { motion } from "framer-motion";

export default function ProductGallery({ images }) {
  if (!images || images.length === 0) {
    return (
      <div className="w-full bg-gray-100 rounded-lg aspect-square flex items-center justify-center">
        <span className="text-gray-400">No images available</span>
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col gap-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
      }}
    >
      {/* Main image */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-full bg-gray-100 rounded-3xl overflow-hidden aspect-square cursor-zoom-in"
      >
        <img
          src={images[0]}
          alt="Main product image"
          className="object-cover w-full h-full"
        />
      </motion.div>

      {/* Thumbnails if more images */}
      {images.length > 1 && (
        <div className="flex flex-wrap gap-3">
          {images.slice(1).map((img, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 250 }}
              className="w-[48%] bg-gray-100 rounded-xl overflow-hidden aspect-square cursor-pointer"
            >
              <img
                src={img}
                alt={`Product thumbnail ${index + 2}`}
                className="object-cover w-full h-full"
              />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
