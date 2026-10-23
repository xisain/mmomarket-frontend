import type { GameCategory } from "@/lib/types/game";
import type { Listing } from "@/lib/types/listing";

export interface MarketCategory extends GameCategory {
  description: string;
}

/** Listing plus display fields; an API adapter can join these from related records. */
export interface GameOffer extends Listing {
  seller: { id: string; name: string };
  region: { id: string; name: string };
  server: { id: string; name: string };
}
