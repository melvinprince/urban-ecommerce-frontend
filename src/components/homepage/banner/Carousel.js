"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SvgIcon from "@/components/common/SvgIcon";

const CarouselContext = createContext();

export function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a Carousel");
  }
  return context;
}

export default function Carousel({ children, interval = 10000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("right");

  // Handle slide change every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, interval);

    return () => clearInterval(timer);
  }, [children.length, interval]);

  const nextSlide = () => {
    setDirection("right");
    setCurrentIndex((prev) => (prev + 1) % children.length);
  };

  const prevSlide = () => {
    setDirection("left");
    setCurrentIndex((prev) => (prev === 0 ? children.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? "right" : "left");
    setCurrentIndex(index);
  };

  const value = {
    currentIndex,
    direction,
  };

  return (
    <CarouselContext.Provider value={value}>
      <div className="relative w-full h-[80vh] overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          {children.map((child, index) =>
            index === currentIndex ? (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                {child}
              </motion.div>
            ) : null
          )}
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
          className="absolute right-5 top-1/2 transform -translate-y-1/2 z-20 bg-ogr text-white w-15 h-15 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl text-3xl  hover:scale-105 transition-transform duration-500 ease-in-out hover:cursor-pointer"
        >
          <SvgIcon src="/svg/angleRight.svg" width={15} height={15} />
        </motion.button>
      </div>
    </CarouselContext.Provider>
  );
}
