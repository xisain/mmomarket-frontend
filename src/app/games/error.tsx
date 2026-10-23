"use client";

import Link from "next/link";

export default function GamesError({ retry }: { error: Error; retry: () => void }) {
  return (
    <main id="main-content" className="container section empty-state" role="alert">
      <h1>Katalog game gagal dimuat</h1>
      <p>Silakan coba lagi untuk memuat seluruh game.</p>
      <button className="neo-button secondary" onClick={retry}>Coba lagi</button>
      <Link href="/" className="text-link">Kembali ke beranda</Link>
    </main>
  );
}
