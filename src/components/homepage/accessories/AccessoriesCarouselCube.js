"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/common/Button";

/* ---------- tune ---------- */
const INTERVAL = 2500; // ms
const FLIP_DUR = 0.9; // cube rotation seconds
const PERSPECTIVE = 1200; // px
const KEN_BURNS = 1.06; // image slow-zoom factor

export default function AccessoriesCarouselCube({
  images,
  interval = INTERVAL,
  className = "",
}) {
  /* --- state & timer --- */
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const next = useCallback(
    () => setIdx((i) => (i + 1) % images.length),
    [images.length]
  );

  /* autoplay */
  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(next, interval);
    return () => clearTimeout(timerRef.current);
  }, [idx, paused, interval, next]);

  const current = images[idx];

  /* --- variants --- */
  const cube = {
    enter: ({ dir }) => ({
      rotateY: dir > 0 ? 90 : -90,
      z: -80,
      opacity: 0,
    }),
    center: { rotateY: 0, z: 0, opacity: 1 },
    exit: ({ dir }) => ({
      rotateY: dir > 0 ? -90 : 90,
      z: -80,
      opacity: 0,
    }),
  };

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={`relative w-full h-[30vh] perspective-[${PERSPECTIVE}px] group ${className}`}
    >
      {/* cube panel */}
      <AnimatePresence
        mode="wait"
        custom={{ dir: 1 /* always forward */ }}
        initial={false}
      >
        <motion.div
          key={idx}
          custom={{ dir: 1 }}
          variants={cube}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: FLIP_DUR, ease: [0.25, 0.9, 0.3, 1] }}
          className="absolute inset-0 rounded-lg overflow-hidden shadow-xl"
        >
          <Link href={current.link || "#"} className="block w-full h-full">
            {/* slow Ken-Burns */}
            <motion.div
              initial={{ scale: KEN_BURNS }}
              animate={{
                scale: 1,
                transition: {
                  duration: interval / 1000 + FLIP_DUR,
                  ease: "linear",
                },
              }}
              className="absolute inset-0"
            >
              <Image
                src={current.image}
                alt={current.alt}
                fill
                className="object-cover"
                priority
              />
            </motion.div>

            {/* overlay & button */}
            {/* overlay & button — visible ONLY on hover */}
            {current.button && (
              <div
                className="absolute inset-0 flex items-center justify-center
               bg-gradient-to-t from-black/60 via-black/40 to-transparent
               backdrop-blur-sm
               opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <Button text={current.button} />
              </div>
            )}
          </Link>
        </motion.div>
      </AnimatePresence>

      {/* progress bar */}
      <motion.span
        key={idx} /* restart every slide */
        initial={{ scaleX: 0 }}
        animate={{
          scaleX: paused ? 0 : 1,
          transition: { duration: interval / 1000, ease: "linear" },
        }}
        className="absolute bottom-0 left-0 h-1 origin-left bg-white/90"
      />
    </div>
  );
}
