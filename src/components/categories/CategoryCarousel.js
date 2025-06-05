"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Button from "../common/Button";
import SvgIcon from "../common/SvgIcon";

const SLIDE_INTERVAL = 5000;

export default function CategoryCarousel({ slides }) {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);
  const imageControls = useAnimation();

  const resetTimer = useCallback(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL);
  }, [slides.length]);

  useEffect(() => {
    resetTimer();
    imageControls.start({
      scale: [1, 1.05],
      transition: {
        duration: SLIDE_INTERVAL / 1000,
        ease: "easeInOut",
        repeat: Infinity,
      },
    });
    return () => clearTimeout(timeoutRef.current);
  }, [index, imageControls, resetTimer]);

  const goToSlide = (i) => {
    setIndex(i);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const textAlignClass = (side) =>
    side === "left" ? "left-[10%]" : "right-[10%]";

  return (
    <div className="my-20 mx-8 relative w-[calc(100%-4rem)] h-[65vh] rounded-3xl overflow-hidden bg-gray-900 shadow-xl">
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8, ease: [0.25, 0.9, 0.3, 1] }}
        >
          <Link
            href={slides[index].link}
            className="block w-full h-full relative group"
          >
            {/* Zoom effect on image */}
            <motion.div animate={imageControls} className="absolute inset-0">
              <Image
                src={slides[index].image}
                alt={slides[index].text}
                fill
                className="object-cover object-center"
                priority
              />
            </motion.div>

            {/* Gradient + Text */}
            <div
              className={`absolute top-[50%] translate-y-[-50%] text-black ${textAlignClass(
                slides[index].side
              )}`}
            >
              <motion.h2
                className="text-[5rem] font-eulogy mb-[2rem] leading-tight whitespace-pre-line"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                {slides[index].text}
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Button text={slides[index].button} />
              </motion.div>
            </div>
          </Link>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <motion.button
        onClick={prevSlide}
        whileHover={{
          rotate: [0, -10, 10, -10, 10, 0],
          transition: { duration: 0.6 },
        }}
        className="absolute left-5 top-1/2 transform -translate-y-1/2 z-20 bg-ogr text-white w-15 h-15 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl text-3xl hover:scale-105 transition-transform duration-500 ease-in-out hover:cursor-pointer"
      >
        <SvgIcon src="/svg/angleLeft.svg" width={15} height={15} />
      </motion.button>

      <motion.button
        onClick={nextSlide}
        whileHover={{
          rotate: [0, -10, 10, -10, 10, 0],
          transition: { duration: 0.6 },
        }}
        className="absolute right-5 top-1/2 transform -translate-y-1/2 z-20 bg-ogr text-white w-15 h-15 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl text-3xl hover:scale-105 transition-transform duration-500 ease-in-out hover:cursor-pointer"
      >
        <SvgIcon src="/svg/angleRight.svg" width={15} height={15} />
      </motion.button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              i === index ? "bg-white scale-125" : "bg-white/50"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
