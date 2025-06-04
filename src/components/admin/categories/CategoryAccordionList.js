// File: components/admin/categories/CategoryAccordionList.jsx
"use client";

import CategoryAccordionItem from "./CategoryAccordionItem";

export default function CategoryAccordionList({ categories, onDelete }) {
  if (!Array.isArray(categories) || categories.length === 0) {
    return <p className="text-gray-600 text-lg">No categories found.</p>;
  }

  return (
    <div className="space-y-4">
      {categories.map((cat) => (
        <CategoryAccordionItem
          key={cat._id}
          category={cat}
          onDelete={onDelete}
          level={0}
        />
      ))}
    </div>
  );
}
