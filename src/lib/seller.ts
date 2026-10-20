import { api } from "@/lib/api";

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
