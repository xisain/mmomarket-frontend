/** Presentation fixtures, not production inventory. Fields mirror the Go models.
 * Sources: game_handler.go, listing migration, and seller_handler.go.
 * Artwork, labels, and currency are presentation metadata, not API fields.
 */
import type { Game } from "@/lib/types/game";
import type { Listing } from "@/lib/types/listing";

// Labels for local listing previews only, never used as the game catalog.
const fixtureGames: Record<string, Pick<Game, "id" | "name" | "slug">> = {
  "game-wow": { id: "game-wow", name: "World of Warcraft", slug: "world-of-warcraft" },
  "game-albion": { id: "game-albion", name: "Albion Online", slug: "albion-online" },
  "game-ffxiv": { id: "game-ffxiv", name: "Final Fantasy XIV", slug: "final-fantasy-xiv" },
  "game-bdo": { id: "game-bdo", name: "Black Desert Online", slug: "black-desert-online" },
};

export function getListingGame(listing: Listing, games: Game[]) {
  const fixture = fixtureGames[listing.game_id];
  return games.find((game) => game.id === listing.game_id || game.slug === fixture?.slug) ?? fixture;
}

export const fixtureCategories = {
  currency: "7c5842a5-436c-403b-b4f7-c41cb0795a16",
  boosting: "e87ed247-ca49-4cda-8511-58a9578857c2",
};

export function getListingCategory(listing: Listing) {
  return Object.entries(fixtureCategories).find(([, id]) => id === listing.category_id)?.[0];
}

export const regions = [
  { id: "region-wow", game_id: "game-wow", name: "North America" },
  { id: "region-albion", game_id: "game-albion", name: "Asia" },
  { id: "region-ffxiv", game_id: "game-ffxiv", name: "Japan" },
  { id: "region-bdo", game_id: "game-bdo", name: "Southeast Asia" },
];
export const servers = [
  { id: "server-wow", game_region_id: "region-wow", name: "Area 52" },
  { id: "server-albion", game_region_id: "region-albion", name: "Singapore" },
  { id: "server-ffxiv", game_region_id: "region-ffxiv", name: "Elemental" },
  { id: "server-bdo", game_region_id: "region-bdo", name: "SEA" },
];
export const sellers = [
  { id: "seller-1", shop_name: "Goldsmith Guild", slug: "goldsmith-guild", status: "approved" },
  { id: "seller-2", shop_name: "Next Level", slug: "next-level", status: "approved" },
];
export const listings: Listing[] = [
  { id: "listing-1", game_id: "game-wow", category_id: fixtureCategories.currency, game_region_id: "region-wow", server_id: "server-wow", seller_id: "seller-1", name: "100.000 Gold — Siap berpetualang", slug: "wow-gold", description: "Contoh penawaran 100.000 gold untuk server Area 52, region North America. Detail dan ketersediaan akan mengikuti data seller setelah integrasi.", price: "145000.00", stock_type: "finite", stock_quantity: 25, quantity_per_unit: 100000, status: "active" },
  { id: "listing-2", game_id: "game-albion", category_id: fixtureCategories.currency, game_region_id: "region-albion", server_id: "server-albion", seller_id: "seller-1", name: "10 Juta Silver — Bekal petualangan", slug: "albion-silver", description: "Contoh penawaran 10 juta silver untuk Albion Online, server Singapore. Harga dan stok adalah ilustrasi antarmuka.", price: "75000.00", stock_type: "finite", stock_quantity: 40, quantity_per_unit: 10000000, status: "active" },
  { id: "listing-3", game_id: "game-ffxiv", category_id: fixtureCategories.boosting, game_region_id: "region-ffxiv", server_id: "server-ffxiv", seller_id: "seller-2", name: "Leveling — Mulai chapter berikutnya", slug: "ffxiv-leveling", description: "Contoh layanan leveling yang ditangani langsung oleh seller. Lingkup, estimasi, dan metode pemenuhan ditentukan pada penawaran final.", price: "250000.00", stock_type: "unlimited", stock_quantity: null, quantity_per_unit: 1, status: "active" },
  { id: "listing-4", game_id: "game-bdo", category_id: fixtureCategories.boosting, game_region_id: "region-bdo", server_id: "server-bdo", seller_id: "seller-2", name: "Leveling — Bangun karakter impian", slug: "bdo-leveling", description: "Contoh layanan leveling untuk Black Desert Online SEA. Seller mengelola progres dan bukti penyelesaian secara langsung.", price: "180000.00", stock_type: "unlimited", stock_quantity: null, quantity_per_unit: 1, status: "active" },
];
