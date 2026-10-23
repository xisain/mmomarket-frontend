"use client";

import { useId, useRef, useState } from "react";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { getPurchaseQuote } from "@/lib/listing-purchase";
import type { GameOffer } from "@/lib/types/game-market";
import { formatPrice } from "@/lib/utils/format";

export function ListingPurchase({ listing }: { listing: GameOffer }) {
  const [value, setValue] = useState("1");
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const quote = getPurchaseQuote(listing, value);
  const unavailable = listing.status !== "active" || quote.maxQuantity === 0;

  return (
    <>
      <form className="neo-purchase-form" onSubmit={(event) => {
        event.preventDefault();
        if (!quote.error) dialog.current?.showModal();
      }}>
        <div className="neo-quantity-heading"><label htmlFor={`${id}-quantity`}>Quantity / jumlah paket</label><span>{listing.stock_type === "finite" ? `Stok ${quote.maxQuantity.toLocaleString("id-ID")}` : "Sesuai kapasitas seller"}</span></div>
        <div className="neo-quantity-control">
          <button type="button" aria-label="Kurangi jumlah" disabled={unavailable || !Number.isSafeInteger(quote.quantity) || quote.quantity <= 1} onClick={() => setValue(String(Math.max(1, quote.quantity - 1)))}><Minus size={18} /></button>
          <input id={`${id}-quantity`} type="number" inputMode="numeric" min="1" step="1" max={listing.stock_type === "finite" && quote.maxQuantity > 0 ? quote.maxQuantity : undefined} value={value} disabled={unavailable} required aria-invalid={Boolean(quote.error)} aria-describedby={quote.error ? `${id}-error` : `${id}-unit`} onChange={(event) => setValue(event.target.value)} />
          <button type="button" aria-label="Tambah jumlah" disabled={unavailable || !Number.isSafeInteger(quote.quantity) || quote.quantity >= quote.maxQuantity} onClick={() => setValue(String(Math.min(quote.maxQuantity, Math.max(1, quote.quantity + 1))))}><Plus size={18} /></button>
        </div>
        <p className="neo-purchase-unit" id={`${id}-unit`}>1 paket = {listing.quantity_per_unit.toLocaleString("id-ID")} {listing.quantity_per_unit === 1 ? "layanan" : "unit"}.</p>
        {quote.error && <p id={`${id}-error`} className="field-error" role="status">{quote.error}</p>}
        <div className="neo-purchase-total" aria-live="polite"><span>Total harga</span><strong>{formatPrice(String(quote.total))}</strong></div>
        <button className="neo-buy-button" type="submit" disabled={Boolean(quote.error)} aria-haspopup="dialog"><ShoppingBag size={20} aria-hidden="true" /> {unavailable ? "Stok tidak tersedia" : "Beli"}</button>
        <p className="neo-purchase-note">Data dummy. Tombol Beli menampilkan ringkasan; pemesanan dan pembayaran belum tersedia.</p>
      </form>
      <dialog ref={dialog} className="listing-dialog neo-listing-dialog" aria-labelledby={`${id}-title`} onClick={(event) => { if (event.target === dialog.current) dialog.current.close(); }}>
        <div className="dialog-heading"><h2 id={`${id}-title`}>Ringkasan pembelian</h2><button type="button" className="neo-close-button" aria-label="Tutup ringkasan" onClick={() => dialog.current?.close()}><X size={20} /></button></div>
        <p>{listing.name}</p>
        <dl className="listing-details">
          <div><dt>Seller</dt><dd>{listing.seller.name}</dd></div>
          <div><dt>Jumlah</dt><dd>{quote.quantity.toLocaleString("id-ID")} paket</dd></div>
          <div><dt>Harga per paket</dt><dd>{formatPrice(listing.price)}</dd></div>
          <div><dt>Total</dt><dd>{formatPrice(String(quote.total))}</dd></div>
        </dl>
        <div className="preview-alert">Ini pratinjau dari data dummy. Belum ada pesanan atau pembayaran yang dibuat.</div>
        <button className="neo-filter-done full-width" onClick={() => dialog.current?.close()}>Kembali ke produk</button>
      </dialog>
    </>
  );
}
