"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import apiService from "@/lib/apiService";

/* constants */
const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const ALL_COLORS = ["Black", "White", "Blue", "Red", "Green", "Beige"];
const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "priceAsc" },
  { label: "Price: High to Low", value: "priceDesc" },
  { label: "Popularity", value: "popularity" },
];

/* helper: flat list -> tree */
const buildTree = (rows) => {
  const map = Object.fromEntries(
    rows.map((r) => [r._id, { ...r, children: [] }])
  );
  const root = [];
  rows.forEach((r) => {
    if (r.parent) {
      map[r.parent]?.children.push(map[r._id]);
    } else {
      root.push(map[r._id]);
    }
  });
  return root;
};

export default function ProductFilters({ showCategory = true }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [tree, setTree] = useState([]);
  const [openSet, setOpenSet] = useState(new Set());

  /* ── LOCAL STATE FOR FILTER CONTROLS ── */
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceMinLocal, setPriceMinLocal] = useState("");
  const [priceMaxLocal, setPriceMaxLocal] = useState("");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [sortLocal, setSortLocal] = useState("");

  /* ── ON MOUNT OR URL CHANGE, INITIALIZE LOCAL STATE FROM searchParams ── */
  useEffect(() => {
    // categories (comma-separated slugs)
    const catList = searchParams.get("category")
      ? searchParams.get("category").split(",").filter(Boolean)
      : [];
    setSelectedCategories(catList);

    // priceMin / priceMax
    setPriceMinLocal(searchParams.get("priceMin") || "");
    setPriceMaxLocal(searchParams.get("priceMax") || "");

    // sizes
    const sizeList = searchParams.get("size")
      ? searchParams.get("size").split(",").filter(Boolean)
      : [];
    setSelectedSizes(sizeList);

    // colors
    const colorList = searchParams.get("color")
      ? searchParams.get("color").split(",").filter(Boolean)
      : [];
    setSelectedColors(colorList);

    // sort
    setSortLocal(searchParams.get("sort") || "");
  }, [searchParams]);

  /* ── fetch categories once ── */
  useEffect(() => {
    (async () => {
      try {
        const res = await apiService.categories.getAll();
        setTree(buildTree(res?.data || []));
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  /* ── toggle category open/close ── */
  const toggleOpen = (id) => {
    const s = new Set(openSet);
    s.has(id) ? s.delete(id) : s.add(id);
    setOpenSet(s);
  };

  /* ── toggle a category slug ON/OFF in local state ── */
  const toggleCategoryLocal = (slug) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((v) => v !== slug) : [...prev, slug]
    );
  };

  /* ── toggle a size ON/OFF locally ── */
  const toggleSizeLocal = (sz) => {
    setSelectedSizes((prev) =>
      prev.includes(sz) ? prev.filter((v) => v !== sz) : [...prev, sz]
    );
  };

  /* ── toggle a color ON/OFF locally ── */
  const toggleColorLocal = (clr) => {
    setSelectedColors((prev) =>
      prev.includes(clr) ? prev.filter((v) => v !== clr) : [...prev, clr]
    );
  };

  /* ── APPLY BUTTON CLICK ── build params and push to URL ── */
  const handleApply = () => {
    const filterKeys = [
      "category",
      "priceMin",
      "priceMax",
      "size",
      "color",
      "sort",
    ];

    // Start with any existing non-filter keys (e.g., “q” in search page)
    const params = new URLSearchParams();
    searchParams.forEach((val, key) => {
      if (!filterKeys.includes(key) && key !== "page") {
        params.set(key, val);
      }
    });

    // Now set each filter key from local state
    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(","));
    }
    if (priceMinLocal) {
      params.set("priceMin", priceMinLocal);
    }
    if (priceMaxLocal) {
      params.set("priceMax", priceMaxLocal);
    }
    if (selectedSizes.length > 0) {
      params.set("size", selectedSizes.join(","));
    }
    if (selectedColors.length > 0) {
      params.set("color", selectedColors.join(","));
    }
    if (sortLocal) {
      params.set("sort", sortLocal);
    }

    // Always reset to page 1
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="self-start sticky top-4">
      <aside
        className={clsx(
          "w-full md:w-64 p-6 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl",
          "max-h-screen overflow-y-auto"
        )}
      >
        {/* CATEGORY TREE */}
        {showCategory && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-lg">Category</h3>
            <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {tree.map((parent) => (
                <li key={parent._id} className="space-y-1">
                  <div className="flex items-center gap-2">
                    {parent.children.length > 0 && (
                      <button
                        onClick={() => toggleOpen(parent._id)}
                        className="text-gray-600 hover:text-black"
                      >
                        {openSet.has(parent._id) ? (
                          <motion.span
                            initial={{ rotate: 0 }}
                            animate={{ rotate: 90 }}
                          >
                            ▸
                          </motion.span>
                        ) : (
                          <motion.span
                            initial={{ rotate: 90 }}
                            animate={{ rotate: 0 }}
                          >
                            ▸
                          </motion.span>
                        )}
                      </button>
                    )}
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-ogr"
                      checked={selectedCategories.includes(parent.slug)}
                      onChange={() => toggleCategoryLocal(parent.slug)}
                    />
                    <span className="capitalize">{parent.name}</span>
                  </div>
                  <AnimatePresence>
                    {openSet.has(parent._id) && parent.children.length > 0 && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="pl-6 space-y-1 overflow-hidden"
                      >
                        {parent.children.map((child) => (
                          <li
                            key={child._id}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              className="h-4 w-4 accent-ogr"
                              checked={selectedCategories.includes(child.slug)}
                              onChange={() => toggleCategoryLocal(child.slug)}
                            />
                            <span className="capitalize">{child.name}</span>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* PRICE RANGE */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3 text-lg">Price Range</h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              className="w-20 px-3 py-2 border rounded-lg bg-white/70"
              value={priceMinLocal}
              onChange={(e) => setPriceMinLocal(e.target.value)}
            />
            <span className="text-gray-600">—</span>
            <input
              type="number"
              placeholder="Max"
              className="w-20 px-3 py-2 border rounded-lg bg-white/70"
              value={priceMaxLocal}
              onChange={(e) => setPriceMaxLocal(e.target.value)}
            />
          </div>
        </div>

        {/* SIZE FILTER */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3 text-lg">Sizes</h3>
          <div className="flex flex-wrap gap-2">
            {ALL_SIZES.map((sz) => (
              <motion.button
                key={sz}
                onClick={() => toggleSizeLocal(sz)}
                className={clsx(
                  "px-3 py-2 rounded-lg border text-sm font-medium",
                  selectedSizes.includes(sz)
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-800 border-gray-300"
                )}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {sz}
              </motion.button>
            ))}
          </div>
        </div>

        {/* COLOR FILTER */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3 text-lg">Colors</h3>
          <div className="flex flex-wrap gap-2">
            {ALL_COLORS.map((clr) => (
              <motion.button
                key={clr}
                onClick={() => toggleColorLocal(clr)}
                className={clsx(
                  "px-4 py-2 rounded-lg border text-sm font-medium",
                  selectedColors.includes(clr)
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-800 border-gray-300"
                )}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {clr}
              </motion.button>
            ))}
          </div>
        </div>

        {/* SORT OPTIONS */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3 text-lg">Sort By</h3>
          <select
            className="w-full px-3 py-2 border rounded-lg bg-white/70"
            value={sortLocal}
            onChange={(e) => setSortLocal(e.target.value)}
          >
            <option value="">Default</option>
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* APPLY BUTTON */}
        <div>
          <motion.button
            onClick={handleApply}
            className="
              w-full py-3 rounded-xl text-white 
              bg-ogr
              hover:opacity-90 shadow-lg text-xl
            "
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            Apply
          </motion.button>
        </div>
      </aside>
    </div>
  );
}
