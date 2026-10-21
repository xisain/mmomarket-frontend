"use client";

import { Suspense, startTransition, use, useEffect, useState } from "react";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import Link from "next/link";
import {
  ArrowLeft,
  ClipboardList,
  Coins,
  LayoutDashboard,
  Package,
  Store,
  Wallet,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { ApiError } from "@/lib/api";
import {
  getSellerListings,
  getSellerProfile,
  type SellerListing,
  type SellerProfile,
} from "@/lib/seller";
import { formatPrice } from "@/lib/utils/format";
import "../dashboard.css";

const tabs = [
  { id: "overview", title: "Ringkasan", icon: LayoutDashboard },
  { id: "listings", title: "Listing toko", icon: Package },
  { id: "orders", title: "Pesanan", icon: ClipboardList },
  { id: "earnings", title: "Pendapatan", icon: Coins },
  { id: "payouts", title: "Pencairan", icon: Wallet },
];
const sellerStatuses = {
  pending: "Menunggu review",
  approved: "Disetujui",
  rejected: "Ditolak",
  suspended: "Ditangguhkan",
};
const listingStatuses = {
  draft: "Draft",
  active: "Aktif",
  sold: "Terjual",
  archived: "Diarsipkan",
};
type State =
  | { status: "error"; message: string; login: boolean }
  | {
      status: "ready";
      seller: SellerProfile;
      listings: SellerListing[];
      listingError: boolean;
    };

export function SellerDashboard({ sellerId }: { sellerId: string }) {
  const [attempt, setAttempt] = useState(0);
  return (
    <SellerLoader
      key={`${sellerId}:${attempt}`}
      sellerId={sellerId}
      retry={() => setAttempt((value) => value + 1)}
    />
  );
}

function SellerLoader({ sellerId, retry }: { sellerId: string; retry: () => void }) {
  const [result, setResult] = useState<Promise<State> | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function load(): Promise<State> {
      try {
        const seller = await getSellerProfile(controller.signal);
        if (seller.id !== sellerId) {
          throw new Error("Dashboard ini bukan milik toko yang sedang login.");
        }
        if (seller.status === "pending") {
          throw new Error("Pengajuan seller masih menunggu review admin.");
        }
        let listings: SellerListing[] = [];
        let listingError = false;
        if (seller.status === "approved") {
          try {
            listings = await getSellerListings(seller.id, controller.signal);
          } catch {
            listingError = true;
          }
        }
        return { status: "ready", seller, listings, listingError };
      } catch (error) {
        const login = error instanceof ApiError && error.status === 401;
        return {
          status: "error",
          login,
          message: login
            ? "Masuk terlebih dahulu untuk membuka dashboard seller."
            : error instanceof ApiError && error.status === 404
              ? "Akun ini belum memiliki toko."
              : error instanceof ApiError
                ? "Dashboard seller gagal dimuat. Silakan coba lagi."
                : error instanceof Error
                  ? error.message
                  : "Dashboard seller gagal dimuat.",
        };
      }
    }
    // Keep SSR synchronous; the session request starts after hydration.
    const request = load();
    startTransition(() => setResult(request));
    return () => controller.abort();
  }, [sellerId]);

  return (
    <Suspense fallback={<DashboardSkeleton variant="seller" />}>
      {result ? (
        <SellerContent result={result} sellerId={sellerId} retry={retry} />
      ) : (
        <DashboardSkeleton variant="seller" />
      )}
    </Suspense>
  );
}

