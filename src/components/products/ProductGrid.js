"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/products/ProductCard";
import SvgIcon from "@/components/common/SvgIcon";

export default function ProductGrid({ products }) {
  const safeProducts = Array.isArray(products) ? products : [];
  const itemsPerPage = 5;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev + 1 <= safeProducts.length - itemsPerPage ? prev + 1 : 0
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev - 1 >= 0 ? prev - 1 : Math.max(safeProducts.length - itemsPerPage, 0)
    );
  };

  if (safeProducts.length === 0) {
    return <p className="text-center py-10">No products found.</p>;
  }

  return (
    <div className="w-full flex items-center justify-center relative py-6 overflow-hidden">
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black text-white rounded-[10px] hover:scale-110 transition"
      >
        <SvgIcon src="/svg/angleLeft.svg" width={24} height={24} />
      </button>

      <div className="w-[95%] h-[60vh] overflow-hidden">
        <motion.div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${(100 / itemsPerPage) * currentIndex}%)`,
            width: `${(100 / itemsPerPage) * safeProducts.length}%`,
          }}
        >
          {safeProducts.map((product, index) => (
            <div
              key={product._id || index}
              className="flex-shrink-0 px-4"
              style={{ width: `${100 / safeProducts.length}%` }}
            >
              <div className="w-full h-full">
                <ProductCard product={product} />
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black text-white rounded-[10px] hover:scale-110 transition"
      >
        <SvgIcon src="/svg/angleRight.svg" width={24} height={24} />
      </button>
    </div>
  );
}
