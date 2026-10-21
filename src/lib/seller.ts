import { api } from "@/lib/api";
import type { Listing } from "@/lib/types/listing";

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
    "/seller/profile", { signal, cache: "no-store" },
  );
  if (!response?.success || !response.data?.id) {
    throw new Error("Profil seller gagal dimuat.");
  }
  return response.data;
}

export async function getSellerListings(sellerId: string, signal?: AbortSignal) {
  const listings: SellerListing[] = [];
  // The API has no total count; fetch all pages before calculating store totals.
  for (let offset = 0; ; offset += 100) {
    const response = await api<{ success: boolean; data: SellerListing[] }>(
      `/seller/${encodeURIComponent(sellerId)}/listings?limit=100&offset=${offset}`,
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
    "/seller/applications",
    { method: "POST", json: input },
  );

  if (!response || response.success !== true) {
    throw new Error(response?.message || "Pengajuan seller gagal dikirim.");
  }
}
