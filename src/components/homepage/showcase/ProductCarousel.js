"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import SvgIcon from "@/components/common/SvgIcon";

export default function ProductCarousel({
  products,
  autoplay = true,
  autoplayDelay = 4000,
  showDots = true,
  showArrows = true,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  }, [products.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  }, [products.length]);

  // Autoplay Logic
  useEffect(() => {
    if (!autoplay) return;
    const reset = () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(nextSlide, autoplayDelay);
    };
    reset();
    return () => clearTimeout(timeoutRef.current);
  }, [nextSlide, autoplay, autoplayDelay, currentIndex]);

  // Handle dot click
  const goToSlide = (index) => {
    clearTimeout(timeoutRef.current);
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl">
      {/* Arrows */}
      {showArrows && (
        <>
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
            className="absolute right-5 top-1/2 transform -translate-y-1/2 z-20 bg-ogr text-white w-15 h-15 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl text-3xl  hover:scale-105 transition-transform duration-500 ease-in-out hover:cursor-pointer"
          >
            <SvgIcon src="/svg/angleRight.svg" width={15} height={15} />
          </motion.button>
        </>
      )}

      {/* Slides */}
      <div className="relative w-full aspect-square">
        <AnimatePresence initial={false} custom={currentIndex}>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Link
              href={products[currentIndex].link}
              className="block w-full h-full relative"
            >
              <Image
                src={products[currentIndex].image}
                alt={products[currentIndex].title}
                fill
                className="object-fit"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </Link>
            <span className="absolute text-5xl bottom-0 left-[50%] translate-x-[-50%] bg-ogr w-full text-center justify-center text-white font-bold p-2 rounded">
              {products[currentIndex].title}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      {showDots && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
          {products.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={clsx(
                "w-2 h-2 rounded-full transition-colors",
                i === currentIndex ? "bg-white" : "bg-white/50"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
