import HomeProductSection from "@/components/products/HomeProductSection";
import RecentlyViewed from "@/components/products/RecentlyViewed";

export default function page() {
  return (
    <div className="text-5xl">
      Urban Home
      <RecentlyViewed />
      <HomeProductSection
        title="Featured Products"
        query={{ isFeatured: true, limit: 8 }}
      />
      <HomeProductSection
        title="Best Sellers"
        query={{ sort: "rating.count:desc", limit: 8 }}
      />
      <HomeProductSection
        title="Special Discounts"
        query={{ discountOnly: true, limit: 8 }}
      />
      <HomeProductSection
        title="Latest Arrivals"
        query={{ sort: "createdAt:desc", limit: 8 }}
      />
      <HomeProductSection
        title="Top Picks of the Month"
        query={{ tags: "top-pick", limit: 8 }}
      />
    </div>
  );
}
