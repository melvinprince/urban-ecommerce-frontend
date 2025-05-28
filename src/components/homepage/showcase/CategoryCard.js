"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SvgIcon from "@/components/common/SvgIcon";
import Button from "@/components/common/Button";

export default function CategoryCard({
  category,
  variant = "default", // "default" | "minimal"
}) {
  const base = "group relative block w-full h-full overflow-hidden rounded-xl";
  return (
    <Link href={category.link} className={base}>
      {/* BG */}
      <motion.div
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url(${category.image})` }}
      />
      {/* Overlay */}
      {variant === "default" && (
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 flex flex-col justify-center items-center bg-sgr/30 text-white p-4 backdrop-blur-sm text-center"
        >
          {/* <p className="text-2xl mb-3 line-clamp-2">{category.text}</p> */}
          <Button text={category.button} />
        </motion.div>
      )}

      {/* Title badge (always visible) */}
      <div className="absolute top-3 left-3 bg-sgr text-black text-2xl font-bold px-[2rem] py-[1rem] rounded">
        {category.title}
      </div>
    </Link>
  );
}
