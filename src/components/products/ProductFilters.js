"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";
import apiService from "@/lib/apiService";

/* constants */
const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const colors = ["Black", "White", "Blue", "Red", "Green", "Beige"];
const sortOptions = [
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
    r.parent ? map[r.parent]?.children.push(map[r._id]) : root.push(map[r._id]);
  });
  return root;
};

/**
 * @param {boolean}   showCategory  – whether to render the category tree
 * @param {string?}   lockedCatSlug – slug to force-select; UI hidden if provided & showCategory=false
 */
export default function ProductFilters({ showCategory = true }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [tree, setTree] = useState([]);
  const [openSet, setOpenSet] = useState(new Set());

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

  /* ── if locked category slug present and URL lacks it, inject it once ── */
  // useEffect(() => {
  //   if (!lockedCatSlug) return;
  //   const current =
  //     searchParams.get("category")?.split(",").filter(Boolean) || [];
  //   if (current.includes(lockedCatSlug)) return;
  //   const params = new URLSearchParams(searchParams.toString());
  //   current.push(lockedCatSlug);
  //   params.set("category", current.join(","));
  //   params.delete("page");
  //   router.replace(`${pathname}?${params.toString()}`);
  // }, [lockedCatSlug, pathname, router, searchParams]);

  /* shared helpers */
  const pushParams = (params) =>
    router.push(`${pathname}?${params.toString()}`);

  const setSingle = (key, val) => {
    const params = new URLSearchParams(searchParams.toString());
    val ? params.set(key, val) : params.delete(key);
    params.delete("page");
    pushParams(params);
  };

  const toggleMulti = (key, val) => {
    const params = new URLSearchParams(searchParams.toString());
    const list = params.get(key)?.split(",").filter(Boolean) || [];
    const next = list.includes(val)
      ? list.filter((v) => v !== val)
      : [...list, val];
    next.length ? params.set(key, next.join(",")) : params.delete(key);
    params.delete("page");
    pushParams(params);
  };

  const multiv = (key) =>
    searchParams.get(key)?.split(",").filter(Boolean) || [];

  /* parent open toggle */
  const toggleOpen = (id) => {
    const s = new Set(openSet);
    s.has(id) ? s.delete(id) : s.add(id);
    setOpenSet(s);
  };

  /* ───────────────── RENDER ───────────────── */
  return (
    <aside className="w-full md:w-64 p-4 bg-white border rounded-xl mb-6">
      {/* CATEGORY TREE (optional) */}
      {showCategory && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Category</h3>
          <ul className="space-y-1 max-h-52 overflow-y-auto pr-1">
            {tree.map((parent) => (
              <li key={parent._id}>
                <div className="flex items-center gap-1">
                  <button
                    className="w-4 text-sm"
                    onClick={() => toggleOpen(parent._id)}
                  >
                    {parent.children.length
                      ? openSet.has(parent._id)
                        ? "▾"
                        : "▸"
                      : ""}
                  </button>
                  <input
                    type="checkbox"
                    className="mr-1"
                    checked={multiv("category").includes(parent.slug)}
                    onChange={() => toggleMulti("category", parent.slug)}
                  />
                  <span className="capitalize">{parent.name}</span>
                </div>
                {openSet.has(parent._id) && parent.children.length > 0 && (
                  <ul className="pl-6 space-y-1">
                    {parent.children.map((child) => (
                      <li key={child._id} className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          className="mr-1"
                          checked={multiv("category").includes(child.slug)}
                          onChange={() => toggleMulti("category", child.slug)}
                        />
                        <span className="capitalize">{child.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* PRICE */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Price Range</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            className="w-20 px-2 py-1 border rounded"
            value={searchParams.get("priceMin") || ""}
            onChange={(e) => setSingle("priceMin", e.target.value)}
          />
          <span>—</span>
          <input
            type="number"
            placeholder="Max"
            className="w-20 px-2 py-1 border rounded"
            value={searchParams.get("priceMax") || ""}
            onChange={(e) => setSingle("priceMax", e.target.value)}
          />
        </div>
      </div>

      {/* SIZE */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Sizes</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((sz) => (
            <button
              key={sz}
              onClick={() => toggleMulti("size", sz)}
              className={clsx(
                "border rounded px-2 py-1 text-sm",
                multiv("size").includes(sz)
                  ? "bg-black text-white border-black"
                  : "bg-white text-black"
              )}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* COLOR */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Colors</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map((clr) => (
            <button
              key={clr}
              onClick={() => toggleMulti("color", clr)}
              className={clsx(
                "border rounded px-3 py-1 text-sm",
                multiv("color").includes(clr)
                  ? "bg-black text-white border-black"
                  : "bg-white text-black"
              )}
            >
              {clr}
            </button>
          ))}
        </div>
      </div>

      {/* SORT */}
      <div>
        <h3 className="font-semibold mb-2">Sort By</h3>
        <select
          className="w-full border rounded px-2 py-1"
          value={searchParams.get("sort") || ""}
          onChange={(e) => setSingle("sort", e.target.value)}
        >
          <option value="">Default</option>
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}
