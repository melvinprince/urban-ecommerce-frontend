// components/homepage/banner/Slide.jsx

"use client";

import { useCarousel } from "./Carousel";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "@/components/common/Button";

export default function Slide({
  image,
  text,
  category,
  link,
  buttonText,
  order = "left",
}) {
  const { currentIndex } = useCarousel();
  const isImageLeft = order === "left";

  const [clip, setClip] = useState("polygon(0 0, 0 0, 0 100%, 0 100%)"); // Start fully hidden

  useEffect(() => {
    setClip("polygon(0 0, 100% 0, 100% 100%, 0 100%)"); // Reveal fully
  }, [currentIndex]);

  return (
    <motion.div
      className="w-full h-full flex items-center justify-center relative overflow-hidden rounded-[25px]"
      style={{ clipPath: clip, WebkitClipPath: clip }}
      animate={{
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        WebkitClipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      }}
      initial={{
        clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)",
        WebkitClipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)",
      }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div
        className={`flex w-full h-[95%] ${
          isImageLeft ? "flex-row" : "flex-row-reverse"
        } relative rounded-[25px] overflow-hidden`}
      >
        {/* Image Side */}
        <div className="w-[50%] h-full flex items-end justify-center bg-sgr relative overflow-hidden shadow-2xl rounded-[25px]">
          <div className="w-[70%] h-[90%] relative rounded-[25px] overflow-hidden">
            <Image
              src={image}
              alt="Slide Image"
              fill
              className="object-cover object-top rounded-[25px] hover:scale-105 transition-transform duration-500 ease-in-out"
              priority
            />
          </div>
        </div>

        {/* Text Side */}
        <div
          className={`w-1/2 h-full flex items-center justify-left px-[16rem] z-[10] relative from-transparent to-sgr/50 bg-opacity-50 rounded-[25px] ${
            isImageLeft ? "bg-gradient-to-r" : "bg-gradient-to-l"
          }`}
        >
          <div
            className={`absolute top-[50%] translate-y-[-50%] opacity-50 ${
              isImageLeft
                ? "right-0 translate-x-[45%]"
                : "left-0 translate-x-[-45%]"
            } rounded-[25px] z-[-1] `}
          >
            <div className="w-[40rem] h-[15rem] relative hover:scale-105 transition-transform duration-500 ease-in-out">
              <Image
                src="/brandData/URBAN-logo-transparent.png"
                fill
                alt="Brand Logo"
                className="rotate-90 object-fit"
              />
            </div>
          </div>
          <div className="font-bold text-left leading-snug flex flex-col gap-[2rem]">
            <h1 className="text-[5rem] font-eulogy font-normal">{category}</h1>
            <p className="text-justify text-3xl">{text}</p>
            <Link
              href={link}
              className="text-3xl bg-ogr rounded-full px-[.5rem] py-[.5rem] w-fit flex items-center justify-center self-end mt-[2rem] shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:px-[1rem]"
            >
              <Button text={buttonText} />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
