"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Coins,
  Compass,
  Gamepad2,
  PackageCheck,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  Swords,
  X,
} from "lucide-react";
import { GameArt, LootArt } from "@/components/game-art";
import {
  getListingGame,
  getListingCategory,
  listings,
  regions,
  sellers,
  servers,
} from "@/lib/demo-data";

import type { Game } from "@/lib/types/game";
import type { Listing } from "@/lib/types/listing";
import { formatPrice } from "@/lib/utils/format";
import { getGameArtwork } from "@/lib/game-presentation";

const faqs = [
  [
    "Apa saja yang bisa ditemukan di MMO Market?",
    "Kamu dapat menjelajahi penawaran in-game currency dan layanan boosting dari berbagai seller. Pilih game, lalu cocokkan region dan server sebelum memilih penawaran.",
  ],
  [
    "Bagaimana cara menjadi seller?",
    "Buat akun dan masuk, lalu pilih Mulai jadi seller untuk mengisi nama, slug, dan deskripsi toko. Pengajuan akan ditinjau oleh admin sebelum toko dapat berjualan.",
  ],
  [
    "Apakah region dan server harus sama?",
    "Ya. Pastikan game, region, dan server pada listing sesuai dengan karakter kamu. Ketersediaan produk dan metode pemenuhan dapat berbeda untuk setiap server.",
  ],
  [
    "Bagaimana jika ada masalah dengan pesanan?",
    "Alur pesanan dirancang untuk mendukung bukti penyerahan dan pengajuan dispute yang ditinjau admin. Ketentuan serta batas waktunya akan ditampilkan sebelum transaksi saat fitur pembayaran tersedia.",
  ],
];

