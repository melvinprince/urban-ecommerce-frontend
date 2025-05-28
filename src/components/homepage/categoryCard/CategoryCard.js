"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Button from "@/components/common/Button";

/* -----------------------------------------------------------
 * New animation variants
 * --------------------------------------------------------- */
const cardVariants = {
  rest: {
    y: 0,
    rotateX: 0,
    rotateY: 0,
    boxShadow: "0 8px 18px rgba(0,0,0,0.15)",
  },
  hover: {
    y: -12,
    // subtle parallax tilt
    rotateX: 5,
    rotateY: -5,
    boxShadow: "0 18px 36px rgba(0,0,0,0.25)",
    transition: { type: "spring", stiffness: 220, damping: 18 },
  },
};

const bgVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.15,
    rotate: -2,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const overlayVariants = {
  rest: { clipPath: "inset(100% 0 0 0)", opacity: 0 },
  hover: {
    clipPath: "inset(0% 0 0 0)",
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const contentVariants = {
  rest: { y: 25, opacity: 0 },
  hover: {
    y: 0,
    opacity: 1,
    transition: { delay: 0.15, duration: 0.5, ease: "easeOut" },
  },
};

const titleVariants = {
  rest: { y: 0, backgroundColor: "rgba(255,255,255,0.9)" },
  hover: {
    y: -8,
    backgroundColor: "rgba(255,255,255,1)",
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

export default function CategoryCard({ category }) {
  return (
    <motion.div
      variants={cardVariants}
      initial="rest"
      animate="rest"
      whileHover="hover"
      className="relative w-auto h-[70rem] rounded-xl overflow-hidden cursor-pointer"
      style={{ perspective: 1200 }} /* enables 3-D tilt */
    >
      <Link href={category.link} className="block w-full h-full">
        {/* ----------- Background image ----------- */}
        <motion.div
          variants={bgVariants}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${category.image})` }}
        />

        {/* ----------- Gradient wipe overlay ----------- */}
        <motion.div
          variants={overlayVariants}
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"
        />

        {/* ----------- Centered text + button ----------- */}
        <motion.div
          variants={contentVariants}
          className="absolute inset-0 flex flex-col items-center justify-center text-white px-6 text-center pointer-events-none"
        >
          <p className="text-3xl md:text-4xl font-semibold mb-4 drop-shadow-lg">
            {category.text}
          </p>
          {category.button && <Button text={category.button} />}
        </motion.div>

        {/* ----------- Sliding title bar ----------- */}
        <motion.div
          variants={titleVariants}
          className="absolute bottom-0 left-0 w-full z-10 text-black text-5xl font-bold px-3 py-1 flex items-center justify-center"
          style={{
            backdropFilter: "blur(4px)",
            borderTopLeftRadius: "0.75rem",
            borderTopRightRadius: "0.75rem",
          }}
        >
          <h3>{category.title}</h3>
        </motion.div>
      </Link>
    </motion.div>
  );
}
