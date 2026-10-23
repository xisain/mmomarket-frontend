import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ChevronRight, Package } from "lucide-react";
import { ListingGallery } from "@/components/listing/gallery";
import { GameOfferCard } from "@/components/game/offer-card";
import { ListingPurchase } from "@/components/listing/purchase";
import { SiteFooter, SiteHeader } from "@/components/site/shell";
import { getPageGame } from "@/lib/services/game-page";
import { gameMarketService } from "@/lib/services/game-market.service";
import { formatPrice } from "@/lib/utils/format";

type Params = Promise<{ slug: string; categori: string; listingSlug: string }>;

async function ListingContent({ params }: { params: Params }) {
  const { slug, categori, listingSlug } = await params;
  const game = await getPageGame(slug);
  const categories = await gameMarketService.getCategories(game);
  const category = categories.find((item) => item.slug === categori);
  if (!category) notFound();
  const listings = await gameMarketService.getListings(slug, categori);
  const listing = listings.find((item) => item.slug === listingSlug && item.game_id === game.id && item.category_id === category.id && item.status === "active");
  if (!listing) notFound();
  const recommendations = listings.filter((item) => item.id !== listing.id && item.game_id === game.id && item.category_id === category.id && item.status === "active").slice(0, 4);
  const categoryHref = `/game/${encodeURIComponent(game.slug)}/${encodeURIComponent(category.slug)}`;

  return (
    <div className="container neo-product-page">
      <nav className="neo-game-breadcrumb" aria-label="Breadcrumb">
        <Link href="/games">Game</Link><ChevronRight size={14} aria-hidden="true" />
        <Link href={`/game/${encodeURIComponent(game.slug)}`}>{game.name}</Link><ChevronRight size={14} aria-hidden="true" />
        <Link href={categoryHref}>{category.name}</Link><ChevronRight size={14} aria-hidden="true" />
        <span aria-current="page">{listing.name}</span>
      </nav>
      <section className="neo-product-overview" aria-labelledby="product-title">
        <div className="neo-product-content">
          <ListingGallery gameSlug={game.slug} name={listing.name} />
          <section className="neo-product-description" aria-labelledby="description-title">
            <h2 id="description-title">Deskripsi produk</h2>
            <p>{listing.description || "Seller belum menambahkan deskripsi untuk produk ini."}</p>
          </section>
        </div>
        <aside className="neo-product-info" aria-label="Detail dan pembelian produk">
          <Link className="neo-product-category" href={categoryHref}>{game.name} / {category.name}</Link>
          <h1 id="product-title">{listing.name}</h1>
          <div className="neo-product-seller"><span className="neo-seller-avatar" aria-hidden="true">{listing.seller.name.slice(0, 1).toUpperCase()}</span><div><small>Dijual oleh</small><strong>{listing.seller.name}</strong></div></div>
          <div className="neo-product-unit-price"><strong>{formatPrice(listing.price)}</strong><span>per paket · {listing.quantity_per_unit.toLocaleString("id-ID")} {listing.quantity_per_unit === 1 ? "layanan" : "unit"}</span></div>
          <dl className="listing-details neo-product-facts">
            <div><dt>Game</dt><dd>{game.name}</dd></div>
            <div><dt>Kategori</dt><dd>{category.name}</dd></div>
            <div><dt>Region</dt><dd>{listing.region.name || "Belum ditentukan"}</dd></div>
            <div><dt>Server</dt><dd>{listing.server.name || "Belum ditentukan"}</dd></div>
            <div><dt>Ketersediaan</dt><dd>{listing.stock_type === "finite" ? `${(listing.stock_quantity ?? 0).toLocaleString("id-ID")} paket` : "Sesuai kapasitas seller"}</dd></div>
          </dl>
          <ListingPurchase key={listing.id} listing={listing} />
        </aside>
      </section>
      <section className="neo-product-recommendations" aria-labelledby="recommendations-title">
        <div className="neo-section-heading"><div><span className="neo-section-kicker">LANJUT JELAJAHI</span><h2 id="recommendations-title">Rekomendasi untukmu</h2><p>Penawaran {category.name} lainnya di {game.name}.</p></div><Link className="neo-back-link" href={categoryHref}>Lihat semua <ChevronRight size={16} /></Link></div>
        {recommendations.length ? <div className="neo-recommendation-grid">{recommendations.map((item) => <GameOfferCard key={item.id} game={game} category={category} listing={item} />)}</div> : <div className="neo-listing-empty"><Package size={32} /><h3>Belum ada rekomendasi lain</h3><p>Produk lain dari game dan kategori yang sama akan ditampilkan di sini.</p><Link className="neo-filter-done" href={categoryHref}>Kembali ke kategori</Link></div>}
      </section>
    </div>
  );
}

export default function ListingDetailPage({ params }: { params: Params }) {
  return <><SiteHeader /><main id="main-content" className="neo-game-page"><Suspense fallback={<div className="container neo-loading" role="status">Memuat detail listing…</div>}><ListingContent params={params} /></Suspense></main><SiteFooter /></>;
}