function SellerContent({ result, sellerId, retry }: {
  result: Promise<State>;
  sellerId: string;
  retry: () => void;
}) {
  const state = use(result);
  const [tab, setTab] = useState("overview");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  if (state.status !== "ready")
    return (
      <main className="container section" id="main-content">
        <Brand />
        <h1>Dashboard seller</h1>
        <p role="alert">{state.message}</p>
        {state.login ? (
          <Link
            className="neo-button"
            href={`/login?next=${encodeURIComponent(`/seller/${sellerId}`)}`}
          >
            Masuk
          </Link>
        ) : (
          <button className="neo-button" onClick={retry}>
            Coba lagi
          </button>
        )}
        <p>
          <Link href="/">Kembali ke marketplace</Link>
        </p>
      </main>
    );

  const { seller, listings, listingError } = state;
  const approved = seller.status === "approved";
  const title = tabs.find((item) => item.id === tab)!.title;
  const filtered = listings.filter(
    (item) =>
      (status === "all" || item.status === status) &&
      `${item.id} ${item.name} ${item.slug}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const active = listings.filter((item) => item.status === "active").length;
  const drafts = listings.filter((item) => item.status === "draft").length;
  const initials = seller.shop_name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div className="dash-shell dash-seller">
      <aside className="dash-sidebar">
        <Brand />
        <div className="dash-workspace">
          <span className="dash-workspace-icon">
            <Store size={23} />
          </span>
          <div>
            <strong>{seller.shop_name}</strong>
            <small>{sellerStatuses[seller.status]}</small>
          </div>
        </div>
        <p className="dash-nav-label">WORKSPACE</p>
        <nav className="dash-nav is-open" aria-label="Menu dashboard seller">
          {tabs.map((item) => (
            <button
              key={item.id}
              className={tab === item.id ? "active" : ""}
              aria-current={tab === item.id ? "page" : undefined}
              onClick={() => setTab(item.id)}
            >
              <item.icon size={18} />
              <span>{item.title}</span>
            </button>
          ))}
        </nav>
        <div className="dash-sidebar-bottom">
          <Link href="/" className="dash-market-link">
            <ArrowLeft size={17} />
            Kembali ke marketplace
          </Link>
          <div className="dash-profile">
            <span className="dash-profile-avatar">{initials}</span>
            <div>
              <strong>{seller.shop_name}</strong>
              <small>@{seller.slug}</small>
            </div>
          </div>
        </div>
      </aside>
      <div className="dash-body">
        <header className="dash-topbar">
          <span>
            Market / Seller / <strong>{title}</strong>
          </span>
          {/*<span>{sellerStatuses[seller.status]}</span>*/}
        </header>
        <main className="dash-main" id="main-content">
          <div className="dash-page-heading">
            <div>
              <span className="section-kicker">TOKO SAYA</span>
              <h1>
                {tab === "overview" ? `Halo, ${seller.shop_name}.` : title}
              </h1>
              <p>
                {seller.description ||
                  `Kelola toko @${seller.slug} dari dashboard ini.`}
              </p>
            </div>
            <span className="dash-role-tag">
              <Store size={17} />
              SELLER PANEL
            </span>
          </div>
          {!approved && (
            <p className="preview-alert" role="status">
              Status toko: {sellerStatuses[seller.status]}. Listing hanya
              tersedia untuk toko yang disetujui.
            </p>
          )}
          {listingError && (
            <div className="preview-alert" role="alert">
              Listing toko gagal dimuat.{" "}
              <button className="dash-inline-link" onClick={retry}>
                Coba lagi
              </button>
            </div>
          )}
          {tab === "overview" && (
            <>
              <section className="dash-stats" aria-label="Ringkasan toko">
                {[
                  {
                    label: "Listing aktif",
                    value: approved && !listingError ? String(active) : "—",
                    note: "Listing berstatus aktif",
                    tone: "lavender",
                  },
                  {
                    label: "Listing draft",
                    value: approved && !listingError ? String(drafts) : "—",
                    note: "Listing yang belum diterbitkan",
                    tone: "yellow",
                  },
                  {
                    label: "Saldo tersedia",
                    value: "—",
                    note: "Data saldo belum tersedia",
                    tone: "green",
                  },
                  {
                    label: "Pendapatan tertahan",
                    value: "—",
                    note: "Data pendapatan belum tersedia",
                    tone: "pink",
                  },
                ].map((stat) => (
                  <div className={`dash-stat ${stat.tone}`} key={stat.label}>
                    <span className="dash-stat-label">{stat.label}</span>
                    <strong>{stat.value}</strong>
                    <span className="dash-stat-note">{stat.note}</span>
                  </div>
                ))}
              </section>
              <div className="dash-overview-grid">
                <section className="dash-panel dash-tasks">
                  <div className="dash-panel-title">
                    <div>                      
                    <span className="section-kicker">YOUR NEXT MOVES</span>
                    <h2>Prioritas tokomu</h2>
                    </div>
                  </div>
                </section>
                <section className="dash-panel dash-note-panel">
                  <span className="section-kicker"></span>
                </section>
              </div>
              {/*<section className="dash-panel">
                <div className="dash-panel-title">
                  <h2>Profil toko</h2>
                </div>
                <dl className="listing-details">
                  <div>
                    <dt>Nama toko</dt>
                    <dd>{seller.shop_name}</dd>
                  </div>
                  <div>
                    <dt>Slug</dt>
                    <dd>{seller.slug}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>{sellerStatuses[seller.status]}</dd>
                  </div>
                  <div>
                    <dt>Terdaftar</dt>
                    <dd>
                      {new Date(seller.created_at).toLocaleDateString("id-ID")}
                    </dd>
                  </div>
                </dl>
              </section>*/}
            </>
          )}
          {(tab === "overview" || tab === "listings") &&
            approved &&
            !listingError && (
              <section
                className="dash-panel dash-data-panel"
                aria-labelledby="seller-listings-title"
              >
                <div className="dash-panel-title">
                  <h2 id="seller-listings-title">Listing toko</h2>
                  <span className="dash-small-label">
                    {listings.length} listing
                  </span>
                </div>
                <div className="dash-table-toolbar">
                  <label className="dash-search">
                    <span className="sr-only">Cari listing</span>
                    <input
                      type="search"
                      placeholder="Cari ID atau nama listing…"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                    />
                  </label>
                  <label className="dash-status-filter">
                    <span className="sr-only">Filter status</span>
                    <select
                      value={status}
                      onChange={(event) => setStatus(event.target.value)}
                    >
                      <option value="all">Semua status</option>
                      {Object.entries(listingStatuses).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div
                  className="dash-table-scroll"
                  role="region"
                  aria-label="Listing toko"
                  tabIndex={0}
                >
                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th scope="col">Listing</th>
                        <th scope="col">Stok</th>
                        <th scope="col">Status</th>
                        <th scope="col" className="dash-numeric">
                          Harga per paket
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((item) => (
                        <tr key={item.id}>
                          <th scope="row">
                            <span className="dash-row-id">{item.id}</span>
                            <strong>{item.name}</strong>
                            <small>{item.description}</small>
                          </th>
                          <td>
                            {item.stock_type === "unlimited"
                              ? "Tanpa batas"
                              : (item.stock_quantity ?? 0)}
                          </td>
                          <td>
                            <span
                              className={`dash-status ${item.status === "active" ? "success" : "neutral"}`}
                            >
                              {listingStatuses[item.status]}
                            </span>
                          </td>
                          <td className="dash-numeric">
                            {formatPrice(String(item.price))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filtered.length === 0 && (
                  <div className="dash-empty">
                    <Package size={27} />
                    <h3>
                      {listings.length === 0
                        ? "Belum ada listing"
                        : "Listing tidak ditemukan"}
                    </h3>
                    <p>
                      {listings.length === 0
                        ? "Toko ini belum memiliki listing."
                        : "Coba kata pencarian atau status lain."}
                    </p>
                  </div>
                )}
                <div className="dash-table-footer" aria-live="polite">
                  <span>
                    Menampilkan {filtered.length} dari {listings.length} listing
                  </span>
                  <span>Seluruh nominal dalam IDR</span>
                </div>
              </section>
            )}
          {["orders", "earnings", "payouts"].includes(tab) && (
            <section className="dash-panel dash-empty">
              <h2>Data {title.toLowerCase()} belum tersedia</h2>
              <p>Data ini belum tersedia dari layanan toko.</p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
