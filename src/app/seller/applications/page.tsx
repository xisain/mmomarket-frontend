import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { SiteHeader } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Daftar Seller",
  description:
    "Daftarkan tokomu dan mulai perjalanan sebagai seller di MMO Market.",
};
export default function SellerApplicationsPage() {
  return (
    <>
      <SiteHeader minimal />
      <AuthForm mode="seller" />
    </>
  );
}
