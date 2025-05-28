"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Button from "@/components/common/Button";

/* -------------------------------------------
 * Animation variants (centralised for tweaks)
 * ----------------------------------------- */
const card = {
  rest: {
    y: 0,
    rotateX: 0,
    rotateY: 0,
    boxShadow: "0 8px 18px rgba(0,0,0,0.15)",
  },
  hover: {
    y: -10,
    rotateX: 4,
    rotateY: -4,
    boxShadow: "0 18px 36px rgba(0,0,0,0.28)",
    transition: { type: "spring", stiffness: 220, damping: 20 },
  },
};

const img = {
  rest: { y: "0%", scale: 1 },
  hover: {
    y: "-40%",
    scale: 1.15,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const wipe = {
  rest: {
    clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
    opacity: 0,
  },
  hover: {
    clipPath: "polygon(0 60%, 100% 30%, 100% 100%, 0 100%)",
    opacity: 0.35,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const textBox = {
  rest: { y: "100%", opacity: 0 },
  hover: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.7, ease: "easeOut", delay: 0.05 },
  },
};

export default function SideImageBlock({ data }) {
  return (
    <motion.div
      variants={card}
      initial="rest"
      animate="rest"
      whileHover="hover"
      className="relative w-1/3 hidden md:block overflow-hidden border rounded-[25px] shadow-2xl"
      style={{ perspective: 1200 }}
    >
      <Link href={data.link} className="block w-full h-full relative">
        {/* -------- Background image with parallax lift -------- */}
        <motion.div variants={img} className="absolute inset-0">
          <Image
            src={data.image}
            alt={data.text || "side"}
            fill
            sizes="33vw"
            className="object-cover"
            priority
          />
        </motion.div>

        {/* --------- Diagonal glassy wipe overlay ---------- */}
        <motion.div
          variants={wipe}
          className="absolute inset-0 bg-white backdrop-blur-sm pointer-events-none"
        />

        {/* --------- Text + Button block ---------- */}
        <motion.div
          variants={textBox}
          className="absolute bottom-0 left-0 right-0 bg-ogr/90 text-white p-6 flex flex-col items-center justify-center space-y-3 z-10"
        >
          {data.text && (
            <p className="text-2xl leading-snug font-semibold text-center drop-shadow-sm">
              {data.text}
            </p>
          )}
          {data.button && <Button text={data.button} />}
        </motion.div>
      </Link>
    </motion.div>
  );
}
