"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import SvgIcon from "@/components/common/SvgIcon";

/* --------------------------------------------
 * Constants for easy tuning
 * ------------------------------------------ */
const SLIDE_DURATION = 0.75; // seconds
const SLIDE_EASE = [0.25, 0.9, 0.3, 1]; // custom cubic-bezier
const KEN_BURNS_SCALE = 1.08; // zoom factor
const ARROW_RIPPLE_MS = 450; // ripple length

export default function ProductCarousel({
  products,
  autoplay = true,
  autoplayDelay = 4000,
  showDots = true,
  showArrows = true,
}) {
  /* ----------------------------------- state */
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  const next = useCallback(
    () => setIndex((i) => (i + 1) % products.length),
    [products.length]
  );
  const prev = useCallback(
    () => setIndex((i) => (i === 0 ? products.length - 1 : i - 1)),
    [products.length]
  );

  /* --------------------------------- autoplay */
  useEffect(() => {
    if (!autoplay) return;
    const kick = () => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(next, autoplayDelay);
    };
    kick();
    return () => clearTimeout(timerRef.current);
  }, [next, autoplay, autoplayDelay, index]);

  const goto = (i) => {
    clearTimeout(timerRef.current);
    setIndex(i);
  };

  /* ----------------------- variants for modern FX */
  const slideVariants = {
    enter: { opacity: 0, x: 120, rotateY: -10, scale: 0.92 },
    center: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      scale: 1,
      transition: { duration: SLIDE_DURATION, ease: SLIDE_EASE },
    },
    exit: {
      opacity: 0,
      x: -120,
      rotateY: 10,
      scale: 0.92,
      transition: { duration: SLIDE_DURATION, ease: SLIDE_EASE },
    },
  };

  const imageVariants = {
    initial: { scale: KEN_BURNS_SCALE },
    animate: {
      scale: 1,
      transition: { duration: autoplayDelay / 1000 + SLIDE_DURATION },
    },
  };

  /* ---------------- render */
  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl select-none">
      {/* ----------- arrows ----------- */}
      {showArrows && (
        <>
          <ArrowButton direction="left" onClick={prev} />
          <ArrowButton direction="right" onClick={next} />
        </>
      )}

      {/* ----------- slide area ----------- */}
      <div className="relative w-full aspect-square perspective-[1200px]">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={index}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 rounded-xl overflow-hidden shadow-xl"
          >
            <Link
              href={products[index].link}
              className="block w-full h-full relative"
            >
              <motion.div
                variants={imageVariants}
                initial="initial"
                animate="animate"
                className="absolute inset-0"
              >
                <Image
                  src={products[index].image}
                  alt={products[index].title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </motion.div>
            </Link>

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.6, ease: SLIDE_EASE }}
              className="absolute bottom-0 w-full
             bg-gradient-to-t from-black/80 via-black/40 to-transparent
             backdrop-blur-sm p-6 flex flex-col gap-2"
            >
              <span className="text-white text-4xl md:text-5xl font-bold leading-tight">
                {products[index].title}
              </span>

              {products[index].subtitle && (
                <span className="text-white/80 text-xl tracking-wide">
                  {products[index].subtitle}
                </span>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ----------- dots ----------- */}
      {showDots && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {products.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => goto(i)}
              className="w-3 h-3 rounded-full bg-white/40"
              animate={
                i === index
                  ? { scale: 1.3, backgroundColor: "#ffffff" }
                  : { scale: 1, backgroundColor: "rgba(255,255,255,0.4)" }
              }
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------- ArrowButton */
function ArrowButton({ direction, onClick }) {
  const isLeft = direction === "left";
  const pos = isLeft ? "left-4" : "right-4";
  const icon = isLeft ? "/svg/angleLeft.svg" : "/svg/angleRight.svg";

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      className={`absolute ${pos} top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-ogr flex items-center justify-center shadow-xl`}
    >
      {/* ripple glow on press */}
      <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-active:animate-ripple-ping" />
      <SvgIcon src={icon} width={20} height={20} />
      <style jsx>{`
        .group-active\\:animate-ripple-ping:active {
          animation: ripple ${ARROW_RIPPLE_MS}ms ease-out;
        }
        @keyframes ripple {
          0% {
            opacity: 0.4;
            transform: scale(0.8);
          }
          100% {
            opacity: 0;
            transform: scale(2.6);
          }
        }
      `}</style>
    </motion.button>
  );
}
