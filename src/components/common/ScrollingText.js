"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useWindowSize } from "@react-hook/window-size";

const DIRS = {
  leftToRight: { axis: "x", sign: +1 },
  rightToLeft: { axis: "x", sign: -1 },
  topToBottom: { axis: "y", sign: +1 },
  bottomToTop: { axis: "y", sign: -1 },
};

export default function ScrollingText({
  text = "SCROLLING TEXT",
  speed = 60, // pixels per second
  direction = "leftToRight",
  size = "4vw", // font-size
  spacing = "2rem", // gap between words
}) {
  /* ------------------------------------------------------------ */
  /* refs & state                                                 */
  /* ------------------------------------------------------------ */
  const firstSpan = useRef(null);
  const [unit, setUnit] = useState({ w: 0, h: 0 }); // size of one “TEXT .”
  const [wW, wH] = useWindowSize();

  /* ------------------------------------------------------------ */
  /* measure single “TEXT .” once fonts have rendered             */
  /* ------------------------------------------------------------ */
  useEffect(() => {
    if (firstSpan.current) {
      const r = firstSpan.current.getBoundingClientRect();
      setUnit({ w: r.width, h: r.height });
    }
  }, [text, size, spacing]);

  /* ------------------------------------------------------------ */
  /* build one block big enough to cover the viewport             */
  /* ------------------------------------------------------------ */
  const { axis, sign } = DIRS[direction] || DIRS.leftToRight;

  const reps = useMemo(() => {
    if (!unit.w) return 2; // first render
    const needed =
      axis === "x" ? Math.ceil(wW / unit.w) : Math.ceil(wH / unit.h);
    return needed + 2; // +2 buffer
  }, [unit, wW, wH, axis]);

  const oneBlock = (
    <>
      {Array.from({ length: reps }).map((_, i) => (
        <span
          key={i}
          ref={i === 0 ? firstSpan : null}
          style={{
            marginRight: axis === "x" ? spacing : 0,
            marginBottom: axis === "y" ? spacing : 0,
          }}
        >
          {text.toUpperCase()} .
        </span>
      ))}
    </>
  );

  /* ------------------------------------------------------------ */
  /* how far to translate for ONE full cycle                      */
  /* ------------------------------------------------------------ */
  const distance = axis === "x" ? unit.w * reps : unit.h * reps;
  const duration = distance / speed; // seconds = px ÷ (px/s)

  /* ------------------------------------------------------------ */
  /* keyframes: 0 → ±distance                                     */
  /* ------------------------------------------------------------ */
  const animate =
    axis === "x" ? { x: sign * -distance } : { y: sign * -distance };

  /* ------------------------------------------------------------ */
  /* render                                                       */
  /* ------------------------------------------------------------ */
  return (
    <div
      style={{
        overflow: "hidden",
        display: "inline-block",
        width: axis === "y" ? `${unit.h || 1}px` : "100%",
        height: axis === "x" ? `${unit.h || 1}px` : "100%",
      }}
    >
      <motion.div
        style={{
          display: "flex",
          flexDirection: axis === "y" ? "column" : "row",
          fontSize: size,
          fontWeight: "bold",
          textTransform: "uppercase",
          whiteSpace: axis === "x" ? "nowrap" : "normal",
        }}
        animate={animate}
        transition={{
          ease: "linear",
          duration,
          repeat: Infinity,
        }}
      >
        {/* block A + block B (duplicate) */}
        <div style={{ display: axis === "y" ? "column" : "flex" }}>
          {oneBlock}
        </div>
        <div style={{ display: axis === "y" ? "column" : "flex" }}>
          {oneBlock}
        </div>
      </motion.div>
    </div>
  );
}
