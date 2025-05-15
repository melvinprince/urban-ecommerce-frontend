"use client";

import { useEffect, useState } from "react";

export default function page() {
  const [allCats, setAllCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [path, setPath] = useState([]); // holds the chain of selected category IDs

  useEffect(() => {
    async function fetchCategories() {
      try {
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${API_URL}/api/categories`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const json = await res.json();
        if (!json.success) throw new Error("API returned success: false");
        setAllCats(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading…</div>;
  if (error)
    return <div style={{ padding: 20, color: "red" }}>Error: {error}</div>;

  // Get the list of categories for a given parent (or top-level if parentId is null)
  const categoriesFor = (parentId) =>
    allCats.filter((c) =>
      parentId ? c.parent === parentId : c.parent === null
    );

  // The current level is the last selected in path (or null for top level)
  const currentParentId = path.length > 0 ? path[path.length - 1] : null;
  const currentCats = categoriesFor(currentParentId);

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Product Categories</h1>

      {/* Breadcrumb / Back button */}
      {path.length > 0 && (
        <button
          onClick={() => setPath(path.slice(0, -1))}
          style={{
            marginBottom: 16,
            padding: "6px 12px",
            cursor: "pointer",
            background: "#eee",
            border: "1px solid #ccc",
            borderRadius: 4,
          }}
        >
          ← Back
        </button>
      )}

      {/* Category List */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {currentCats.map((cat) => (
          <li
            key={cat._id}
            onClick={() => setPath([...path, cat._id])}
            style={{
              padding: "12px 16px",
              marginBottom: 8,
              border: "1px solid #ddd",
              borderRadius: 4,
              cursor: "pointer",
              background: "#fafafa",
            }}
          >
            {cat.name}
          </li>
        ))}
      </ul>

      {/* If no children */}
      {currentCats.length === 0 && (
        <p style={{ color: "#666", marginTop: 16 }}>
          No further subcategories.
        </p>
      )}
    </div>
  );
}
