import type { Metadata } from "next";
import { SellerDashboard } from "@/components/seller-dashboard";
import { Dashboard } from "@/components/dashboard";

export const metadata: Metadata = { title: "Dashboard Seller" };
export default async function SellerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SellerDashboard key={id} sellerId={id} />;
  // return <Dashboard key={id} sellerId={id} />;
}
