"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LevelRow from "./LevelRow";
import { buildTree } from "./utils";

export default function CategoryMegaMenu({ categories }) {
  const tree = useMemo(() => buildTree(categories), [categories]);

  const [path, setPath] = useState([]); // [rootId, childId, …]
  const [open, setOpen] = useState(false);

  /* ------------- helpers ------------- */
  const showForRoot = useCallback((rootId) => {
    setPath([rootId]);
    setOpen(true);
  }, []);

  const closeModal = () => {
    setOpen(false);
    setPath([]);
  };

  /* esc closes */
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && closeModal();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /* ------------- render ------------- */
  return (
    <section className="my-[5rem]">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Browse Categories
      </h2>

      <div className="relative mx-auto w-fit">
        {/* root row */}
        <LevelRow level={0} parentId={null} tree={tree} onHover={showForRoot} />

        {/* modal under root */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="cat-modal"
              className="absolute left-0 right-0 top-full z-40 mt-4 rounded-lg bg-ogr/10 backdrop-blur-2xl p-6 shadow-xl"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              onMouseLeave={closeModal}
            >
              {/* close btn (always visible) */}
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-3xl font-semibold text-gray-500 hover:text-gray-800"
                aria-label="Close categories"
              >
                ×
              </button>

              {/* stacked child rows */}
              {Array.from({ length: path.length }).map((_, i) => {
                const lvl = i + 1;
                return (
                  <LevelRow
                    key={lvl}
                    level={lvl}
                    parentId={path[lvl - 1]}
                    tree={tree}
                    onHover={(id) =>
                      setPath((p) => {
                        const next = [...p];
                        next[lvl] = id;
                        return next.slice(0, lvl + 1);
                      })
                    }
                    className={lvl > 1 ? "mt-6" : ""}
                  />
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
