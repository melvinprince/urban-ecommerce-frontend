import ProductCard from "@/components/products/ProductCard";

export default function ProductGrid({ products }) {
  // 🛡️ Ensure products is always an array
  console.log("Products in ProductGrid:", products);

  const safeProducts = Array.isArray(products) ? products : [];

  if (safeProducts.length === 0) {
    return <p className="text-center py-10">No products found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {safeProducts.map((product, index) => (
        <div key={product._id || index}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
