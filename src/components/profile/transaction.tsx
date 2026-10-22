"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ClipboardList, Search, SlidersHorizontal } from "lucide-react";
import type { BuyerTransaction } from "@/lib/types/buyer";
import { transactionStatuses } from "@/lib/constants/transaction";
import { formatBuyerDate } from "@/lib/utils/format";
import { Payment } from "@/components/profile/payment";

function formatTransactionPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    ...(currency === "IDR" ? { maximumFractionDigits: 0 } : {}),
  }).format(amount);
}

export function Transaction({ transactions }: { transactions: BuyerTransaction[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const filtered = transactions.filter((item) =>
    (status === "all" || item.status === status) &&
    `${item.id} ${item.product} ${item.game} ${item.seller}`
      .toLowerCase().includes(query.trim().toLowerCase()),
  ).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  const pageSize = 5;
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function resetFilters() {
    setQuery("");
    setStatus("all");
    setPage(1);
  }

  return (
    <section className="dash-panel" aria-labelledby="buyer-transactions-title">
      <div className="dash-panel-title">
        <div>
          <span className="section-kicker">JEJAK PETUALANGANMU</span>
          <h2 id="buyer-transactions-title">Riwayat transaksi</h2>
        </div>
        <span className="dash-small-label">{transactions.length} transaksi</span>
      </div>
      <div className="dash-table-toolbar buyer-toolbar">
        <label className="dash-search">
          <Search size={17} aria-hidden="true" />
          <input
            aria-label="Cari transaksi"
            placeholder="Cari ID, produk, game, atau seller…"
            value={query}
            onChange={(event) => { setQuery(event.target.value); setPage(1); }}
          />
        </label>
        <label className="dash-status-filter buyer-filter">
          <SlidersHorizontal size={16} aria-hidden="true" />
          <span className="sr-only">Filter status transaksi</span>
          <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}>
            <option value="all">Semua status</option>
            {Object.entries(transactionStatuses).map(([value, item]) => (
              <option key={value} value={value}>{item.label}</option>
            ))}
          </select>
        </label>
      </div>
      {visible.length ? (
        <div className="buyer-transactions">
          {visible.map((item) => {
            const badge = transactionStatuses[item.status];
            return (
              <article className="buyer-order" key={item.id}>
                <div className="buyer-order-meta">
                  <span className="buyer-mono">{item.id}</span>
                  <time dateTime={item.createdAt}>{formatBuyerDate(item.createdAt)}</time>
                  <span className={`dash-status ${badge.tone}`}><span />{badge.label}</span>
                </div>
                <div className="buyer-order-body">
                  <span
                    className={`buyer-product-icon ${item.category === "Boosting" ? "lavender" : "yellow"}`}
                    aria-hidden="true"
                  >
                    <ClipboardList size={24} />
                  </span>
                  <div className="buyer-product">
                    <span>{item.game} <span aria-hidden="true">/</span> {item.category}</span>
                    <h3>{item.product}</h3>
                    <p>{item.quantity} × {formatTransactionPrice(item.unitPrice, item.currency)} <span aria-hidden="true">·</span> {item.seller}</p>
                  </div>
                  <div className="buyer-order-total">
                    <small>Total transaksi</small>
                    <strong>{formatTransactionPrice(item.totalAmount, item.currency)}</strong>
                  </div>
                </div>
                {item.status === "pending_payment" && (
                  <div className="buyer-order-actions">
                    <Payment transaction={item} />
                  </div>
                )}
                <details className="buyer-order-detail">
                  <summary>Detail transaksi</summary>
                  <dl>
                    <div><dt>Server / region</dt><dd>{item.server}</dd></div>
                    <div><dt>Seller</dt><dd>{item.seller}</dd></div>
                    <div><dt>Dibuat pada (WIB)</dt><dd>{formatBuyerDate(item.createdAt, true)}</dd></div>
                    <div><dt>Status</dt><dd>{badge.label}</dd></div>
                  </dl>
                </details>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="dash-empty">
          <ClipboardList size={34} aria-hidden="true" />
          <h3>{transactions.length ? "Transaksi tidak ditemukan" : "Belum ada transaksi"}</h3>
          <p>{transactions.length
            ? "Coba kata kunci lain atau ubah filter status."
            : "Mulai jelajahi game dan temukan bekal petualanganmu."}</p>
          {transactions.length ? (
            <button className="neo-button small secondary" onClick={resetFilters}>Reset filter</button>
          ) : (
            <Link className="neo-button small" href="/games">Jelajahi game <ArrowRight size={16} /></Link>
          )}
        </div>
      )}
      <div className="dash-table-footer buyer-pagination">
        <span role="status">{filtered.length
          ? `${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, filtered.length)} dari ${filtered.length} transaksi`
          : "0 transaksi"}</span>
        <div>
          <button className="icon-button" aria-label="Halaman sebelumnya" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>
            <ArrowLeft size={16} />
          </button>
          <span>{currentPage} / {pages}</span>
          <button className="icon-button" aria-label="Halaman berikutnya" disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)}>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
