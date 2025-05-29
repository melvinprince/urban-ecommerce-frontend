import ScrollColorText from "@/components/common/ScrollColorText";
import AccessoriesShowcase from "@/components/homepage/AccessoriesShowcase";
import Banner from "@/components/homepage/banner/Banner";
import ShopByCategory from "@/components/homepage/categoryCard/ShopByCategory";
import KidsShowcase from "@/components/homepage/KidsShowcase";
import MensShowcase from "@/components/homepage/MensShowcase";
import ShoeShowcase from "@/components/homepage/ShoeShowcase";
import WomensShowcase from "@/components/homepage/WomensShowcase";
import HomeProductSection from "@/components/products/HomeProductSection";
import RecentlyViewed from "@/components/products/RecentlyViewed";

export default function page() {
  return (
    <div>
      <Banner />
      {/* <ShopByCategory /> */}
      <ScrollColorText text="Discover Timeless Women's Fashion" size="6rem" />
      <WomensShowcase />
      <ScrollColorText text="Elevate Your Look with Men's Style" size="6rem" />
      <MensShowcase />
      <ScrollColorText text="Playful Styles for Growing Kids" size="6rem" />
      <KidsShowcase />
      <ScrollColorText text="Step Into Style with Every Pair" size="6rem" />
      <ShoeShowcase />
      <ScrollColorText text="Accessories That Define Your Style" size="6rem" />
      <AccessoriesShowcase />

      {/* <HomeProductSection
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
      <RecentlyViewed /> */}
    </div>
  );
}
