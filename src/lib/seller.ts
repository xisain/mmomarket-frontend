import { api } from "@/lib/api";
import type { Listing } from "@/lib/types/listing";
import type { SellerOrder, SellerOrdersResponse } from "./types/order";
import { SellerTransaction } from "./types/seller";
const baseUri = 'seller'
function mapOrderToTransaction(sellerOrder: SellerOrder): SellerTransaction {
  const location = [
    sellerOrder.listing.server.name,
    sellerOrder.listing.region.name,
  ].filter(Boolean);

  return {
    id: sellerOrder.id,
    product: sellerOrder.listing.name,
    game: sellerOrder.listing.game.name,
    category: sellerOrder.listing.category.name,
    buyer: sellerOrder.buyer.name,
    server: location.join(" · ") || "—",
    quantity: sellerOrder.quantity,
    unitPrice: sellerOrder.unit_price,
    totalAmount: sellerOrder.total_amount,
    currency: sellerOrder.currency,
    status: sellerOrder.status,
    createdAt: sellerOrder.created_at,
  };
}

export type SellerStatus = "pending" | "approved" | "rejected" | "suspended";
export type SellerSummary = {
  id: string;
  shop_name: string;
  slug: string;
  status: SellerStatus;
};

export type SellerProfile = SellerSummary & {
  owner_id: string;
  description: string | null;
  created_at: string;
};
export type SellerListing = Omit<Listing, "price"> & {
  price: string | number;
};

export function sellerDashboardHref(seller?: SellerSummary | null) {
  return seller && seller.status !== "pending"
    ? `/seller/${encodeURIComponent(seller.id)}`
    : null;
}

export async function getSellerProfile(signal?: AbortSignal) {
  const response = await api<{ success: boolean; data: SellerProfile }>(
    `/${baseUri}/profile`, { signal, cache: "no-store" },
  );
  if (!response?.success || !response.data?.id) {
    throw new Error("Profil seller gagal dimuat.");
  }
  return response.data;
}

export async function getSellerListings( signal?: AbortSignal) {
  const listings: SellerListing[] = [];
  // The API has no total count; fetch all pages before calculating store totals.
  for (let offset = 0; ; offset += 100) {
    const response = await api<{ success: boolean; data: SellerListing[] }>(
      `/${baseUri}/listings?limit=100&offset=${offset}`,
      { signal, cache: "no-store" },
    );
    if (!response?.success || !Array.isArray(response.data)) {
      throw new Error("Listing toko gagal dimuat.");
    }
    listings.push(...response.data);
    if (response.data.length < 100) return listings;
  }
}

export type SellerInput = {
  shop_name: string;
  slug: string;
  description?: string;
};

export async function applyForSeller(input: SellerInput) {
  const response = await api<{ success: boolean; message?: string }>(
    `${baseUri}/applications`,
    { method: "POST", json: input },
  );

  if (!response || response.success !== true) {
    throw new Error(response?.message || "Pengajuan seller gagal dikirim.");
  }
}



export async function getSellerTransactions(
  signal?: AbortSignal,
): Promise<SellerTransaction[]> {
  const response = await api<SellerOrdersResponse>(`${baseUri}/orders`, {
    signal,
    cache: "no-store",
  });

  console.log((response.orders ?? []).map(mapOrderToTransaction));
  if (
    !response ||
    !("orders" in response) ||
    (response.orders !== null && !Array.isArray(response.orders))
  ) {
    throw new Error("Format respons transaksi tidak sesuai.");
  }
  return (response.orders ?? []).map(mapOrderToTransaction);
}
