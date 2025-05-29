"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef } from "react";
import Button from "@/components/common/Button";
import Image from "next/image";
import Link from "next/link";

/* ---------- tune here ---------- */
const TILT = 6;
const ZOOM = 1.12;
const SPRING = { type: "spring", stiffness: 220, damping: 18 };

/* parent variants */
const card = {
  rest: { scale: 1, boxShadow: "0 8px 18px rgba(0,0,0,0.15)" },
  hover: {
    scale: 1.03,
    boxShadow: "0 18px 32px rgba(0,0,0,0.25)",
    transition: SPRING,
  },
};

/* overlay variants */
const overlay = {
  rest: { y: "100%", opacity: 0 },
  hover: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/* button pop */
const btnWrap = {
  rest: { scale: 0.8, opacity: 0 },
  hover: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut", delay: 0.1 },
  },
};

export default function AccessoriesImage({
  link = "",
  image,
  alt,
  button,
  className = "",
}) {
  const ref = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rX = useTransform(my, [0, 1], [+TILT, -TILT]);
  const rY = useTransform(mx, [0, 1], [-TILT, +TILT]);

  const handleMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <motion.div
      ref={ref}
      variants={card}
      initial="rest"
      whileHover="hover"
      onMouseMove={handleMove}
      style={{ rotateX: rX, rotateY: rY, perspective: 1000 }}
      className={`relative w-full h-full overflow-hidden rounded-lg shadow-2xl ${className}`}
    >
      <Link href={link || "#"} className="block w-full h-full">
        {/* image with Ken-Burns */}
        <motion.div
          initial={{ scale: 1 }}
          whileHover={{ scale: ZOOM }}
          transition={{ duration: 1.2, ease: [0.25, 0.9, 0.3, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={image}
            alt={alt}
            fill
            className="object-cover object-bottom"
            priority
          />
        </motion.div>

        {/* overlay & button */}
        {button && (
          <motion.div
            variants={overlay}
            className="absolute inset-0 flex items-center justify-center
                       bg-gradient-to-t from-black/60 via-black/40 to-transparent
                       backdrop-blur-sm z-10"
          >
            <motion.div variants={btnWrap}>
              <Button text={button} />
            </motion.div>
          </motion.div>
        )}
      </Link>
    </motion.div>
  );
}
