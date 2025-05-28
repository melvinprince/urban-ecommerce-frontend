"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SvgIcon from "@/components/common/SvgIcon";

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
          <button className="bg-white text-black text-3xl font-semibold py-[1rem] px-[2rem] rounded-full flex items-center gap-1 group-hover:scale-105 transition-transform duration-300 hover:cursor-pointer">
            {category.button}{" "}
            <motion.span
              whileHover={{
                rotate: [0, 10, -10, 10, -10, 0],
                transition: { duration: 0.6 },
              }}
              className="bg-background rounded-full p-5 ml-5 flex items-center justify-center"
            >
              <SvgIcon
                src="/svg/doubleArrow-right.svg"
                width={15}
                height={15}
              />
            </motion.span>
          </button>
        </motion.div>
      )}

      {/* Title badge (always visible) */}
      <div className="absolute top-3 left-3 bg-sgr text-black text-2xl font-bold px-[2rem] py-[1rem] rounded">
        {category.title}
      </div>
    </Link>
  );
}