export function Marketplace({ games, gamesError = false, gamesLoading = false, detailMode = false }: {
  games: Game[];
  gamesError?: boolean;
  gamesLoading?: boolean;
  detailMode?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [gameFilter, setGameFilter] = useState(detailMode ? games[0]?.id ?? "all" : "all");
  const [selected, setSelected] = useState<Listing | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const visibleGames = games.filter((game) =>
    `${game.name} ${game.publisher}`
      .toLowerCase()
      .includes(query.toLowerCase().trim()),
  );
  const availableListings = detailMode
    ? listings.filter((listing) => {
        const game = getListingGame(listing, games);
        return games.some((item) => item.id === game?.id);
      })
    : listings;
  const visibleListings = availableListings.filter((listing) => {
    const game = getListingGame(listing, games);
    return (
      (category === "all" || getListingCategory(listing) === category) &&
      (gameFilter === "all" || game?.id === gameFilter) &&
      `${listing.name} ${game?.name}`
        .toLowerCase()
        .includes(query.toLowerCase().trim())
    );
  });
  function showListing(listing: Listing) {
    setSelected(listing);
    dialog.current?.showModal();
  }
  const selectedGame = selected ? getListingGame(selected, games) : undefined;
  const listingGames = [...new Map([
    ...games.map((game) => [game.id, game] as const),
    ...availableListings.flatMap((listing) => {
      const game = getListingGame(listing, games);
      return game ? [[game.id, game] as const] : [];
    }),
  ]).values()];

  return (
    <>
      <main id="main-content">
        {!detailMode && <>
        <section className="hero grid-paper">
          <div className="container hero-inner">
            <div className="hero-copy">
              <span className="eyebrow">
                <span /> FOR THE LOVE OF THE GAME
              </span>
              <h1>
                Less grinding.
                <br />
                More{" "}
                <span className="highlight">
                  adventuring.
                  <svg viewBox="0 0 400 18" aria-hidden="true">
                    <path
                      d="M3 12Q180 0 395 8M21 17Q210 7 370 15"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                  </svg>
                </span>
              </h1>
              <p>
                Currency dan layanan game untuk langkah berikutnya.
                <br className="desktop-break" /> Temukan penawaranmu, lanjutkan
                petualanganmu.
              </p>
              <div className="hero-actions">
                <a className="neo-button" href="#games">
                  Jelajahi game <ArrowUpRight size={19} />
                </a>
                <a className="text-link" href="#how-it-works">
                  Cara kerjanya <ArrowRight size={17} />
                </a>
              </div>
              <div className="hero-notes">
                <span>
                  <Coins size={16} /> In-game currency
                </span>
                <span>
                  <Swords size={16} /> Boosting services
                </span>
              </div>
            </div>
            <div
              className="hero-visual"
              aria-label="Ilustrasi perlengkapan petualangan"
            >
              <span className="floating-label top-label">
                <Sparkles size={16} /> READY FOR YOUR NEXT QUEST?
              </span>
              <div className="inventory-window">
                <div className="window-bar">
                  <span>
                    <span className="window-dot" /> ADVENTURER&apos;S INVENTORY
                  </span>
                  <div>
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
                <div className="inventory-content">
                  <span className="item-type">EPIC LOOT / LVL. 01</span>
                  <LootArt />
                  <div className="item-caption">
                    <div>
                      <span>NEXT QUEST</span>
                      <strong>A new adventure.</strong>
                    </div>
                    <span className="item-plus">+1</span>
                  </div>
                </div>
              </div>
              <div className="currency-sticker">
                <span className="coin-icon">
                  <Coins size={29} />
                </span>
                <div>
                  <small>LESS GRIND, MORE PLAY</small>
                  <strong>Gear up. Go further.</strong>
                </div>
                <ArrowUpRight size={21} />
              </div>
              <span className="sparkle-outside" aria-hidden="true">
                ✳
              </span>
            </div>
          </div>
          <div className="hero-bottom container">
            <span>FIND YOUR WORLD. MAKE YOUR MOVE.</span>
            <a href="#games" aria-label="Lanjut ke daftar game">
              <ArrowDown size={18} />
            </a>
            <span className="hero-edition">
              THE PLAYER&apos;S MARKETPLACE — EST. 2026
            </span>
          </div>
        </section>

        <div className="feature-strip">
          <div className="container">
            <span>
              <Gamepad2 /> Banyak game, satu tempat
            </span>
            <span>
              <Compass /> Pilih region & servermu
            </span>
            <span>
              <Store /> Dari seller untuk player
            </span>
            <span>
              <PackageCheck /> Ikuti setiap progres
            </span>
          </div>
        </div>

        <section id="games" className="section container">
          <div className="section-heading">
            <div>
              <span className="section-kicker">01 / PICK YOUR UNIVERSE</span>
              <h2>
                Game kamu, <span className="serif-word">dunia kamu.</span>
              </h2>
              <p>Temukan bekal untuk petualangan di dunia favoritmu.</p>
            </div>
            <span className="sample-note">
              <span /> Katalog game
            </span>
          </div>
          <form
            className="catalog-search"
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              document
                .getElementById("games-results")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            <Search size={21} />
            <label className="sr-only" htmlFor="game-search">
              Cari game atau layanan
            </label>
            <input
              id="game-search"
              type="search"
              placeholder="Cari game, currency, atau layanan…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <button
                type="button"
                className="icon-button"
                onClick={() => setQuery("")}
                aria-label="Hapus pencarian"
              >
                <X size={18} />
              </button>
            )}
            <button className="search-submit" type="submit">
              Cari <ArrowRight size={17} />
            </button>
          </form>
          <div id="games-results" className="game-grid" aria-live="polite">
            {visibleGames.map((game) => (
              <Link
                className="game-card"
                key={game.id}
                href={`/games/${encodeURIComponent(game.slug)}`}
              >
                <div className="game-image">
                  <GameArt variant={getGameArtwork(game.slug)} />
                  <span className="game-badge">MMORPG</span>
                  <span className="game-open">
                    <ArrowUpRight size={20} />
                  </span>
                </div>
                <div className="game-copy">
                  <h3>{game.name}</h3>
                  <p>{game.publisher}</p>
                  <div>
                    <span>Lihat penawaran</span>
                    <ArrowRight size={17} />
                  </div>
                </div>
              </Link>
            ))}
            {visibleGames.length === 0 && (
              <div className="empty-state">
                <Search size={30} />
                <h3>{gamesLoading ? "Memuat game…" : gamesError ? "Game gagal dimuat" : games.length === 0 ? "Belum ada game" : "Tidak ada game yang cocok"}</h3>
                <p>{gamesError ? "Silakan muat ulang halaman untuk mencoba lagi." : gamesLoading ? "Menyiapkan katalog game." : "Coba nama game lain atau cari layanan di bawah."}</p>
                <button
                  className="neo-button secondary"
                  onClick={() => setQuery("")}
                >
                  Reset pencarian
                </button>
              </div>
            )}
          </div>
        </section>

        </>}

        <section id="offers" className="offers-section">
          <div className="container section">
            <div className="section-heading">
              <div>
                <span className="section-kicker">02 / GET QUEST-READY</span>
                <h2>
                  Bekal buat <span className="serif-word">next level.</span>
                </h2>
                <p>Currency atau bantuan leveling? Pilih sesuai kebutuhanmu.</p>
              </div>
              <span className="sample-note">Penawaran ilustrasi · IDR</span>
            </div>
            <div className="filter-row">
              <div
                className="filter-tabs"
                role="group"
                aria-label="Filter kategori"
              >
                {[
                  { id: "all", name: "Semua", icon: <Sparkles size={16} /> },
                  {
                    id: "currency",
                    name: "Currency",
                    icon: <Coins size={16} />,
                  },
                  {
                    id: "boosting",
                    name: "Boosting",
                    icon: <Swords size={16} />,
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={category === tab.id ? "active" : ""}
                    aria-pressed={category === tab.id}
                    onClick={() => setCategory(tab.id)}
                  >
                    {tab.icon}
                    {tab.name}
                  </button>
                ))}
              </div>
              <label className="game-select">
                <span className="sr-only">Filter berdasarkan game</span>
                <select
                  value={gameFilter}
                  onChange={(event) => setGameFilter(event.target.value)}
                >
                  <option value="all">Semua game</option>
                  {listingGames.map((game) => (
                    <option key={game.id} value={game.id}>
                      {game.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} />
              </label>
            </div>
            <div className="listing-grid" aria-live="polite">
              {visibleListings.map((listing) => {
                const game = getListingGame(listing, games);
                const seller = sellers.find(
                  (seller) => seller.id === listing.seller_id,
                )!;
                return (
                  <article className="listing-card" key={listing.id}>
                    <button
                      className="listing-art-button"
                      onClick={() => showListing(listing)}
                      aria-label={`Lihat ${listing.name}`}
                    >
                      <GameArt variant={getGameArtwork(game?.slug)} />
                      <span
                        className={`listing-category ${getListingCategory(listing)}`}
                      >
                        {getListingCategory(listing) === "currency" ? (
                          <Coins size={13} />
                        ) : (
                          <Swords size={13} />
                        )}
                        {getListingCategory(listing) === "currency"
                          ? "CURRENCY"
                          : "BOOSTING"}
                      </span>
                    </button>
                    <div className="listing-body">
                      <span className="listing-game">{game?.name ?? "Game tidak tersedia"}</span>
                      <h3>
                        <button onClick={() => showListing(listing)}>
                          {listing.name}
                        </button>
                      </h3>
                      <span className="listing-server">
                        {
                          regions.find(
                            (region) => region.id === listing.game_region_id,
                          )?.name
                        }{" "}
                        ·{" "}
                        {
                          servers.find(
                            (server) => server.id === listing.server_id,
                          )?.name
                        }
                      </span>
                      <div className="listing-seller">
                        <span className="avatar">
                          {seller.shop_name.slice(0, 1)}
                        </span>
                        {seller.shop_name}
                      </div>
                      <div className="listing-price">
                        <div>
                          <small>
                            {getListingCategory(listing) === "currency"
                              ? `Per ${listing.quantity_per_unit.toLocaleString("id-ID")} unit`
                              : "Per layanan"}
                          </small>
                          <strong>{formatPrice(listing.price)}</strong>
                        </div>
                        <button
                          className="listing-arrow"
                          onClick={() => showListing(listing)}
                          aria-label={`Detail ${listing.name}`}
                        >
                          <ArrowUpRight size={20} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
              {visibleListings.length === 0 && (
                <div className="empty-state">
                  <Compass size={32} />
                  <h3>Penawaran belum ditemukan</h3>
                  <p>Coba ubah game, kategori, atau kata pencarianmu.</p>
                  <button
                    className="neo-button secondary"
                    onClick={() => {
                      setQuery("");
                      setCategory("all");
                      setGameFilter("all");
                    }}
                  >
                    Reset semua filter
                  </button>
                </div>
              )}
            </div>
            <p className="catalog-disclaimer">
              Data dan harga pada pratinjau ini adalah contoh, bukan penawaran
              transaksi aktif.
            </p>
          </div>
        </section>

        {!detailMode && <>
        <section id="how-it-works" className="section container how-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">
                03 / SIMPLE AS A SIDE QUEST
              </span>
              <h2>
                Dari pilih sampai <span className="serif-word">siap main.</span>
              </h2>
              <p>Lebih sedikit langkah. Lebih banyak waktu untuk bermain.</p>
            </div>
            <span className="handwritten">
              Let&apos;s play! <ArrowDown size={24} />
            </span>
          </div>
          <div className="steps-grid">
            {[
              {
                icon: <Compass />,
                title: "Temukan penawaran",
                text: "Pilih game, region, dan server. Cocokkan currency atau layanan dengan kebutuhanmu.",
              },
              {
                icon: <Coins />,
                title: "Selesaikan pembayaran",
                text: "Periksa detail penawaran dan rincian biaya sebelum melanjutkan pembayaran.",
              },
              {
                icon: <PackageCheck />,
                title: "Pantau & konfirmasi",
                text: "Ikuti progres dari seller, periksa hasilnya, lalu konfirmasi penerimaan pesanan.",
              },
            ].map((step, index) => (
              <article key={step.title} className="step-card">
                <div className="step-top">
                  <span className={`step-icon step-${index}`}>{step.icon}</span>
                  <span className="step-number">0{index + 1}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="container seller-section">
          <div className="seller-banner">
            <div className="seller-illustration" aria-hidden="true">
              <Store size={78} strokeWidth={1.6} />
              <span className="seller-star">✳</span>
              <span className="seller-mini">OPEN FOR BUSINESS</span>
            </div>
            <div className="seller-copy">
              <span className="section-kicker">
                TURN YOUR GAME INTO OPPORTUNITY
              </span>
              <h2>
                Punya bekal lebih?
                <br />
                Buka tokomu sendiri.
              </h2>
              <p>
                Jangkau player lain. Kelola listing dan pesananmu
                <br className="desktop-break" /> dalam satu tempat.
              </p>
            </div>
            <Link className="neo-button" href="/seller/applications">
              Mulai jadi seller <ArrowUpRight size={19} />
            </Link>
          </div>
        </section>

        <section id="faq" className="section container faq-section">
          <div>
            <span className="section-kicker">
              A LITTLE HELP FOR YOUR JOURNEY
            </span>
            <h2>
              Masih ada
              <br />
              <span className="serif-word">pertanyaan?</span>
            </h2>
            <p>
              Kenali marketplace sebelum
              <br />
              memulai petualanganmu.
            </p>
            <ShieldCheck size={42} strokeWidth={1.5} className="faq-icon" />
          </div>
          <div className="faq-list">
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <span className="faq-plus">+</span>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
        </>}
      </main>

      <dialog
        ref={dialog}
        className="listing-dialog"
        aria-labelledby="listing-dialog-title"
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current.close();
        }}
        onClose={() => setSelected(null)}
      >
        {selected && (
          <>
            <div className="dialog-heading">
              <span className="section-kicker">PRATINJAU PENAWARAN</span>
              <button
                className="icon-button"
                onClick={() => dialog.current?.close()}
                aria-label="Tutup detail"
              >
                <X size={21} />
              </button>
            </div>
            <div className="dialog-art">
              <GameArt
                variant={getGameArtwork(selectedGame?.slug)}
              />
            </div>
            <span className="listing-game">{selectedGame?.name}</span>
            <h2 id="listing-dialog-title">{selected.name}</h2>
            <p>{selected.description}</p>
            <dl className="listing-details">
              <div>
                <dt>Region / Server</dt>
                <dd>
                  {
                    regions.find(
                      (region) => region.id === selected.game_region_id,
                    )?.name
                  }{" "}
                  /{" "}
                  {
                    servers.find((server) => server.id === selected.server_id)
                      ?.name
                  }
                </dd>
              </div>
              <div>
                <dt>Seller</dt>
                <dd>
                  {
                    sellers.find((seller) => seller.id === selected.seller_id)
                      ?.shop_name
                  }
                </dd>
              </div>
              <div>
                <dt>Ketersediaan contoh</dt>
                <dd>
                  {selected.stock_type === "finite"
                    ? `${selected.stock_quantity} paket`
                    : "Sesuai kapasitas seller"}
                </dd>
              </div>
              <div>
                <dt>
                  Harga{" "}
                  {getListingCategory(selected) === "currency"
                    ? `per ${selected.quantity_per_unit.toLocaleString("id-ID")} unit`
                    : "per layanan"}
                </dt>
                <dd>{formatPrice(selected.price)}</dd>
              </div>
            </dl>
            <div className="preview-alert">
              <Check size={18} />
              <span>
                Ini pratinjau UI. Pembelian dan pembayaran belum tersedia.
              </span>
            </div>
            <button
              className="neo-button full-width secondary"
              onClick={() => dialog.current?.close()}
            >
              Kembali menjelajah <ArrowRight size={17} />
            </button>
          </>
        )}
      </dialog>
    </>
  );
}
