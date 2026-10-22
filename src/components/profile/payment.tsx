"use client";

import { useId, useRef, useState } from "react";
import { CreditCard, X } from "lucide-react";
import type { BuyerTransaction } from "@/lib/types/buyer";

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    ...(currency === "IDR" ? { maximumFractionDigits: 0 } : {}),
  }).format(amount);
}

const paymentMethods = [
  {
    id: "bca",
    name: "BCA Virtual Account",
    destination: "80777 0000 1234 5678",
    destinationLabel: "Nomor virtual account (dummy)",
    steps: [
      "Buka aplikasi mobile banking BCA dan pilih Transfer > BCA Virtual Account.",
      "Masukkan nomor virtual account dummy yang ditampilkan di atas.",
      "Periksa nama penerima MMO Market Demo dan total pembayaran.",
      "Pada pembayaran asli, konfirmasi transaksi menggunakan PIN mobile banking.",
    ],
  },
  {
    id: "mandiri",
    name: "Mandiri Virtual Account",
    destination: "88088 0000 1234 5678",
    destinationLabel: "Nomor virtual account (dummy)",
    steps: [
      "Buka aplikasi Livin’ by Mandiri dan pilih Bayar > E-Commerce.",
      "Pilih penyedia pembayaran dan masukkan nomor virtual account dummy di atas.",
      "Periksa nama penerima MMO Market Demo dan total pembayaran.",
      "Pada pembayaran asli, konfirmasi transaksi menggunakan PIN aplikasi.",
    ],
  },
  {
    id: "dana",
    name: "DANA",
    destination: "0812 0000 0000",
    destinationLabel: "Nomor DANA (dummy)",
    steps: [
      "Buka aplikasi DANA dan pilih Kirim > Kirim ke Teman.",
      "Masukkan nomor DANA dummy yang ditampilkan di atas.",
      "Masukkan total pembayaran dan gunakan ID pesanan sebagai catatan.",
      "Pada pembayaran asli, periksa penerima lalu konfirmasi menggunakan PIN DANA.",
    ],
  },
] as const;

export function Payment({ transaction: selected }: { transaction: BuyerTransaction }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const [methodId, setMethodId] = useState<string>(paymentMethods[0].id);
  const method = paymentMethods.find((item) => item.id === methodId)!;

  return (
    <>
      <button
        type="button"
        className="neo-button small"
        aria-haspopup="dialog"
        onClick={() => {
          setMethodId(paymentMethods[0].id);
          dialog.current?.showModal();
        }}
      >
        <CreditCard size={18} aria-hidden="true" />
        Payment
      </button>
      <dialog
        ref={dialog}
        className="listing-dialog buyer-payment-dialog"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className="dialog-heading">
          <span className="section-kicker">PEMBAYARAN PESANAN</span>
          <button
            type="button"
            className="icon-button"
            aria-label="Tutup pembayaran"
            onClick={() => dialog.current?.close()}
          >
            <X size={20} />
          </button>
        </div>
        <h2 id={titleId}>Payment</h2>
        <p id={descriptionId}>
          Pilih metode pembayaran untuk melihat instruksi pesanan ini.
        </p>
        <div className="buyer-payment-grid">
          <section className="buyer-payment-summary" aria-label="Ringkasan pesanan">
            <dl className="listing-details" aria-live="polite">
              <div><dt>ID pesanan</dt><dd>{selected.id}</dd></div>
              <div><dt>Produk</dt><dd>{selected.product}</dd></div>
              <div><dt>Game / server</dt><dd>{selected.game} / {selected.server}</dd></div>
              <div><dt>Seller</dt><dd>{selected.seller}</dd></div>
              <div><dt>Jumlah</dt><dd>{selected.quantity}</dd></div>
              <div><dt>Harga satuan</dt><dd>{formatAmount(selected.unitPrice, selected.currency)}</dd></div>
              <div className="buyer-payment-total"><dt>Total pembayaran</dt><dd>{formatAmount(selected.totalAmount, selected.currency)}</dd></div>
            </dl>
            <p className="buyer-payment-note">
              Mode demo — seluruh metode, nomor tujuan, dan instruksi memakai
              data dummy. Jangan melakukan pembayaran. Status transaksi tidak berubah.
            </p>
          </section>
          <div className="buyer-payment-method">
            <label className="buyer-payment-select">
              Metode pembayaran
              <select value={methodId} onChange={(event) => setMethodId(event.target.value)}>
                {paymentMethods.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </label>
            <section className="buyer-payment-instructions" aria-live="polite" aria-atomic="true">
              <h3>Instruksi {method.name}</h3>
              <dl className="listing-details">
                <div><dt>{method.destinationLabel}</dt><dd className="buyer-mono">{method.destination}</dd></div>
                <div><dt>Nama penerima</dt><dd>MMO Market Demo</dd></div>
                <div><dt>Nominal</dt><dd>{formatAmount(selected.totalAmount, selected.currency)}</dd></div>
              </dl>
              <ol>{method.steps.map((step) => <li key={step}>{step}</li>)}</ol>
            </section>
          </div>
        </div>
        <div className="buyer-payment-actions">
          <button type="button" className="neo-button small secondary" onClick={() => dialog.current?.close()}>
            Tutup
          </button>
        </div>
      </dialog>
    </>
  );
}
