"use client";

import { Suspense, startTransition, use, useEffect, useId, useRef, useState } from "react";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  Coins,
  LayoutDashboard,
  Package,
  Pencil,
  Plus,
  Store,
  Trash2,
  Wallet,
  X,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { ApiError } from "@/lib/api";
import {
  getSellerListings,
  getSellerProfile,
  getSellerTransactions,
  type SellerListing,
  type SellerProfile,
} from "@/lib/seller";
import { formatPrice } from "@/lib/utils/format";
import "../dashboard.css";
import { SellerTransaction } from "@/lib/types/seller";
import { transactionStatuses } from "@/lib/constants/transaction";
import next from "next";
import { URL } from "node:url";

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
const listingActionLabels = {
  add: "Tambah listing",
  edit: "Edit listing",
  delete: "Hapus listing",
};
type ListingAction = {
  action: keyof typeof listingActionLabels;
  listing?: SellerListing;
};
type State =
  | { status: "error"; message: string; login: boolean }
  | {
      status: "ready";
      seller: SellerProfile;
      listings: SellerListing[];
      listingError: boolean;

      transactions: SellerTransaction[];
      transactionError: boolean;
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

function SellerLoader({
  sellerId,
  retry,
}: {
  sellerId: string;
  retry: () => void;
}) {
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
        let transactions: SellerTransaction[] = [];
        let transactionError = false;
        if (seller.status === "approved") {
          try {
            listings = await getSellerListings(controller.signal);
          } catch {
            listingError = true;
          }
          try {
            transactions = await getSellerTransactions(controller.signal);
          } catch {
            transactionError = true;
          }
        }
        return { status: "ready", seller, listings, listingError, transactions, transactionError };
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

function SellerContent({
  result,
  sellerId,
  retry,
}: {
  result: Promise<State>;
  sellerId: string;
  retry: () => void;
}) {

  const state = use(result);
  const [tab, setTab] = useState("overview");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [listingAction, setListingAction] = useState<ListingAction | null>(null);
  const listingDialog = useRef<HTMLDialogElement>(null);
  const listingDialogId = useId();

  function openListingPlaceholder(action: ListingAction) {
    setListingAction(action);
    listingDialog.current?.showModal();
  }

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

  const { seller, listings, listingError, transactions, transactionError } = state;
  const approved = seller.status === "approved";
  const title = tabs.find((item) => item.id === tab)!.title;
  const filtered = listings.filter(
    (item) =>
      (status === "all" || item.status === status) &&
      `${item.id} ${item.name} ${item.slug}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const pendingOrders = transactions.filter(
    (item) => item.status === "paid" || item.status === "processing",
  ).length;
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
          {tab === "listings" && listingError && (
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
                    label: "Total pesanan",
                    value: approved && !transactionError ? String(transactions.length) : "—",
                    note: "Seluruh pesanan yang masuk ke toko",
                    tone: "lavender",
                  },
                  {
                    label: "Pesanan perlu diproses",
                    value: approved && !transactionError ? String(pendingOrders) : "—",
                    note: "Sudah dibayar atau sedang diproses",
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
                      <span className="section-kicker">LANGKAH SELANJUTNYA</span>
                      <h2>Prioritas tokomu</h2>
                    </div>
                  </div>
                  {[
                    {
                      title: "Proses pesanan masuk",
                      text: "Cek pesanan yang sudah dibayar dan selesaikan pengiriman sesuai kesepakatan.",
                      tab: "orders",
                      icon: ClipboardList,
                    },
                    {
                      title: "Tindak lanjuti komplain",
                      text: "Periksa pesanan dalam komplain dan bantu pembeli menemukan solusi.",
                      tab: "orders",
                      icon: Store,
                    },
                    {
                      title: "Pastikan stok selalu siap",
                      text: "Perbarui stok, harga, dan deskripsi produk agar pembeli mendapat informasi yang akurat.",
                      tab: "listings",
                      icon: Package,
                    },
                  ].map((task) => (
                    <button
                      className="dash-task"
                      key={task.title}
                      onClick={() => setTab(task.tab)}
                    >
                      <span className="dash-task-icon">
                        <task.icon size={19} />
                      </span>
                      <span>
                        <strong>{task.title}</strong>
                        <small>{task.text}</small>
                      </span>
                      <ArrowRight size={18} />
                    </button>
                  ))}
                </section>
                <section className="dash-panel dash-note-panel">
                  <span className="section-kicker">CATATAN TOKO</span>
                  <div className="dash-note-symbol">
                    <Store size={43} />
                  </div>
                  <h2>Pelayanan baik, pembeli kembali.</h2>
                  <p>
                    Proses pesanan tepat waktu, sampaikan progres dengan jelas,
                    dan jaga informasi produk tetap akurat untuk membangun
                    kepercayaan pembeli.
                  </p>
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
          {tab === "listings" &&
            approved &&
            !listingError && (
              <section
                className="dash-panel dash-data-panel"
                aria-labelledby="seller-listings-title"
              >
                <div className="dash-panel-title">
                  <h2 id="seller-listings-title">Listing toko</h2>
                  <div className="seller-listing-header-actions">
                    <span className="dash-small-label">{listings.length} listing</span>
                  <Link href={`/seller/${sellerId}/create`}
                    className="neo-button small">
                      <Plus size={17} aria-hidden="true" /> Tambah listing
                    </Link>
                  </div>
                </div>
                <p className="seller-listing-placeholder-note">Tambah, edit, dan hapus listing masih berupa placeholder untuk pengembangan berikutnya.</p>
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
                        <th scope="col">Aksi</th>
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
                          <td>
                            <div className="seller-listing-row-actions">
                              <button type="button" className="seller-listing-action" aria-label={`Edit ${item.name}`} aria-haspopup="dialog" onClick={() => openListingPlaceholder({ action: "edit", listing: item })}>
                                <Pencil size={15} aria-hidden="true" /> Edit
                              </button>
                              <button type="button" className="seller-listing-action seller-listing-delete" aria-label={`Hapus ${item.name}`} aria-haspopup="dialog" onClick={() => openListingPlaceholder({ action: "delete", listing: item })}>
                                <Trash2 size={15} aria-hidden="true" /> Hapus
                              </button>
                            </div>
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
          {(tab === "overview" || tab === "orders") && approved && (
            <section className="dash-panel dash-data-panel">
                <div className="dash-panel-title">
                  <h2>Pesanan masuk</h2>
            
                  <span className="dash-small-label">
                    {transactionError ? "—" : transactions.length} pesanan
                  </span>
                </div>
            
                {transactionError ? (
                  <div className="dash-empty">
                    <h3>Gagal memuat pesanan</h3>
                    <button className="neo-button" onClick={retry}>
                      Coba lagi
                    </button>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="dash-empty">
                    <ClipboardList size={27} />
                    <h3>Belum ada pesanan</h3>
                    <p>Pesanan pembeli akan muncul di sini.</p>
                  </div>
                ) : (
                  <div className="dash-table-scroll">
                    <table className="dash-table">
                      <thead>
                        <tr>
                          <th>Pesanan</th>
                          <th>Pembeli</th>
                          <th>Produk</th>
                          <th>Jumlah</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Tanggal</th>
                        </tr>
                      </thead>
            
                      <tbody>
                        {transactions.map((order) => (
                          <tr key={order.id}>
                            <td>
                              <span className="dash-row-id">
                                {order.id.slice(0, 8)}
                              </span>
                            </td>
            
                            <td>{order.buyer}</td>
            
                            <td>
                              <strong>{order.product}</strong>
                              <small>{order.game}</small>
                              <small>{order.server}</small>
                            </td>
            
                            <td>{order.quantity}</td>
            
                            <td className="dash-numeric">
                              {formatPrice(String(order.totalAmount))}
                            </td>
            
                            <td>
                              <span className={`dash-status ${transactionStatuses[order.status].tone}`}>
                                {transactionStatuses[order.status].label}
                              </span>
                            </td>
            
                            <td>
                              {new Date(order.createdAt).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
          )}
          {["earnings", "payouts"].includes(tab) && (
            <section className="dash-panel dash-empty">
              <h2>Data {title.toLowerCase()} belum tersedia</h2>
              <p>Data ini belum tersedia dari layanan toko.</p>
            </section>
          )}
        </main>
        <dialog
          ref={listingDialog}
          className="listing-dialog dash-dialog seller-listing-placeholder"
          aria-labelledby={`${listingDialogId}-title`}
          aria-describedby={`${listingDialogId}-description`}
          onClose={() => setListingAction(null)}
          onClick={(event) => { if (event.target === listingDialog.current) listingDialog.current.close(); }}
        >
          {listingAction && (
            <>
              <div className="dialog-heading">
                <span className="section-kicker">SEGERA TERSEDIA</span>
                <button type="button" className="icon-button" aria-label="Tutup placeholder" onClick={() => listingDialog.current?.close()}><X size={20} /></button>
              </div>
              <h2 id={`${listingDialogId}-title`}>{listingActionLabels[listingAction.action]}</h2>
              {listingAction.listing && <p className="seller-listing-placeholder-product">{listingAction.listing.name}</p>}
              <p id={`${listingDialogId}-description`}>
                {listingAction.action === "add"
                  ? "Form untuk menambahkan listing baru akan tersedia di sini."
                  : listingAction.action === "edit"
                    ? "Form untuk mengubah detail, harga, dan stok listing akan tersedia di sini."
                    : "Fitur penghapusan listing akan tersedia di sini."}
                {" "}Ini masih placeholder. Belum ada data listing yang ditambahkan, diubah, atau dihapus.
              </p>
              <button type="button" className="neo-button secondary full-width" onClick={() => listingDialog.current?.close()}>Kembali ke listing</button>
            </>
          )}
        </dialog>
      </div>
    </div>
  );
}
