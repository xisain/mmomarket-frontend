import { marketCategories } from "@/lib/fixtures/game-market";
import type { GameDetail } from "@/lib/types/game";
import type { GameOffer, MarketCategory } from "@/lib/types/game-market";
import { api } from "@/lib/api";


type ListingResponse = Omit<GameOffer, "seller" | "region" | "server"> & {
  seller: { id: string | null; name: string | null } | null;
  region: { id: string | null; name: string | null } | null;
  server: { id: string | null; name: string | null } | null;
};

export const gameMarketService = {
  async getCategories(game: GameDetail): Promise<MarketCategory[]> {
    if (!game.categories.length) return marketCategories;
    return game.categories.map((category) => ({
      ...category,
      description: marketCategories.find((item) => item.slug === category.slug)?.description
        ?? `Temukan penawaran ${category.name.toLowerCase()} untuk ${game.name}.`,
    }));
  },

  async getListings(
    gameSlug: string,
    categorySlug: string,
  ): Promise<GameOffer[]> {
    const response = await api<{ success: boolean; data: ListingResponse[] }>(
      `/listings/${encodeURIComponent(gameSlug)}/${encodeURIComponent(categorySlug)}`,
      { cache: "no-store" },
    );

    if (response?.success !== true || !Array.isArray(response.data)) {
      throw new Error("Format respons listing tidak sesuai kontrak backend.");
    }

    // Related records can be null; components always receive display objects.
    return response.data.map((listing) => ({
      ...listing,
      seller: {
        id: listing.seller?.id ?? listing.seller_id,
        name: listing.seller?.name || "Seller",
      },
      region: {
        id: listing.region?.id ?? listing.game_region_id ?? "",
        name: listing.region?.name ?? "",
      },
      server: {
        id: listing.server?.id ?? listing.server_id ?? "",
        name: listing.server?.name ?? "",
      },
    }));
  },
};
