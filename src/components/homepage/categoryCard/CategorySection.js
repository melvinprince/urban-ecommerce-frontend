"use client";

import CategoryCard from "./CategoryCard";

export default function CategorySection({ sectionData }) {
  return (
    <section className="py-10">
      <h2 className="text-2xl font-bold mb-6">{sectionData.name}</h2>
      <div className="grid grid-cols-3 gap-6">
        {sectionData.categories.map((category) => (
          <CategoryCard key={category.link} category={category} />
        ))}
      </div>
    </section>
  );
}
