import type { GameOffer } from "@/lib/types/game-market";

/** UI quotation only; no orders or payments are created here. */
export function getPurchaseQuote(listing: GameOffer, value: string) {
  const maxQuantity = listing.stock_type === "finite"
    ? Math.max(0, Math.floor(listing.stock_quantity ?? 0))
    : Number.MAX_SAFE_INTEGER;
  const quantity = Number(value);
  let error = "";

  if (listing.status !== "active" || maxQuantity === 0) {
    error = "Listing sedang tidak tersedia.";
  } else if (!/^\d+$/.test(value) || !Number.isSafeInteger(quantity) || quantity < 1) {
    error = "Masukkan jumlah paket berupa bilangan bulat, minimal 1.";
  } else if (quantity > maxQuantity) {
    error = `Stok tersedia hanya ${maxQuantity.toLocaleString("id-ID")} paket.`;
  }

  const price = Number(listing.price);
  const total = price * quantity;
  if (!error && (!Number.isFinite(price) || price < 0 || !Number.isSafeInteger(Math.round(total * 100)))) {
    error = "Total harga tidak dapat dihitung untuk jumlah ini.";
  }

  return { quantity, maxQuantity, total: error ? 0 : total, error };
}
