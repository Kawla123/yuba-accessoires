import { setRequestLocale } from "next-intl/server";
import { ScrollFrameHero } from "@/components/landing/ScrollFrameHero";
import { Collections } from "@/components/landing/Collections";
import { NewArrivals } from "@/components/landing/NewArrivals";
import { BestSellers } from "@/components/landing/BestSellers";
import { HouseTicker } from "@/components/landing/HouseTicker";
import { WhyYuba } from "@/components/landing/WhyYuba";
import { CategoryTiles } from "@/components/landing/CategoryTiles";
import { Reviews } from "@/components/landing/Reviews";
import {
  getNewArrivals,
  getBestSellers,
  getLandingCategories,
  getApprovedReviews,
} from "@/lib/queries/landing";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [newArrivals, bestSellers, categories, reviews] = await Promise.all([
    getNewArrivals(5),
    getBestSellers(5),
    getLandingCategories(5),
    getApprovedReviews(),
  ]);

  return (
    <main className="flex-1">
      <ScrollFrameHero />
      <Collections />
      <NewArrivals products={newArrivals} />
      <BestSellers products={bestSellers} />
      <HouseTicker />
      <WhyYuba />
      <CategoryTiles categories={categories} />
      <Reviews reviews={reviews} />
    </main>
  );
}
