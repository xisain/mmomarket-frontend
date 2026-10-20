import type { Metadata } from "next";
import { LogoutButton } from "@/components/logout-button";
import { SiteHeader } from "@/components/site-shell";

export const metadata: Metadata = { title: "Keluar" };

export default function LogoutPage() {
  return (
    <>
      <SiteHeader minimal />
      <main id="main-content" className="container">
        <h1>Keluar dari akun</h1>
        <p>Klik tombol berikut untuk mengakhiri sesi kamu.</p>
        <LogoutButton />
      </main>
    </>
  );
}
