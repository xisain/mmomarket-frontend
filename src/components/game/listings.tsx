"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Search,
  X,
  Filter,
  PackageSearch,
} from "lucide-react";

import { GameOfferCard } from "./offer-card";
import { GameMarketFilters } from "./market-filters";
import { GameArt } from "./art";
import { getGameArtwork } from "@/lib/game-presentation";
import type { GameDetail } from "@/lib/types/game";
import type {
  GameOffer,
  MarketCategory,
} from "@/lib/types/game-market";
import { formatPrice } from "@/lib/utils/format";

type Props = {
  game: GameDetail;
  category: MarketCategory;
  categories: MarketCategory[];
  listings: GameOffer[];
};

export function GameListings({
  game,
  category,
  categories,
  listings,
}: Props) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("default");
  const [region, setRegion] = useState("");
  const [server, setServer] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selected, setSelected] = useState<GameOffer | null>(null);

  const dialog = useRef<HTMLDialogElement>(null);
  const filterDialog = useRef<HTMLDialogElement>(null);
  const filterId = useId();

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 901px)");
    const closeOnDesktop = () => {
      if (desktop.matches) filterDialog.current?.close();
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  const baseListings = useMemo(
    () =>
      listings.filter(
        (item) =>
          item.status === "active" &&
          item.game_id === game.id &&
          item.category_id === category.id,
      ),
    [listings, game.id, category.id],
  );

  const regions = useMemo(
    () =>
      [...new Set(baseListings.map((item) => item.region.name))]
        .filter(Boolean)
        .sort(),
    [baseListings],
  );

  const servers = useMemo(
    () =>
      [
        ...new Set(
          baseListings
            .filter((item) => !region || item.region.name === region)
            .map((item) => item.server.name),
        ),
      ]
        .filter(Boolean)
        .sort(),
    [baseListings, region],
  );

  const visibleListings = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return baseListings
      .filter((item) => {
        const searchText = [
          item.name,
          item.seller.name,
          item.region.name,
          item.server.name,
        ]
          .join(" ")
          .toLowerCase();

        const price = Number(item.price);

        if (keyword && !searchText.includes(keyword)) return false;
        if (region && item.region.name !== region) return false;
        if (server && item.server.name !== server) return false;
        if (minPrice !== "" && price < Number(minPrice)) return false;
        if (maxPrice !== "" && price > Number(maxPrice)) return false;

        return true;
      })
      .sort((a, b) => {
        if (sort === "lowest") return Number(a.price) - Number(b.price);
        if (sort === "highest") return Number(b.price) - Number(a.price);
        return 0;
      });
  }, [baseListings, query, sort, region, server, minPrice, maxPrice]);

  function resetFilters() {
    setQuery("");
    setSort("default");
    setRegion("");
    setServer("");
    setMinPrice("");
    setMaxPrice("");
  }

  function showListing(listing: GameOffer) {
    setSelected(listing);
    dialog.current?.showModal();
  }

  function changeRegion(value: string) {
    setRegion(value);
    if (server && !baseListings.some((item) =>
      (!value || item.region.name === value) && item.server.name === server,
    )) setServer("");
  }

  const filterProps = {
    regions, servers, region, server, minPrice, maxPrice,
    onRegionChange: changeRegion,
    onServerChange: setServer,
    onMinPriceChange: setMinPrice,
    onMaxPriceChange: setMaxPrice,
    onReset: resetFilters,
  };

  return (
    <section className="neo-offers" aria-labelledby="neo-market-title">
      <div className="container neo-catalog-section">
        <Link
          className="neo-back-link"
          href={`/game/${encodeURIComponent(game.slug)}`}
        >
          <ArrowLeft size={16} />
          Semua kategori
        </Link>

        <div className="neo-section-heading">
          <div>
            <span className="neo-section-kicker">
              02 / GAME MARKETPLACE
            </span>
            <h2 id="neo-market-title">{game.name} / {category.name}</h2>
            <p>{category.description}</p>
          </div>
          <span className="neo-count-badge">
            {baseListings.length} LISTING
          </span>
        </div>

        <nav className="neo-category-tabs" aria-label="Kategori game">
          {categories.map((item) => (
            <Link
              key={item.id}
              className={item.id === category.id ? "active" : ""}
              aria-current={item.id === category.id ? "page" : undefined}
              href={`/game/${encodeURIComponent(game.slug)}/${encodeURIComponent(item.slug)}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="neo-market-layout">
          <aside className="neo-filter-sidebar" aria-label="Filter listing">
            <GameMarketFilters {...filterProps} />
          </aside>

          <div className="neo-market-content">
            <div className="neo-market-toolbar">
              <div className="neo-search" role="search">
                <Search size={19} />
                <input
                  type="search"
                  aria-label="Cari listing"
                  placeholder="Cari listing atau seller..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                {query && (
                  <button
                    type="button"
                    aria-label="Hapus pencarian"
                    onClick={() => setQuery("")}
                  >
                    <X size={17} />
                  </button>
                )}
              </div>

              <select
                className="neo-sort"
                aria-label="Urutkan listing"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
              >
                <option value="default">Urutan Default</option>
                <option value="lowest">Harga Terendah</option>
                <option value="highest">Harga Tertinggi</option>
              </select>

              <button
                type="button"
                className="neo-mobile-filter-button"
                aria-expanded={filterOpen}
                aria-controls={filterId}
                aria-haspopup="dialog"
                onClick={() => {
                  filterDialog.current?.showModal();
                  setFilterOpen(true);
                }}
              >
                <Filter size={18} />
                Filter
              </button>
            </div>


            <p className="neo-result-count" role="status">
              Menampilkan <strong>{visibleListings.length}</strong> listing
            </p>

            <div className="neo-listing-grid">
              {visibleListings.map((listing) => (
                <GameOfferCard key={listing.id} game={game} category={category} listing={listing} onPreview={showListing} />
              ))}

              {visibleListings.length === 0 && (
                <div className="neo-listing-empty">
                  <PackageSearch size={38} />
                  <h3>
                    {baseListings.length
                      ? "Listing tidak ditemukan"
                      : "Belum ada listing"}
                  </h3>
                  <p>
                    {baseListings.length
                      ? "Coba ubah pencarian atau filter."
                      : "Belum ada penawaran pada kategori ini."}
                  </p>
                  {baseListings.length > 0 && (
                    <button
                      type="button"
                      className="neo-filter-done"
                      onClick={resetFilters}
                    >
                      Reset Filter
                    </button>
                  )}
                </div>
              )}
            </div>

            <p className="neo-disclaimer">
              Listing ini merupakan data dummy untuk pratinjau.
              Pembelian belum tersedia.
            </p>
          </div>
        </div>
      </div>

      <dialog
        ref={filterDialog}
        id={filterId}
        className="neo-filter-drawer"
        aria-labelledby={`${filterId}-title`}
        onClose={() => setFilterOpen(false)}
        onClick={(event) => {
          if (event.target === filterDialog.current) filterDialog.current.close();
        }}
      >
        <div className="neo-drawer-heading">
          <h2 id={`${filterId}-title`}>Sesuaikan pencarian</h2>
          <button type="button" className="neo-close-button" aria-label="Tutup filter" onClick={() => filterDialog.current?.close()}><X size={20} /></button>
        </div>
        <GameMarketFilters {...filterProps} />
        <button type="button" className="neo-filter-done" onClick={() => filterDialog.current?.close()}>
          Tampilkan {visibleListings.length} listing
        </button>
      </dialog>

      <dialog
        ref={dialog}
        className="listing-dialog neo-listing-dialog"
        aria-labelledby="game-offer-title"
        onClose={() => setSelected(null)}
        onClick={(event) => {
          if (event.target === dialog.current) {
            dialog.current.close();
          }
        }}
      >
        {selected && (
          <>
            <div className="dialog-heading">
              <span className="section-kicker">PRATINJAU LISTING</span>
              <button
                type="button"
                className="icon-button"
                aria-label="Tutup detail"
                onClick={() => dialog.current?.close()}
              >
                <X size={20} />
              </button>
            </div>

            <div className="dialog-art">
              <GameArt variant={getGameArtwork(game.slug)} />
            </div>

            <span className="listing-game">
              {game.name} · {category.name}
            </span>

            <h2 id="game-offer-title">{selected.name}</h2>
            <p>{selected.description}</p>

            <dl className="listing-details">
              <div>
                <dt>Seller</dt>
                <dd>{selected.seller.name}</dd>
              </div>
              <div>
                <dt>Region</dt>
                <dd>{selected.region.name || "-"}</dd>
              </div>
              <div>
                <dt>Server</dt>
                <dd>{selected.server.name || "-"}</dd>
              </div>
              <div>
                <dt>Stok contoh</dt>
                <dd>
                  {selected.stock_type === "finite"
                    ? `${selected.stock_quantity ?? 0} paket`
                    : "Sesuai kapasitas seller"}
                </dd>
              </div>
              <div>
                <dt>Harga per {selected.quantity_per_unit === 1 ? "layanan" : `${selected.quantity_per_unit.toLocaleString("id-ID")} unit`}</dt>
                <dd>{formatPrice(selected.price)}</dd>
              </div>
            </dl>

            <div className="preview-alert">
              Data dummy untuk pratinjau.
              Pembelian belum tersedia.
            </div>

            <Link
              className="neo-button full-width"
              href={`/game/${encodeURIComponent(game.slug)}/${encodeURIComponent(category.slug)}/${encodeURIComponent(selected.slug)}`}
            >
              Buka detail listing
            </Link>
            <button
              type="button"
              className="neo-button full-width secondary"
              onClick={() => dialog.current?.close()}
            >
              Kembali ke listing
            </button>
          </>
        )}
      </dialog>
    </section>
  );
}
