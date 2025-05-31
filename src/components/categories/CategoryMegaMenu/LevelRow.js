"use client";

import { motion } from "framer-motion";
import CategoryTile from "./CategoryTile";

/* depth-based sizing */
function sizing(level) {
  if (level === 0) return { li: "basis-110", label: "text-3xl" }; // 24 rem
  if (level === 1) return { li: "basis-85", label: "text-2xl" }; // 18 rem
  return { li: "basis-70", label: "text-xl" }; // 14 rem
}

/**
 * LevelRow – horizontal, wrapping strip of tiles.
 * Props:
 *   level, parentId, tree, onHover(id), className?
 */
export default function LevelRow({
  level,
  parentId,
  tree,
  onHover,
  className = "",
}) {
  const items = tree[parentId ?? "root"] ?? [];
  const { li, label } = sizing(level);

  return (
    <motion.ul
      className={`flex flex-row flex-wrap gap-4 w-full ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {items.map((cat) => (
        <li key={cat._id} className={`flex-shrink-0 ${li}`}>
          <CategoryTile
            category={cat}
            onHover={() => onHover(cat._id)}
            labelSize={label}
          />
        </li>
      ))}
    </motion.ul>
  );
}
