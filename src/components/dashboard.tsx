"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ClipboardList,
  Coins,
  FileClock,
  LayoutDashboard,
  Menu,
  Package,
  Search,
  ShieldCheck,
  Store,
  Users,
  Wallet,
  X,
  CircleHelp,
  type LucideIcon,
} from "lucide-react";
import { Brand } from "@/components/site-shell";
import {
  adminSections,
  sellerSections,
  sellerBalance,
  type DashboardRole,
  type DemoRow,
} from "@/lib/dashboard-data";
import { formatPrice } from "@/lib/utils/format";
import "./dashboard.css";

const icons: Record<string, LucideIcon> = {
  overview: LayoutDashboard,
  orders: ClipboardList,
  listings: Package,
  earnings: Coins,
  payouts: Wallet,
  sellers: Users,
  disputes: CircleHelp,
  audit: FileClock,
};
function statusTone(status: string) {
  if (
    ["Aktif", "Selesai", "Berhasil", "Tersedia", "Disetujui"].includes(status)
  )
    return "success";
  if (["Terbuka", "Ditolak", "Gagal"].includes(status)) return "danger";
  if (["Diproses", "Diserahkan", "Ditinjau"].includes(status)) return "info";
  if (["Draft", "Tercatat"].includes(status)) return "neutral";
  return "warning";
}
export function Dashboard({ role }: { role: DashboardRole }) {
  const admin = role === "admin";
  const sections = admin ? adminSections : sellerSections;
  const [tab, setTab] = useState("overview");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [detail, setDetail] = useState<DemoRow | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const activeSection =
    sections.find((section) => section.id === tab) ??
    sections.find((section) => section.id === "orders")!;
  const rows = activeSection.rows.filter(
    (row) =>
      (status === "all" || status === row.status) &&
      `${row.id} ${row.name} ${row.subtitle} ${row.party}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const stats = admin
    ? [
        {
          label: "Seller perlu review",
          value: String(
            adminSections[0].rows.filter(
              (row) => row.status === "Menunggu review",
            ).length,
          ),
          note: "Pengajuan menunggu verifikasi",
          tab: "sellers",
          icon: Users,
          tone: "lavender",
        },
        {
          label: "Pesanan berjalan",
          value: String(
            adminSections[2].rows.filter((row) => row.status !== "Selesai")
              .length,
          ),
          note: "Dari 4 pesanan contoh",
          tab: "orders",
          icon: ClipboardList,
          tone: "yellow",
        },
        {
          label: "Dispute terbuka",
          value: String(adminSections[3].rows.length),
          note: "Termasuk kasus dalam peninjauan",
          tab: "disputes",
          icon: CircleHelp,
          tone: "pink",
        },
        {
          label: "Payout perlu review",
          value: "1",
          note: `${formatPrice(sellerBalance.payoutPending)} diajukan`,
          tab: "payouts",
          icon: Wallet,
          tone: "green",
        },
      ]
    : [
        {
          label: "Perlu diproses",
          value: "1",
          note: "Pesanan baru menunggu tindakan",
          tab: "orders",
          icon: ClipboardList,
          tone: "yellow",
        },
        {
          label: "Listing aktif",
          value: String(
            sellerSections[1].rows.filter((row) => row.status === "Aktif")
              .length,
          ),
          note: "Dan 1 listing masih draft",
          tab: "listings",
          icon: Package,
          tone: "lavender",
        },
        {
          label: "Saldo tersedia",
          value: formatPrice(sellerBalance.available),
          note: "Di luar dana pengajuan pencairan",
          tab: "earnings",
          icon: Wallet,
          tone: "green",
        },
        {
          label: "Pendapatan tertahan",
          value: formatPrice(sellerBalance.held),
          note: "Menunggu penyelesaian pesanan",
          tab: "earnings",
          icon: Coins,
          tone: "pink",
        },
      ];
  function navigate(next: string) {
    setTab(next);
    setQuery("");
    setStatus("all");
    setMobileOpen(false);
    requestAnimationFrame(() => heading.current?.focus());
  }
  function showDetail(row: DemoRow) {
    setDetail(row);
    dialog.current?.showModal();
  }
  return (
    <div className={`dash-shell ${admin ? "dash-admin" : "dash-seller"}`}>
      <aside className="dash-sidebar">
        <Brand />
        <div className="dash-workspace">
          <span className="dash-workspace-icon">
            {admin ? <ShieldCheck size={23} /> : <Store size={23} />}
          </span>
          <div>
            <strong>{admin ? "Marketplace HQ" : "Goldsmith Guild"}</strong>
            <small>{admin ? "Admin workspace" : "Seller workspace"}</small>
          </div>
          <span className="dash-demo-dot" />
        </div>
        <p className="dash-nav-label">WORKSPACE</p>
        <button
          className="dash-mobile-nav-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="dashboard-navigation"
        >
          <Menu size={18} />{" "}
          {tab === "overview" ? "Ringkasan" : activeSection.title}
          <span>{mobileOpen ? "Tutup" : "Menu"}</span>
        </button>
        <nav
          id="dashboard-navigation"
          aria-label={`Menu dashboard ${role}`}
          className={`dash-nav ${mobileOpen ? "is-open" : ""}`}
        >
          {[{ id: "overview", title: "Ringkasan" }, ...sections].map((item) => {
            const Icon = icons[item.id] ?? Package;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={tab === item.id ? "active" : ""}
                aria-current={tab === item.id ? "page" : undefined}
              >
                <Icon size={18} />
                <span>{item.title}</span>
                {item.id === "orders" && <small>4</small>}
                {admin && item.id === "sellers" && <small>2</small>}
              </button>
            );
          })}
        </nav>
        <div className="dash-sidebar-bottom">
          <div className="dash-preview-card">
            <span>WORK IN PROGRESS</span>
            <strong>Ruang untuk ide besar.</strong>
            <p>
              Jelajahi dashboard dengan data contoh. Semua aksi masih berupa
              pratinjau.
            </p>
          </div>
          <Link href="/" className="dash-market-link">
            <ArrowLeft size={17} /> Kembali ke marketplace
          </Link>
          <div className="dash-profile">
            <span className="dash-profile-avatar">{admin ? "AD" : "GG"}</span>
            <div>
              <strong>{admin ? "Admin Demo" : "Goldsmith Guild"}</strong>
              <small>{admin ? "Administrator" : "Seller demo"}</small>
            </div>
          </div>
        </div>
      </aside>
      <div className="dash-body">
        <header className="dash-topbar">
          <span>
            Workspace <span>/</span> {admin ? "Admin" : "Seller"} <span>/</span>{" "}
            <strong>
              {tab === "overview" ? "Ringkasan" : activeSection.title}
            </strong>
          </span>
          <Link href={admin ? "/seller" : "/admin"}>
            Preview {admin ? "seller" : "admin"}
            <ArrowUpRight size={16} />
          </Link>
        </header>
        <main className="dash-main" id="main-content">
          <div className="dash-demo-banner">
            <span className="dash-demo-pill">DEMO MODE</span>
            <p>
              Data dummy · Snapshot 20 Oktober 2026 · Belum terhubung ke API
            </p>
          </div>
          <div className="dash-page-heading">
            <div>
              <span className="section-kicker">
                {admin
                  ? "KEEP THE MARKETPLACE MOVING"
                  : "YOUR STORE, YOUR NEXT CHAPTER"}
              </span>
              <h1 ref={heading} tabIndex={-1}>
                {tab === "overview"
                  ? admin
                    ? "Semua dalam pantauan."
                    : "Halo, Goldsmith Guild."
                  : activeSection.title}
              </h1>
              <p>
                {tab === "overview"
                  ? admin
                    ? "Tinjau antrean penting dan aktivitas marketplace hari ini."
                    : "Ini ringkasan toko dan pesanan yang perlu kamu tangani."
                  : activeSection.description}
              </p>
            </div>
            <span className="dash-role-tag">
              {admin ? <ShieldCheck size={17} /> : <Store size={17} />}
              {admin ? "ADMIN PANEL" : "SELLER PANEL"}
            </span>
          </div>
          {tab === "overview" && (
            <>
              <section
                className="dash-stats"
                aria-label="Ringkasan data contoh"
              >
                {stats.map((stat) => (
                  <button
                    className={`dash-stat ${stat.tone}`}
                    key={stat.label}
                    onClick={() => navigate(stat.tab)}
                  >
                    <span className="dash-stat-label">
                      {stat.label}
                      <stat.icon size={20} />
                    </span>
                    <strong>{stat.value}</strong>
                    <span className="dash-stat-note">
                      {stat.note}
                      <ArrowUpRight size={15} />
                    </span>
                  </button>
                ))}
              </section>
              <div className="dash-overview-grid">
                <section className="dash-panel dash-tasks">
                  <div className="dash-panel-title">
                    <div>
                      <span className="section-kicker">YOUR NEXT MOVES</span>
                      <h2>{admin ? "Perlu perhatian" : "Prioritas tokomu"}</h2>
                    </div>
                    <span className="dash-small-label">3 tugas contoh</span>
                  </div>
                  {(admin
                    ? [
                        {
                          title: "2 toko menunggu verifikasi",
                          text: "Periksa pengajuan seller baru.",
                          tab: "sellers",
                          icon: Users,
                        },
                        {
                          title: "2 dispute perlu ditinjau",
                          text: "Baca kronologi sebelum mengambil keputusan.",
                          tab: "disputes",
                          icon: CircleHelp,
                        },
                        {
                          title: "1 payout menunggu persetujuan",
                          text: "Goldsmith Guild · Rp500.000",
                          tab: "payouts",
                          icon: Wallet,
                        },
                      ]
                    : [
                        {
                          title: "1 pesanan siap diproses",
                          text: "ORD-1024 · 100.000 Gold",
                          tab: "orders",
                          icon: ClipboardList,
                        },
                        {
                          title: "1 listing masih draft",
                          text: "Periksa kembali detail Paket Gold Starter.",
                          tab: "listings",
                          icon: Package,
                        },
                        {
                          title: "Pencairan sedang diajukan",
                          text: "PAY-0082 · Rp500.000 menunggu admin",
                          tab: "payouts",
                          icon: Wallet,
                        },
                      ]
                  ).map((task) => (
                    <button
                      className="dash-task"
                      key={task.title}
                      onClick={() => navigate(task.tab)}
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
                  <span className="section-kicker">
                    {admin ? "MARKETPLACE NOTES" : "STORE SNAPSHOT"}
                  </span>
                  <div className="dash-note-symbol">
                    {admin ? <ShieldCheck size={43} /> : <Store size={43} />}
                  </div>
                  <h2>
                    {admin
                      ? "Keputusan jelas.\nMarketplace terjaga."
                      : "Toko kecil,\npeluang besar."}
                  </h2>
                  <p>
                    {admin
                      ? "Persetujuan seller, refund, dan payout akan mengikuti izin serta validasi backend saat integrasi tersedia."
                      : "Kelola penawaran dan progres layanan langsung dari toko. Dana tersedia, tertahan, dan pencairan ditampilkan terpisah."}
                  </p>
                  <button
                    className="dash-inline-link"
                    onClick={() => navigate(admin ? "audit" : "listings")}
                  >
                    {admin ? "Lihat log aktivitas" : "Lihat listing toko"}
                    <ArrowUpRight size={17} />
                  </button>
                </section>
              </div>
            </>
          )}
          <section
            className="dash-panel dash-data-panel"
            aria-labelledby="dashboard-table-title"
          >
            <div className="dash-panel-title">
              <div>
                <span className="section-kicker">
                  {tab === "overview" ? "LATEST ACTIVITY" : "WORKSPACE DATA"}
                </span>
                <h2 id="dashboard-table-title">
                  {tab === "overview" ? "Pesanan terbaru" : activeSection.title}
                </h2>
              </div>
              {tab === "overview" ? (
                <button
                  className="dash-inline-link"
                  onClick={() => navigate("orders")}
                >
                  Lihat semua
                  <ArrowRight size={16} />
                </button>
              ) : (
                <span className="dash-small-label">
                  {activeSection.rows.length} data contoh
                </span>
              )}
            </div>
            <div className="dash-table-toolbar">
              <label className="dash-search">
                <Search size={18} />
                <span className="sr-only">
                  Cari {activeSection.title.toLowerCase()}
                </span>
                <input
                  type="search"
                  placeholder="Cari ID, nama, atau game…"
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
                  {Array.from(
                    new Set(activeSection.rows.map((row) => row.status)),
                  ).map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
            </div>
            <div
              className="dash-table-scroll"
              role="region"
              aria-label={`Tabel ${activeSection.title.toLowerCase()}`}
              tabIndex={0}
            >
              <table className="dash-table">
                <caption className="sr-only">
                  Data dummy {activeSection.title.toLowerCase()}, snapshot 20
                  Oktober 2026
                </caption>
                <thead>
                  <tr>
                    <th scope="col">{activeSection.subject}</th>
                    <th scope="col">{activeSection.partyLabel}</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="dash-numeric">
                      Nominal
                    </th>
                    <th scope="col">Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <th scope="row">
                        <span className="dash-row-id">{row.id}</span>
                        <strong>{row.name}</strong>
                        <small>{row.subtitle}</small>
                      </th>
                      <td>{row.party}</td>
                      <td>
                        <span
                          className={`dash-status ${statusTone(row.status)}`}
                        >
                          <span />
                          {row.status}
                        </span>
                      </td>
                      <td className="dash-numeric">
                        {row.amount ? formatPrice(row.amount) : "—"}
                      </td>
                      <td>
                        <button
                          className="dash-detail-button"
                          onClick={() => showDetail(row)}
                          aria-label={`Lihat detail ${row.id}`}
                        >
                          <ArrowUpRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows.length === 0 && (
                <div className="dash-empty">
                  <Search size={27} />
                  <h3>Data tidak ditemukan</h3>
                  <p>Coba kata pencarian atau status lain.</p>
                  <button
                    className="neo-button secondary"
                    onClick={() => {
                      setQuery("");
                      setStatus("all");
                    }}
                  >
                    Reset filter
                  </button>
                </div>
              )}
            </div>
            <div className="dash-table-footer" aria-live="polite">
              <span>
                Menampilkan {rows.length} dari {activeSection.rows.length} data
                contoh
              </span>
              <span>Seluruh nominal dalam IDR</span>
            </div>
          </section>
          <footer className="dash-footer">
            <span>
              © 2026 MMO Market · {admin ? "Admin" : "Seller"} workspace
            </span>
            <span>Placeholder UI / Tidak ada perubahan data nyata</span>
          </footer>
        </main>
      </div>
      <dialog
        ref={dialog}
        className="listing-dialog dash-dialog"
        aria-labelledby="dashboard-detail-title"
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current.close();
        }}
        onClose={() => setDetail(null)}
      >
        {detail && (
          <>
            <div className="dialog-heading">
              <span className="section-kicker">DETAIL DATA DUMMY</span>
              <button
                className="icon-button"
                aria-label="Tutup detail"
                onClick={() => dialog.current?.close()}
              >
                <X size={20} />
              </button>
            </div>
            <span className="dash-row-id">{detail.id}</span>
            <h2 id="dashboard-detail-title">{detail.name}</h2>
            <p>{detail.subtitle}</p>
            <dl className="listing-details">
              <div>
                <dt>{activeSection.partyLabel}</dt>
                <dd>{detail.party}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  <span className={`dash-status ${statusTone(detail.status)}`}>
                    {detail.status}
                  </span>
                </dd>
              </div>
              {detail.amount && (
                <div>
                  <dt>Nominal contoh</dt>
                  <dd>{formatPrice(detail.amount)}</dd>
                </div>
              )}
              <div>
                <dt>Pembaruan</dt>
                <dd>{detail.date}</dd>
              </div>
            </dl>
            <p className="dash-dialog-note">{detail.note}</p>
            <div className="preview-alert">
              Pratinjau saja. Aksi edit, pemenuhan, persetujuan, dan pencairan
              belum diaktifkan.
            </div>
            <button
              className="neo-button full-width secondary"
              onClick={() => dialog.current?.close()}
            >
              Tutup detail
              <ArrowRight size={17} />
            </button>
          </>
        )}
      </dialog>
    </div>
  );
}
