"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Button from "@/components/common/Button";

/* -------------------------------------------------------------
 * Helper: calculates cursor x,y in % of card for spotlight mask
 * ----------------------------------------------------------- */
function useSpotlight(ref) {
  const x = useMotionValue(50);
  const y = useMotionValue(50);

  function handleMove(e) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    x.set(px);
    y.set(py);
  }
  return { x, y, handleMove };
}

export default function CategoryCard({
  category,
  variant = "default", // "default" | "minimal"
}) {
  const cardRef = useRef(null);
  const { x, y, handleMove } = useSpotlight(cardRef);

  /* -- spotlight mask follows cursor -------------------------------- */
  const mask = useTransform(
    [x, y],
    ([latestX, latestY]) =>
      `radial-gradient(ellipse at ${latestX}% ${latestY}%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 50%)`
  );

  const rootClasses =
    "relative block w-full h-full overflow-hidden rounded-xl cursor-pointer";

  return (
    <motion.div
      ref={cardRef}
      className={rootClasses}
      initial="rest"
      animate="rest"
      whileHover="hover"
      onMouseMove={handleMove}
      style={{ perspective: 1000 }} // enables 3-D tilt
      variants={{
        rest: {
          y: 0,
          rotateX: 0,
          rotateY: 0,
          boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
        },
        hover: {
          y: -12,
          rotateX: 6,
          rotateY: -6,
          boxShadow: "0 22px 42px rgba(0,0,0,0.30)",
          transition: { type: "spring", stiffness: 220, damping: 18 },
        },
      }}
    >
      <Link href={category.link} className="block w-full h-full relative">
        {/* ----- BACKGROUND IMAGE ----- */}
        <motion.div
          variants={{
            rest: { scale: 1 },
            hover: { scale: 1.12, transition: { duration: 0.6 } },
          }}
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url(${category.image})` }}
        />

        {/* ----- SPOTLIGHT MASK (cursor-follow) ----- */}
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ WebkitMaskImage: mask, maskImage: mask }}
        />

        {/* ----- GRADIENT BORDER GLOW ----- */}
        <motion.div
          variants={{
            rest: { opacity: 0 },
            hover: { opacity: 1, transition: { duration: 0.5 } },
          }}
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            boxShadow:
              "0 0 0 2px transparent, 0 0 20px 6px rgba(255,255,255,0.4) inset",
          }}
        />

        {/* ----- OVERLAY (only in default variant) ----- */}
        {variant === "default" && (
          <motion.div
            variants={{
              rest: { opacity: 0, y: 20 },
              hover: {
                opacity: 1,
                y: 0,
                transition: { delay: 0.15, duration: 0.45 },
              },
            }}
            className="absolute inset-0 flex flex-col items-center justify-center text-white text-center bg-black/40 backdrop-blur-sm px-4"
          >
            <p className="text-3xl mb-3 font-bold">{category.text}</p>
            <Button text={category.button} />
          </motion.div>
        )}

        <motion.div
          variants={{
            rest: {
              y: 0,
              scale: 1,
              backgroundPosition: "0% 50%", // ← for shimmer
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            },
            hover: {
              y: -10, // stronger lift
              scale: 1.12, // gentle pop
              backgroundPosition: "100% 50%", // shimmer sweeps across
              boxShadow: "0 12px 28px rgba(0,0,0,0.30)",
              transition: {
                y: { type: "spring", stiffness: 260, damping: 20 },
                scale: { type: "spring", stiffness: 260, damping: 20 },
                backgroundPosition: { duration: 0.8, ease: "easeInOut" },
              },
            },
          }}
          /* shimmering white-to-gray gradient */
          style={{
            background:
              "linear-gradient(120deg, rgba(255,255,255,0.95) 0%, rgba(245,245,245,0.95) 50%, rgba(255,255,255,0.95) 100%)",
            backgroundSize: "200% 200%",
          }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] rounded-b-xl flex items-center justify-center text-black text-3xl font-bold px-10 py-6"
        >
          {category.title}
        </motion.div>
      </Link>
    </motion.div>
  );
}
