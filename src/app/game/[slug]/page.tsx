
import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowUpRight,
  Coins,
  Package,
  Swords,
  UserRound,
  Zap,
  Gamepad2,
} from "lucide-react";

import { GameHeading } from "@/components/game/heading";
import { SiteHeader, SiteFooter } from "@/components/site/shell";
import { getPageGame } from "@/lib/services/game-page";
import { gameMarketService } from "@/lib/services/game-market.service";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const categoryStyles = {
  currency: {
    icon: Coins,
    className: "neo-category-yellow",
  },
  boosting: {
    icon: Swords,
    className: "neo-category-purple",
  },
  account: {
    icon: UserRound,
    className: "neo-category-cyan",
  },
  item: {
    icon: Package,
    className: "neo-category-pink",
  },
  "top-up": {
    icon: Zap,
    className: "neo-category-green",
  },
};

const fallbackColors = [
  "neo-category-yellow", "neo-category-purple", "neo-category-cyan",
  "neo-category-pink", "neo-category-green",
];

async function GameCategories({ params }: PageProps) {
  const { slug } = await params;
  console.log(slug);
  const game = await getPageGame(slug);
  const categories = await gameMarketService.getCategories(game);

  return (
    <>
      <GameHeading game={game} />

      <section
        className="container neo-game-categories"
        aria-labelledby="categories-title"
      >
        <div className="neo-section-heading">
          <div>
            <span className="neo-section-kicker">
              01 / GAME MARKETPLACE
            </span>

            <h2 id="categories-title">
              Belanja berdasarkan kategori
            </h2>

            <p>
              Pilih kebutuhan gaming kamu di {game.name}.
            </p>
          </div>

          <span className="neo-count-badge">
            {categories.length} KATEGORI
          </span>
        </div>

        {categories.length > 0 ? (
          <div className="neo-category-grid">
            {categories.map((category, index) => {
              const style =
                categoryStyles[
                  category.slug as keyof typeof categoryStyles
                ];

              const Icon = style?.icon ?? Gamepad2;

              const color =
                style?.className ??
                fallbackColors[index % fallbackColors.length];

              return (
                <Link
                  key={category.id}
                  href={`/game/${encodeURIComponent(
                    game.slug,
                  )}/${encodeURIComponent(category.slug)}`}
                  className={`neo-category-card ${color}`}
                >
                  <div className="neo-category-card-top">
                    <span className="neo-category-icon">
                      <Icon size={30} strokeWidth={2.5} />
                    </span>

                    <ArrowUpRight
                      className="neo-category-arrow"
                      size={25}
                    />
                  </div>

                  <div className="neo-category-card-content">
                    <h3>{category.name}</h3>

                    <p>
                      {category.description ||
                        `Jelajahi penawaran ${category.name} untuk ${game.name}.`}
                    </p>
                  </div>

                  <span className="neo-category-card-footer">
                    LIHAT LISTING
                    <ArrowUpRight size={17} />
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="neo-empty">
            <Package size={36} />
            <h3>Belum ada kategori</h3>
            <p>
              Kategori untuk game ini belum tersedia.
            </p>
          </div>
        )}
      </section>
    </>
  );
}

export default function GamePage({ params }: PageProps) {
  return (
    <>
      <SiteHeader />

      <main id="main-content" className="neo-game-page">
        <Suspense
          fallback={
            <div className="container neo-loading">
              Memuat kategori game…
            </div>
          }
        >
          <GameCategories params={params} />
        </Suspense>
      </main>

      <SiteFooter />
    </>
  );
}
