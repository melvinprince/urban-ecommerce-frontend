"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SvgIcon from "./SvgIcon";

export default function AddToCartButton({ adding, justAdded, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      disabled={adding}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ y: 70 }}
      animate={{ y: 0 }}
      whileHover={{ scale: 1.03 }}
      className="
        flex items-center justify-center gap-2
        absolute bottom-0 right-10 mb-4
        bg-ogr text-white px-10 py-2 rounded-full text-xl
        shadow-lg hover:shadow-xl hover:cursor-pointer transition disabled:opacity-50
      "
    >
      {adding ? "Adding…" : justAdded ? "✓ Added" : "Add to Cart"}

      <SvgIcon src="/svg/add-to-cart.svg" />
    </motion.button>
  );
}
