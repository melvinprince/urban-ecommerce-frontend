import CategoryMegaMenu from "@/components/categories/CategoryMegaMenu";
import AccessoriesShowcase from "@/components/homepage/AccessoriesShowcase";
import HomeProductSection from "@/components/products/HomeProductSection";
import RecentlyViewed from "@/components/products/RecentlyViewed";
import apiService from "@/lib/apiService";

export default async function CategoriesPage() {
  const { data: cats } = await apiService.categories.getAll();

  return (
    <div className="p-6">
      <CategoryMegaMenu categories={cats} />
      <div className="my-[2rem]" />
      <HomeProductSection
        title="Latest Arrivals"
        query={{ sort: "createdAt:desc", limit: 8 }}
      />
      <RecentlyViewed />
    </div>
  );
}
