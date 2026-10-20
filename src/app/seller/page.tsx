import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard";

export const metadata: Metadata = { title: "Dashboard Seller" };
export default function SellerPage() { return <Dashboard role="seller" />; }
