"use client";

import SvgIcon from "@/components/common/SvgIcon";
import { motion } from "framer-motion";

export default function ArrowButton({ direction = "left", onClick }) {
  const isLeft = direction === "left";
  const positionClass = isLeft ? "left-5" : "right-5";
  const iconSrc = isLeft ? "/svg/angleLeft.svg" : "/svg/angleRight.svg";

  return (
    <motion.button
      onClick={onClick}
      whileHover={{
        rotate: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.6 },
      }}
      className={`absolute ${positionClass} top-1/2 transform -translate-y-1/2 z-20 bg-ogr text-white w-15 h-15 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl text-3xl hover:scale-105 transition-transform duration-500 ease-in-out hover:cursor-pointer`}
    >
      <SvgIcon src={iconSrc} width={15} height={15} />
    </motion.button>
  );
}
