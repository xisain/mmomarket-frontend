import Link from "next/link";
import { ArrowUpRight, Eye } from "lucide-react";
import { GameArt } from "./art";
import { getGameArtwork } from "@/lib/game-presentation";
import type { Game } from "@/lib/types/game";
import type { GameOffer, MarketCategory } from "@/lib/types/game-market";
import { formatPrice } from "@/lib/utils/format";

export function GameOfferCard({ game, category, listing, onPreview }: {
  game: Game;
  category: MarketCategory;
  listing: GameOffer;
  onPreview?: (listing: GameOffer) => void;
}) {
  const href = `/game/${encodeURIComponent(game.slug)}/${encodeURIComponent(category.slug)}/${encodeURIComponent(listing.slug)}`;

  return (
    <article className="neo-listing-card">
      <Link className="neo-listing-art" href={href} aria-label={`Lihat ${listing.name}`}>
        <GameArt variant={getGameArtwork(game.slug)} />
        <span className="neo-listing-category">{category.name}</span>
      </Link>
      <div className="neo-listing-body">
        <span className="neo-listing-game">{game.name}</span>
        <h3><Link href={href}>{listing.name}</Link></h3>
        <span className="neo-listing-region">
          {[listing.region.name, listing.server.name].filter(Boolean).join(" / ") || "Region tidak ditentukan"}
        </span>
        <div className="neo-listing-seller">
          <span className="neo-seller-avatar" aria-hidden="true">{listing.seller.name.slice(0, 1).toUpperCase()}</span>
          <span>{listing.seller.name}</span>
        </div>
        <div className="neo-listing-price">
          <div>
            <small>{listing.quantity_per_unit === 1 ? "Per layanan" : `Per ${listing.quantity_per_unit.toLocaleString("id-ID")} unit`}</small>
            <strong>{formatPrice(listing.price)}</strong>
          </div>
          <Link className="neo-listing-detail-link" href={href} aria-label={`Detail ${listing.name}`}><ArrowUpRight size={19} /></Link>
        </div>
        {onPreview && <button type="button" className="neo-quick-preview" onClick={() => onPreview(listing)}><Eye size={15} aria-hidden="true" /> Preview cepat</button>}
      </div>
    </article>
  );
}
