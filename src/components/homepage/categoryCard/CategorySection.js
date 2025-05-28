"use client";

import CategoryCard from "./CategoryCard";

export default function CategorySection({ sectionData }) {
  return (
    <section className="py-10">
      <div className="grid grid-cols-4 gap-6">
        {sectionData.categories.map((category, index) => (
          <CategoryCard key={index} category={category} />
        ))}
      </div>
    </section>
  );
}
