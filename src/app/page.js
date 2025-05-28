import Banner from "@/components/homepage/banner/Banner";
import ShopByCategory from "@/components/homepage/categoryCard/ShopByCategory";
import Showcase from "@/components/homepage/Showcase";
import HomeProductSection from "@/components/products/HomeProductSection";
import RecentlyViewed from "@/components/products/RecentlyViewed";

export default function page() {
  return (
    <div className="">
      <Banner />
      {/* <ShopByCategory /> */}
      <Showcase />
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
      <RecentlyViewed />
    </div>
  );
}
