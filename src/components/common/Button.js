"use client";

import { motion } from "framer-motion";
import SvgIcon from "./SvgIcon";

/* ---------- variants ---------- */
const btn = {
  rest: {
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    paddingRight: "2.5rem", // ↗︎ a tad more than before
    boxShadow: "0 6px 14px rgba(0,0,0,0.16)",
  },
  hover: {
    rotateX: -4,
    rotateY: 4,
    scale: 1.06,
    paddingRight: "4rem", // ↗︎ roomy gap for the arrow
    boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 18,
    },
  },
  tap: { scale: 0.97 },
};

const arrow = {
  rest: { scale: 0, opacity: 0, rotate: 0 },
  hover: {
    scale: 1,
    opacity: 1,
    rotate: 360,
    transition: { type: "spring", stiffness: 260, damping: 20, delay: 0.05 },
  },
};

export default function Button({ text }) {
  return (
    <motion.button
      variants={btn}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileTap="tap"
      className="relative inline-flex items-center text-2xl font-semibold text-black pl-8 py-4 rounded-full bg-sgr overflow-hidden focus:outline-none hover:cursor-pointer"
    >
      {/* label */}
      <span className="relative z-10">{text}</span>

      {/* arrow (absolutely positioned, doesn’t affect width) */}
      <motion.span
        variants={arrow}
        className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 bg-white/50 rounded-full shadow-md"
      >
        <SvgIcon src="/svg/doubleArrow-right.svg" width={18} height={18} />
      </motion.span>
    </motion.button>
  );
}
