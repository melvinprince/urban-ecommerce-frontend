import CategoryCarousel from "@/components/categories/CategoryCarousel";
import CategoryMegaMenu from "@/components/categories/CategoryMegaMenu";
import HomeProductSection from "@/components/products/HomeProductSection";
import RecentlyViewed from "@/components/products/RecentlyViewed";
import apiService from "@/lib/apiService";

const slides = [
  {
    image: "/images/categories/categoryCarousel/carousel3.jpeg",
    link: "/categories/women-sportswear",
    text: "Up to 70 % OFF\nWomen’s Sportswear",
    button: "Shop Now",
    side: "left",
  },
  {
    image: "/images/categories/categoryCarousel/carousel1.jpeg",
    link: "/categories/men-hoodies",
    text: "Fresh Hoodies\nfor Him",
    button: "Explore",
    side: "right",
  },
  {
    image: "/images/categories/categoryCarousel/carousel2.jpeg",
    link: "/categories/kids-sneakers",
    text: "Kids’ Sneakers\nJust Landed",
    button: "Grab a Pair",
    side: "left",
  },
];

export default async function CategoriesPage() {
  const { data: cats } = await apiService.categories.getAll();

  return (
    <div>
      <CategoryCarousel slides={slides} />
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
