import { Suspense } from "react";
import { notFound } from "next/navigation";
import { GameHeading } from "@/components/game/heading";
import { GameListings } from "@/components/game/listings";
import { SiteHeader, SiteFooter } from "@/components/site/shell";
import { getPageGame } from "@/lib/services/game-page";
import { gameMarketService } from "@/lib/services/game-market.service";

type Params = Promise<{ slug: string; categori: string }>;

async function CategoryListings({ params }: { params: Params }) {
  const { slug, categori } = await params;
  const game = await getPageGame(slug);
  const categories = await gameMarketService.getCategories(game);
  const category = categories.find((item) => item.slug === categori);
  if (!category) notFound();
  const listings = await gameMarketService.getListings(slug, categori);

  return (
    <>
      <GameHeading game={game} category={category.name} />
      <GameListings key={`${slug}/${categori}`} game={game} category={category} categories={categories} listings={listings} />
    </>
  );
}

export default function CategoryPage({ params }: { params: Params }) {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="neo-game-page">
        <Suspense fallback={<div className="empty-state" role="status">Memuat listing…</div>}>
          <CategoryListings params={params} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
