"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/products/ProductCard";
import SvgIcon from "@/components/common/SvgIcon";

export default function ProductGrid({ products, type = "row" }) {
  const safeProducts = Array.isArray(products) ? products : [];
  const itemsPerPage = 5;
  const [currentIndex, setCurrentIndex] = useState(0);

  /* ---------- Handlers for “row” carousel view ---------- */
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

  /* ---------- LIST VIEW: 5-column grid showing all products ---------- */
  if (type === "list") {
    return (
      <div className="w-full px-4 py-6">
        <div className="grid grid-cols-5 gap-6">
          {safeProducts.map((product, idx) => (
            <div key={product._id || idx}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ---------- ROW VIEW (default): sliding carousel of 5 visible items ---------- */
  return (
    <div className="w-full flex items-center justify-center relative overflow-hidden">
      {/* Prev Arrow */}
      <motion.button
        onClick={handlePrev}
        whileHover={{
          rotate: [0, -10, 10, -10, 10, 0],
          transition: { duration: 0.6 },
        }}
        className="
          absolute left-5 top-1/2 -translate-y-1/2 z-20
          bg-ogr text-white w-12 h-12 rounded-full
          flex items-center justify-center shadow-lg
          hover:shadow-xl text-2xl hover:scale-105
          transition-transform duration-500 ease-in-out cursor-pointer
        "
      >
        <SvgIcon src="/svg/angleLeft.svg" width={15} height={15} />
      </motion.button>

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
              <ProductCard product={product} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Next Arrow */}
      <motion.button
        onClick={handleNext}
        whileHover={{
          rotate: [0, -10, 10, -10, 10, 0],
          transition: { duration: 0.6 },
        }}
        className="
          absolute right-5 top-1/2 -translate-y-1/2 z-20
          bg-ogr text-white w-12 h-12 rounded-full
          flex items-center justify-center shadow-lg
          hover:shadow-xl text-2xl hover:scale-105
          transition-transform duration-500 ease-in-out cursor-pointer
        "
      >
        <SvgIcon src="/svg/angleRight.svg" width={15} height={15} />
      </motion.button>
    </div>
  );
}
