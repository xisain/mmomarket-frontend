import { Marketplace } from "@/components/marketplace";
import { SiteHeader, SiteFooter } from "@/components/site-shell";
import { Suspense } from "react";
import { connection } from "next/server";
import { gameService } from "@/lib/services/game.service";
import type { Game } from "@/lib/types/game";
import { Sparkles } from "lucide-react";

async function GameCatalog() {
  await connection();
  let games: Game[];
  try {
    games = await gameService.getAll();
  } catch (error) {
    console.error("Failed to load game catalog", error);
    return <Marketplace games={[]} gamesError />;
  }
  return <Marketplace games={games} />;
}

export default function Home() {
  return (
    <>
      <div className="announcement">
        <span className="announcement-dot" /> YOUR NEXT ADVENTURE STARTS HERE{" "}
        <Sparkles size={12} />
        <span className="announcement-extra">
          Marketplace untuk para petualang.
        </span>
      </div>
      <SiteHeader />
      <Suspense fallback={<Marketplace games={[]} gamesLoading />}>
        <GameCatalog />
      </Suspense>
      <SiteFooter />
    </>
  );
}
