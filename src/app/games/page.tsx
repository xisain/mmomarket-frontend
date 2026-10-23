import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { GamesCatalog } from "@/components/games/catalog";
import { SiteFooter, SiteHeader } from "@/components/site/shell";
import { gameService } from "@/lib/services/game.service";

export const metadata: Metadata = { title: "Semua Game" };

async function CatalogContent() {
  await connection();
  const games = await gameService.getAll();
  return <GamesCatalog games={games} />;
}

export default function GamesPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="neo-game-page">
        <Suspense fallback={<div className="container neo-loading" role="status">Memuat seluruh game…</div>}>
          <CatalogContent />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
