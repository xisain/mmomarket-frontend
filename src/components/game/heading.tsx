
import Link from "next/link";
import {
  ChevronRight,
  Gamepad2,
  Globe2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { GameArt } from "./art";
import { getGameArtwork } from "@/lib/game-presentation";
import type { GameDetail } from "@/lib/types/game";

type GameHeadingProps = {
  game: GameDetail;
  category?: string;
};

export function GameHeading({
  game,
  category,
}: GameHeadingProps) {
  const activeRegions = game.regions.filter(
    (region) => region.is_active,
  ).length;

  return (
    <section className="container neo-game-heading" aria-label={`Tentang ${game.name}`}>
      <nav
        className="neo-game-breadcrumb"
        aria-label="Breadcrumb"
      >
        <Link href="/games">Game</Link>
        <ChevronRight size={14} aria-hidden="true" />

        {category ? (
          <>
            <Link href={`/game/${encodeURIComponent(game.slug)}`}>
              {game.name}
            </Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span aria-current="page">{category}</span>
          </>
        ) : (
          <span aria-current="page">{game.name}</span>
        )}
      </nav>

      <div className="neo-game-hero">
        <div className="neo-game-hero-art">
          <GameArt variant={getGameArtwork(game.slug)} />
        </div>

        <div className="neo-game-hero-content">
          <div className="neo-game-hero-kicker">
            <Gamepad2 size={15} />
            {game.publisher || "MMO MARKET"}
          </div>

          <h1>{game.name}</h1>

          <p className="neo-game-description">
            {game.description ||
              "Temukan berbagai kebutuhan gaming untuk petualangan berikutnya."}
          </p>

          <div className="neo-game-meta">
            <span
              className={`neo-status-badge ${
                game.is_active ? "is-active" : "is-inactive"
              }`}
            >
              {game.is_active ? (
                <CheckCircle2 size={15} />
              ) : (
                <XCircle size={15} />
              )}
              {game.is_active ? "Game aktif" : "Tidak aktif"}
            </span>

            <span className="neo-status-badge neo-region-badge">
              <Globe2 size={15} />
              {activeRegions} Region
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
