"use client";

import Link from "next/link";

export default function GameError({ retry }: { error: Error; retry: () => void }) {
  return (
    <main id="main-content" className="section container empty-state" role="alert">
      <h1>Halaman game gagal dimuat</h1>
      <p>Silakan coba muat ulang halaman.</p>
      <button className="neo-button secondary" onClick={retry}>Coba lagi</button>
      <Link className="text-link" href="/games">Kembali ke katalog</Link>
    </main>
  );
}
