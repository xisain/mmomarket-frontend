"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Gamepad2, Search, X } from "lucide-react";
import { GameArt } from "@/components/game/art";
import { getGameArtwork } from "@/lib/game-presentation";
import type { Game } from "@/lib/types/game";

export function GamesCatalog({ games }: { games: Game[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("default");
  const visibleGames = games.filter((game) =>
    `${game.name} ${game.publisher}`.toLowerCase().includes(query.trim().toLowerCase()),
  ).sort((a, b) => sort === "az" ? a.name.localeCompare(b.name, "id") : sort === "za" ? b.name.localeCompare(a.name, "id") : 0);

  return (
    <section className="container neo-all-games" aria-labelledby="games-title">
      <nav className="neo-game-breadcrumb" aria-label="Breadcrumb"><Link href="/">Beranda</Link><span aria-hidden="true">/</span><span aria-current="page">Semua game</span></nav>
      <div className="neo-catalog-banner">
        <div>
          <span className="neo-section-kicker">TEMUKAN DUNIAMU</span>
          <h1 id="games-title">Semua game, satu tempat.</h1>
          <p>Pilih game favoritmu, jelajahi kategori, dan temukan kebutuhan bermainmu.</p>
        </div>
        <span className="neo-count-badge"><Gamepad2 size={18} aria-hidden="true" /> {games.length} GAME</span>
      </div>
      <div className="neo-market-toolbar">
        <div className="neo-search" role="search">
          <Search size={20} aria-hidden="true" />
          <input type="search" aria-label="Cari game atau publisher" placeholder="Cari game atau publisher…" value={query} onChange={(event) => setQuery(event.target.value)} />
          {query && <button type="button" aria-label="Hapus pencarian" onClick={() => setQuery("")}><X size={18} /></button>}
        </div>
        <select className="neo-sort" aria-label="Urutkan game" value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="default">Urutan default</option><option value="az">Nama A–Z</option><option value="za">Nama Z–A</option>
        </select>
      </div>
      <p className="neo-result-count" role="status">{visibleGames.length} game ditemukan</p>
      <div className="neo-all-games-grid">
        {visibleGames.map((game) => (
          <Link className="neo-catalog-game-card" key={game.id} href={`/game/${encodeURIComponent(game.slug)}`}>
            <div className="neo-catalog-game-art"><GameArt variant={getGameArtwork(game.slug)} /><span className={`neo-status-badge ${game.is_active ? "is-active" : "is-inactive"}`}>{game.is_active ? "Aktif" : "Tidak aktif"}</span></div>
            <div className="neo-catalog-game-copy"><h2>{game.name}</h2><p>{game.publisher || "Publisher belum tersedia"}</p><span>Pilih kategori <ArrowUpRight size={18} aria-hidden="true" /></span></div>
          </Link>
        ))}
      </div>
      {!visibleGames.length && <div className="neo-listing-empty"><Gamepad2 size={36} /><h2>{games.length ? "Game tidak ditemukan" : "Belum ada game"}</h2><p>{games.length ? "Coba nama game atau publisher lain." : "Game akan ditampilkan ketika tersedia di katalog."}</p>{query && <button className="neo-filter-done" onClick={() => setQuery("")}>Reset pencarian</button>}</div>}
    </section>
  );
}
