"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CategoryMenu() {
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hoveredPath, setHoveredPath] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
        const res = await fetch(`${API_URL}/api/categories`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const { success, data } = await res.json();
        if (!success) throw new Error("API returned success: false");
        setAllCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const childrenOf = (parentId) =>
    allCategories.filter((c) =>
      parentId === null ? c.parent === null : c.parent === parentId
    );

  const handleHover = (id, level) => {
    setHoveredPath((path) => {
      const newPath = [...path];
      newPath[level] = id;
      return newPath.slice(0, level + 1);
    });
  };

  const handleLeave = (level) => {
    setHoveredPath((path) => path.slice(0, level));
  };

  const renderList = (parentId, level = 0) => {
    const cats = childrenOf(parentId);
    if (!cats.length) return null;

    return (
      <ul
        className="absolute bg-white border rounded shadow-lg z-10 p-2 space-y-1"
        style={{
          top: 0,
          left: `${level * 200}px`,
          width: "80%",
        }}
      >
        {cats.map((cat) => {
          const isHovered = hoveredPath[level] === cat._id;

          return (
            <li
              key={cat._id}
              onMouseEnter={() => handleHover(cat._id, level)}
              onMouseLeave={() => handleLeave(level)}
              className={`relative px-3 py-1 rounded cursor-pointer ${
                isHovered ? "bg-gray-100" : "hover:bg-gray-50"
              }`}
            >
              <Link
                href={`/categories/${cat.slug}`}
                className="block text-gray-800"
              >
                {cat.name}
              </Link>
              {isHovered && renderList(cat._id, level + 1)}
            </li>
          );
        })}
      </ul>
    );
  };

  if (loading) return <div className="p-6">Loading Categories…</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="relative p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">Product Categories</h1>
      <div className="relative">{renderList(null, 0)}</div>
    </div>
  );
}
