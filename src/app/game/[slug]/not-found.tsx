import Link from "next/link";

export default function GameNotFound() {
  return <div className="section container empty-state"><h1>Game atau kategori tidak ditemukan</h1><p>Periksa alamat halaman atau pilih game dari katalog.</p><Link className="neo-button secondary" href="/games">Kembali ke katalog</Link></div>;
}
