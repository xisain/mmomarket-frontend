import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { GameArt } from "@/components/game-art";
import { Marketplace } from "@/components/marketplace";
import { SiteHeader, SiteFooter } from "@/components/site-shell";
import { ApiError } from "@/lib/api";
import { getGameArtwork } from "@/lib/game-presentation";
import { gameService } from "@/lib/services/game.service";

async function GameContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = await gameService.getBySlug(slug).catch((error: unknown) => {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  });

  return (
    <>
      <section className="section container" aria-labelledby="game-title">
        <Link className="text-link" href="/#games">Kembali ke katalog</Link>
        <div className="section-heading">
          <div>
            <span className="section-kicker">{game.publisher}</span>
            <h1 id="game-title">{game.name}</h1>
            <p>{game.description}</p>
          </div>
          <span className="sample-note">{game.is_active ? "Aktif" : "Tidak aktif"}</span>
        </div>
        <div className="game-image"><GameArt variant={getGameArtwork(game.slug)} /></div>
        <dl className="listing-details">
          <div><dt>Publisher</dt><dd>{game.publisher || "Belum tersedia"}</dd></div>
          <div><dt>Categories</dt><dd>{game.categories.length ? game.categories.map((category) => <span key={category.id}>{category.name}<br /></span>) : "Belum ada kategori"}</dd></div>
          <div><dt>Regions</dt><dd>{game.regions.length ? game.regions.map((region) => <span key={region.id}>{region.name}{!region.is_active && " (Tidak aktif)"}<br /></span>) : "Belum ada region"}</dd></div>
        </dl>
      </section>
      <Marketplace games={[game]} detailMode />
    </>
  );
}

export default function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <>
      <SiteHeader />
      <Suspense fallback={<div className="empty-state" role="status">Memuat detail game…</div>}>
        <GameContent params={params} />
      </Suspense>
      <SiteFooter />
    </>
  );
}
