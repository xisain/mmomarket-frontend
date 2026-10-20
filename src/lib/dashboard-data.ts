/** UI-only fixtures. No API calls, persistence, or financial mutations. */
export type DashboardRole = "admin" | "seller";
export type DemoRow = { id: string; name: string; subtitle: string; party: string; amount?: string; status: string; date: string; note: string };
export type DemoSection = { id: string; title: string; description: string; subject: string; partyLabel: string; rows: DemoRow[] };

const orders: DemoRow[] = [
  { id: "ORD-1024", name: "100.000 Gold", subtitle: "World of Warcraft · NA / Area 52", party: "Aria Dawn", amount: "145000.00", status: "Perlu diproses", date: "20 Okt 2026, 10:45 WIB", note: "Pembayaran contoh sudah terverifikasi. Seller menyiapkan pengiriman currency." },
  { id: "ORD-1023", name: "10 Juta Silver", subtitle: "Albion Online · Asia / Singapore", party: "Raka Storm", amount: "75000.00", status: "Diproses", date: "20 Okt 2026, 09:30 WIB", note: "Seller sedang menyiapkan penyerahan. Bukti pengiriman belum tersedia dalam pratinjau." },
  { id: "ORD-1022", name: "100.000 Gold", subtitle: "World of Warcraft · NA / Area 52", party: "Luna Vale", amount: "145000.00", status: "Diserahkan", date: "19 Okt 2026, 16:20 WIB", note: "Penyerahan contoh sudah dilakukan. Menunggu konfirmasi penerimaan buyer." },
  { id: "ORD-1021", name: "10 Juta Silver", subtitle: "Albion Online · Asia / Singapore", party: "Kai Rivers", amount: "75000.00", status: "Selesai", date: "19 Okt 2026, 14:10 WIB", note: "Buyer telah mengonfirmasi penerimaan pada data contoh." },
];
const payouts: DemoRow[] = [
  { id: "PAY-0082", name: "Pencairan Oktober", subtitle: "Bank contoh · •••• 4821", party: "Goldsmith Guild", amount: "500000.00", status: "Diajukan", date: "20 Okt 2026, 08:00 WIB", note: "Menunggu persetujuan admin. Tidak ada dana yang dipindahkan dalam pratinjau ini." },
  { id: "PAY-0079", name: "Pencairan September", subtitle: "Bank contoh · •••• 4821", party: "Goldsmith Guild", amount: "1000000.00", status: "Berhasil", date: "30 Sep 2026, 13:00 WIB", note: "Contoh payout dengan hasil provider berhasil. Referensi ini bukan transaksi nyata." },
];
const sellerListings: DemoRow[] = [
  { id: "LST-001", name: "100.000 Gold", subtitle: "World of Warcraft · Currency", party: "25 paket", amount: "145000.00", status: "Aktif", date: "20 Okt 2026, 09:00 WIB", note: "Region North America, server Area 52. Isi per paket: 100.000 gold." },
  { id: "LST-002", name: "10 Juta Silver", subtitle: "Albion Online · Currency", party: "40 paket", amount: "75000.00", status: "Aktif", date: "19 Okt 2026, 11:30 WIB", note: "Region Asia, server Singapore. Isi per paket: 10 juta silver." },
  { id: "LST-003", name: "Paket Gold Starter", subtitle: "World of Warcraft · Currency", party: "10 paket", amount: "45000.00", status: "Draft", date: "18 Okt 2026, 15:00 WIB", note: "Listing contoh belum dipublikasikan. Editor listing belum tersedia." },
];
export const sellerSections: DemoSection[] = [
  { id: "orders", title: "Pesanan", description: "Pantau kebutuhan buyer dan progres penyerahan.", subject: "Pesanan / Game", partyLabel: "Buyer", rows: orders },
  { id: "listings", title: "Listing toko", description: "Produk, harga per paket, dan stok contoh tokomu.", subject: "Listing", partyLabel: "Stok", rows: sellerListings },
  { id: "earnings", title: "Pendapatan", description: "Rincian contoh hasil penjualan setelah komisi marketplace.", subject: "Sumber pendapatan", partyLabel: "Komisi", rows: [
    { id: "EARN-021", name: "Penyelesaian ORD-1021", subtitle: "Bruto Rp75.000 · Neto Rp67.500", party: "Rp7.500 (10%)", amount: "67500.00", status: "Tersedia", date: "19 Okt 2026, 14:10 WIB", note: "Nilai pada kolom nominal adalah pendapatan bersih. Komisi 10% hanya ilustrasi." },
    { id: "EARN-022", name: "Penyerahan ORD-1022", subtitle: "Bruto Rp145.000 · Neto Rp130.500", party: "Rp14.500 (10%)", amount: "130500.00", status: "Tertahan", date: "19 Okt 2026, 16:20 WIB", note: "Pendapatan bersih contoh masih tertahan sampai persyaratan penyelesaian terpenuhi." },
  ] },
  { id: "payouts", title: "Pencairan", description: "Riwayat pengajuan dan hasil pencairan contoh.", subject: "Pengajuan", partyLabel: "Toko", rows: payouts },
];
export const adminSections: DemoSection[] = [
  { id: "sellers", title: "Verifikasi seller", description: "Tinjau antrean pendaftaran toko dan status verifikasinya.", subject: "Toko", partyLabel: "Pemilik", rows: [
    { id: "SLR-014", name: "Azeroth Supply", subtitle: "Pengajuan toko baru", party: "Dimas Putra", status: "Menunggu review", date: "20 Okt 2026, 09:15 WIB", note: "Dokumen identitas tidak disediakan pada placeholder. Keputusan verifikasi belum diaktifkan." },
    { id: "SLR-013", name: "Eorzea Corner", subtitle: "Pengajuan toko baru", party: "Nadia Kirana", status: "Menunggu review", date: "19 Okt 2026, 17:40 WIB", note: "Contoh antrean verifikasi seller. Tidak ada akun nyata di balik data ini." },
    { id: "SLR-001", name: "Goldsmith Guild", subtitle: "Currency · Multi-game", party: "Ari Pratama", status: "Disetujui", date: "15 Okt 2026, 10:00 WIB", note: "Toko contoh yang digunakan pada dashboard seller." },
  ] },
  { id: "listings", title: "Moderasi listing", description: "Periksa penawaran yang masuk sebelum keputusan moderasi.", subject: "Listing", partyLabel: "Seller", rows: sellerListings.map(row => ({ ...row, party: "Goldsmith Guild" })) },
  { id: "orders", title: "Transaksi", description: "Ringkasan contoh transaksi marketplace dan pemenuhannya.", subject: "Pesanan / Game", partyLabel: "Buyer", rows: orders },
  { id: "disputes", title: "Dispute & refund", description: "Antrean masalah transaksi untuk ditinjau admin.", subject: "Kasus", partyLabel: "Buyer", rows: [
    { id: "DSP-007", name: "Jumlah currency tidak sesuai", subtitle: "ORD-1016 · Albion Online", party: "Niko Ash", amount: "75000.00", status: "Terbuka", date: "20 Okt 2026, 08:30 WIB", note: "Nominal menunjukkan nilai pesanan yang disengketakan, bukan refund yang sudah disetujui. Bukti belum tersedia pada placeholder." },
    { id: "DSP-006", name: "Penyerahan belum diterima", subtitle: "ORD-1014 · World of Warcraft", party: "Mira Rose", amount: "145000.00", status: "Ditinjau", date: "19 Okt 2026, 15:20 WIB", note: "Contoh kasus yang sedang ditinjau. Tidak ada aksi keputusan atau refund aktif." },
  ] },
  { id: "payouts", title: "Persetujuan payout", description: "Pengajuan pencairan seller yang memerlukan pemeriksaan.", subject: "Pengajuan", partyLabel: "Seller", rows: payouts },
  { id: "audit", title: "Log aktivitas", description: "Kronologi contoh tindakan administratif marketplace.", subject: "Aktivitas", partyLabel: "Aktor", rows: [
    { id: "LOG-023", name: "Seller disetujui", subtitle: "Goldsmith Guild · SLR-001", party: "Admin Demo", status: "Tercatat", date: "15 Okt 2026, 10:00 WIB", note: "Contoh rekaman audit persetujuan seller." },
    { id: "LOG-022", name: "Payout berhasil", subtitle: "Goldsmith Guild · PAY-0079", party: "Payment worker", status: "Tercatat", date: "30 Sep 2026, 13:00 WIB", note: "Contoh event hasil pencairan terkonfirmasi oleh provider." },
  ] },
];
export const sellerBalance = { available: "567500.00", held: "130500.00", payoutPending: "500000.00" };
