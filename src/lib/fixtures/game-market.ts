import type { MarketCategory } from "@/lib/types/game-market";

/** Dummy inventory only. Never submit these IDs to transaction APIs. */
export const marketCategories: MarketCategory[] = [
  { id: "demo-currency", slug: "currency", name: "Currency", description: "Gold, silver, dan bekal lainnya untuk petualanganmu." },
  { id: "demo-boosting", slug: "boosting", name: "Boosting", description: "Bantuan leveling dan progres karakter dari seller pilihan." },
];

export const offerTemplates = [
  { seller: "Goldsmith Guild", suffix: "Paket starter", price: "75000", stock: 24, quantity: 100000 },
  { seller: "Next Level", suffix: "Paket petualang", price: "145000", stock: 12, quantity: 250000 },
  { seller: "Quest Supply", suffix: "Paket lengkap", price: "250000", stock: 8, quantity: 500000 },
];
