"use client";

import { useCarousel } from "./Carousel";
import { motion, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Button from "@/components/common/Button";
import FloatingShapes from "@/components/common/FloatingShapes";

/* --------  tunables  -------- */
const MASK_DUR = 0.9; // reveal speed
const FLOAT_UP = 20; // img float px
const TILT_DEG = 6; // img tilt deg

export default function Slide({
  image,
  text,
  category,
  link,
  buttonText,
  order = "left",
}) {
  const { currentIndex } = useCarousel(); // needed only for re-mount
  const isImageLeft = order === "left";

  /* ----- cursor-tilt for image ----- */
  const imgRef = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rX = useTransform(my, [0, 1], [+TILT_DEG, -TILT_DEG]);
  const rY = useTransform(mx, [0, 1], [-TILT_DEG, +TILT_DEG]);
  const handleMove = (e) => {
    const rect = imgRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  /* ----- diagonal mask path ----- */
  const baseMask = "polygon(0 0, 100% 0, 100% 100%, 0 100%)";
  const enterMask = isImageLeft
    ? "polygon(0 0, 0 0, 0 100%, 0 100%)"
    : "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)";

  return (
    <motion.div
      key={currentIndex}
      initial={{ clipPath: enterMask }}
      animate={{ clipPath: baseMask }}
      transition={{ duration: MASK_DUR, ease: [0.25, 0.9, 0.3, 1] }}
      className="w-full h-full flex items-center justify-center relative overflow-hidden rounded-[25px]"
    >
      <div
        className={`flex w-full h-[95%] ${
          isImageLeft ? "flex-row" : "flex-row-reverse"
        } relative rounded-[25px] overflow-hidden`}
      >
        {/* ---------- IMAGE SIDE ---------- */}
        <motion.div
          ref={imgRef}
          onMouseMove={handleMove}
          style={{ rotateX: rX, rotateY: rY, perspective: 800 }}
          className="w-[50%] h-full flex items-end justify-center bg-sgr relative overflow-hidden shadow-2xl rounded-[25px]"
        >
          <motion.div
            initial={{ y: FLOAT_UP, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 0.8 } }}
            whileHover={{ y: -FLOAT_UP / 2, transition: { duration: 1 } }}
            className="w-[70%] h-[90%] relative rounded-[25px] overflow-hidden"
          >
            <Image
              src={image}
              alt="Slide Image"
              fill
              className="object-cover object-top rounded-[25px]"
              priority
            />
          </motion.div>
        </motion.div>
        {/* ---------- TEXT SIDE ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, delay: 0.2 },
          }}
          className={`w-1/2 h-full flex items-center px-[16rem] relative z-10
    ${isImageLeft ? "bg-gradient-to-r" : "bg-gradient-to-l"}
    from-transparent to-sgr/30`}
        >
          <div
            className={`absolute top-1/2 -translate-y-1/2 ${
              isImageLeft
                ? "right-0 translate-x-1/2"
                : "left-0 -translate-x-1/2"
            } w-[40rem] h-[15rem] pointer-events-none opacity-100`}
          >
            <Image
              src="/brandData/URBAN-logo-transparent.png"
              fill
              alt="Brand Logo"
              className="object-contain rotate-90"
            />
          </div>

          {/* --- drifting translucent squares --- */}
          <FloatingShapes
            isLeft={isImageLeft}
            className="absolute inset-0 pointer-events-none z-[-1]"
          />

          {/* --- headline / copy / CTA --- */}
          <motion.div className="font-bold text-left leading-snug flex flex-col gap-[2rem]">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                transition: { delay: 0.4, duration: 0.6 },
              }}
              className="text-[5rem] font-eulogy font-normal"
            >
              {category}
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                transition: { delay: 0.55, duration: 0.6 },
              }}
              className="text-justify text-3xl"
            >
              {text}
            </motion.p>

            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                transition: { delay: 0.7, duration: 0.5 },
              }}
              whileHover={{ scale: 1.05 }}
              className="self-end mt-[5rem]"
            >
              <Link href={link}>
                <Button text={buttonText} />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
