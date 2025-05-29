"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Button from "../common/Button";

/* ---------- tuning ---------- */
const AUTOPLAY_MS = 5000;
const FLIP_DEG = 15;
const ZOOM_FACTOR = 1.08;

export default function ShoeCarousel({ data = [] }) {
  /* ------------- hooks first (rules of hooks) ------------- */
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timeoutRef = useRef(null);

  /* ------------- helpers ------------- */
  const advance = useCallback(
    () => setIndex((i) => (i + 1) % data.length),
    [data.length]
  );

  const resetTimer = useCallback(() => {
    clearTimeout(timeoutRef.current);
    if (!paused && data.length) {
      timeoutRef.current = setTimeout(advance, AUTOPLAY_MS);
    }
  }, [paused, data.length, advance]);

  /* ------------- effects ------------- */
  useEffect(() => {
    resetTimer();
    return () => clearTimeout(timeoutRef.current);
  }, [index, paused, resetTimer]);

  useEffect(() => {
    const handler = (e) => {
      if (!data.length) return;
      if (e.key === "ArrowRight") advance();
      if (e.key === "ArrowLeft")
        setIndex((i) => (i === 0 ? data.length - 1 : i - 1));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [advance, data.length]);

  /* ------------- early-render guard (after hooks) -------- */
  if (!data.length) return null;

  /* ------------- slide data ------------- */
  const { text, button, link, image, subline, color } = data[index];

  return (
    <div
      className="flex w-full h-[70vh] mx-auto select-none "
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ------------ main display ------------ */}
      <div className="relative w-3/4 aspect-[3/4] overflow-hidden rounded-[25px] shadow-2xl">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            className="absolute inset-0"
            variants={{
              enter: { rotateY: FLIP_DEG, opacity: 0 },
              center: { rotateY: 0, opacity: 1 },
              exit: { rotateY: -FLIP_DEG, opacity: 0 },
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.7, ease: [0.25, 0.9, 0.3, 1] }}
          >
            <Link href={link}>
              <motion.div
                className="absolute inset-0"
                variants={{
                  zoom: { scale: ZOOM_FACTOR },
                  idle: {
                    scale: 1,
                    transition: { duration: AUTOPLAY_MS / 1000 + 0.7 },
                  },
                }}
                initial="zoom"
                animate="idle"
              >
                <Image
                  src={image}
                  alt={text}
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            </Link>

            {/* ------------ caption ------------ */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 left-[5%] p-4 ${
                color === "black" ? "text-black" : "text-white"
              }`}
            >
              <h3 className="text-[6rem] font-eulogy">{text}</h3>
              <p className="text-[2rem] w-[70%] mb-[6rem]">{subline}</p>
              <Link href={link}>
                <Button text={button} />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ------------ thumbnails ------------ */}
      <div className="w-1/4 flex flex-col justify-center space-y-4 pl-4">
        {data.map((item, i) => (
          <Thumb
            key={i}
            item={item}
            active={i === index}
            onClick={() => setIndex(i)}
            paused={paused}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------- Thumbnail v2 (smaller + zoom-timer) ---------- */
function Thumb({ item, active, onClick, paused }) {
  const OUTER_BASE = 1; // 80 % size for every thumb
  const OUTER_ACTIVE = 0.95; // active grows to 100 %
  const OUTER_HOVER = 1.05; // tiny lift on hover
  const INNER_START = 1.02; // image starts slightly zoomed
  const INNER_END = 0.99; // image drifts out to this

  return (
    <motion.div
      onClick={onClick}
      initial={{ scale: OUTER_BASE }}
      animate={{ scale: active ? OUTER_ACTIVE : OUTER_BASE }}
      whileHover={{ scale: active ? OUTER_HOVER : OUTER_BASE + 0.1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`relative w-full aspect-[3/4] cursor-pointer overflow-hidden rounded-[25px] ${
        active ? "shadow-2xl" : "shadow-md"
      }`}
    >
      {/* image with zoom-timer */}
      <motion.div
        initial={false}
        animate={
          active
            ? {
                scale: paused ? INNER_START : INNER_END,
                transition: paused
                  ? { duration: 0 }
                  : { duration: AUTOPLAY_MS / 1000, ease: "linear" },
              }
            : { scale: 1 }
        }
        className="absolute inset-0"
      >
        <Image
          src={item.image}
          alt={item.text}
          fill
          className="object-cover object-bottom"
        />
      </motion.div>

      {/* border glow */}
      <motion.div
        animate={{
          borderColor: active ? "#5a6344" : "rgba(0,0,0,0)",
          transition: { type: "spring", stiffness: 300, damping: 20 },
        }}
        className="absolute inset-0 border-2 rounded-[25px] pointer-events-none"
      />
    </motion.div>
  );
}
