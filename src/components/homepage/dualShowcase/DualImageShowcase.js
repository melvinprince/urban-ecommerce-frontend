"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import clsx from "clsx";
import CarouselBlock from "./CarouselBlock";
import SideImageBlock from "./SideImageBlock";

/* ---------- tiny tunables (visual only) ---------- */
const TILT_DEG = 4; // max tilt each axis
const SPRING = { type: "spring", stiffness: 200, damping: 18 };

export default function DualImageShowcase({
  carouselData = [],
  sideData = null,
  autoPlay = true,
  interval = 5000,
  reverse = false,
  className = "",
}) {
  if (!carouselData.length || !sideData) {
    throw new Error(
      "Provide at least one carouselData item and one sideData object"
    );
  }

  /* --------- basic slideshow state --------- */
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!autoPlay) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % carouselData.length),
      interval
    );
    return () => clearInterval(id);
  }, [autoPlay, interval, carouselData.length]);

  const next = () => setIndex((i) => (i + 1) % carouselData.length);
  const prev = () =>
    setIndex((i) => (i === 0 ? carouselData.length - 1 : i - 1));

  /* --------- hover-tilt logic (visual only) --------- */
  const wrapperRef = useRef(null);
  const mx = useMotionValue(0.5); // cursor position (0–1)
  const my = useMotionValue(0.5);

  const rX = useTransform(my, [0, 1], [+TILT_DEG, -TILT_DEG]);
  const rY = useTransform(mx, [0, 1], [-TILT_DEG, +TILT_DEG]);

  const handleMove = (e) => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <motion.div
      ref={wrapperRef}
      style={{ rotateX: rX, rotateY: rY, perspective: 1000 }}
      transition={SPRING}
      onMouseMove={handleMove}
      className={clsx(
        "flex w-full h-[40vh] gap-[3rem]", // 🔸 unchanged layout / size
        reverse ? "flex-row-reverse" : "flex-row",
        className
      )}
    >
      {/* -------------- carousel -------------- */}
      <CarouselBlock
        data={carouselData}
        index={index}
        next={next}
        prev={prev}
        animation="parallax" /* new prop → deeper slide fx */
      />

      {/* -------------- side banner ---------- */}
      <SideImageBlock data={sideData} />
    </motion.div>
  );
}
