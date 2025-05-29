/* ---------- FloatingShapes.jsx ---------- */
import { motion } from "framer-motion";

/* extremely light drifting squares */
export default function FloatingShapes({ isLeft }) {
  const common = {
    className:
      "absolute w-24 h-24 border border-white/20 rounded-lg pointer-events-none",
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: [0, 0.3, 0.3, 0],
      scale: [0.8, 1, 1, 0.8],
      y: [0, -40, 40, 0],
      x: isLeft ? [0, -20, 10, 0] : [0, 20, -10, 0],
      transition: { duration: 10, repeat: Infinity, ease: "linear" },
    },
  };

  return (
    <>
      <motion.div
        {...common}
        style={{
          top: "10%",
          left: isLeft ? "55%" : "auto",
          right: isLeft ? "auto" : "55%",
        }}
      />
      <motion.div
        {...common}
        style={{
          bottom: "15%",
          left: isLeft ? "65%" : "auto",
          right: isLeft ? "auto" : "65%",
        }}
      />
    </>
  );
}
