"use client";

import Link from "next/link";

export default function GameError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <main id="main-content" className="section container empty-state" role="alert">
      <h1>Detail game gagal dimuat</h1>
      <p>Silakan coba lagi dalam beberapa saat.</p>
      <button className="neo-button secondary" onClick={() => retry()}>Coba lagi</button>
      <Link className="text-link" href="/#games">Kembali ke katalog</Link>
    </main>
  );
}
