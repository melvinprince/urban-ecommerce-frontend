// components/LoginRegister/FeatureCounterCarousel.jsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SvgIcon from "./SvgIcon";

export default function FeatureCounterCarousel({ data = [], interval = 4000 }) {
  const [index, setIndex] = useState(0);
  const total = data.length;

  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, interval);
    return () => clearInterval(timer);
  }, [total, interval]);

  return (
    <div className="relative w-full h-[8rem] bg-sgr/20 rounded-full overflow-hidden mt-[2rem]">
      <AnimatePresence>
        {data.map((item, i) => {
          if (i !== index) return null;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center space-x-4"
            >
              {/* SVG: rotates 360° on mount */}
              <motion.div
                initial={{ rotate: 0, opacity: 0 }}
                animate={{ rotate: 360, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="flex-shrink-0"
              >
                <SvgIcon src={item.svg} width={40} height={40} />
              </motion.div>

              {/* Text: springs in like a timer */}
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className="text-gray-700 text-4xl font-eulogy"
              >
                {item.text}
              </motion.span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
