"use client";

/* COMPOUND COMPONENT:
 *
 * <CategoryProductShowcase
 *   categories={[...4 category objects...]}
 *   products={[...2+ product objects...]}
 *   reverse={false}              // swap sides
 *   carouselProps={{ ... }}      // pass-through to ProductCarousel
 *   cardVariant="default"        // or "minimal"
 *   className=""                 // extra Tailwind classes
 * />
 */

import CategoryCard from "./CategoryCard";
import ProductCarousel from "./ProductCarousel";
import clsx from "clsx";

export default function CategoryProductShowcase({
  categories,
  products,
  reverse = false,
  carouselProps = {},
  cardVariant = "default",
  className = "",
}) {
  if (!categories || categories.length < 4)
    throw new Error("Provide at least 4 category objects");
  if (!products || products.length < 2)
    throw new Error("Provide at least 2 product objects");

  const left = (
    <div className="grid grid-cols-2 gap-[3rem] h-full">
      {categories.slice(0, 4).map((cat) => (
        <CategoryCard key={cat.link} category={cat} variant={cardVariant} />
      ))}
    </div>
  );

  const right = (
    <div className="h-full">
      <ProductCarousel products={products} {...carouselProps} />
    </div>
  );

  return (
    <section
      className={clsx(
        "w-full h-[60vh] md:h-[70vh] flex flex-col md:flex-row gap-6",
        reverse ? "md:flex-row-reverse" : "",
        className
      )}
    >
      <div className="basis-full md:basis-[65%]">{left}</div>
      <div className="basis-full md:basis-[35%]">{right}</div>
    </section>
  );
}
