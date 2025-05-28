"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CategoryCard({ category }) {
  return (
    <Link
      href={category.link}
      className="group relative block w-[50rem] h-[50rem] overflow-hidden rounded-xl"
    >
      {/* Background Image */}
      <motion.div
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url(${category.image})` }}
      />

      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
        whileHover={{ opacity: 1, backdropFilter: "blur(8px)" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center text-white p-4"
      >
        <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
        <p className="text-sm mb-4">{category.text}</p>
        <button className="bg-white text-black text-sm font-bold py-2 px-4 rounded-full flex items-center gap-2 group-hover:scale-105 transition-transform">
          {category.button} <ArrowRight size={16} />
        </button>
      </motion.div>

      {/* Category Name on Top */}
      <div className="absolute top-4 left-4 z-10 text-white text-lg font-bold bg-black/60 px-3 py-1 rounded">
        {category.title}
      </div>
    </Link>
  );
}
