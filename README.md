# MMO Market Frontend

UI marketplace dengan Next.js App Router, TypeScript, Tailwind CSS, dan gaya neobrutalism berdasarkan [DESIGN.md](../../DESIGN.md).

## Menjalankan

```bash
bun install
bun run dev
```

Buka `http://localhost:3000`.

| Halaman | Rute |
| --- | --- |
| Landing page | `/` |
| Detail game | `/games/[slug]` |
| Login | `/login` |
| Register | `/register` |
| Placeholder dashboard seller | `/seller` |
| Placeholder dashboard admin | `/admin` |

## Fitur UI

- Pencarian game/layanan, filter game dan kategori currency/boosting, reset serta empty state.
- Dialog detail listing dengan region, server, seller, satuan harga, dan ketersediaan.
- Menu mobile, FAQ, navigasi antarhalaman, dan layout responsif.
- Form dengan validasi, pesan error, fokus ke field invalid, dan toggle visibilitas password.
- Font Inter dan Space Grotesk lokal, lengkap dengan lisensi di `src/app/fonts/`.
- Ilustrasi SVG orisinal, tanpa ketergantungan aset gambar eksternal.

## Dashboard dummy

`/seller` dan `/admin` memakai data lokal dari `src/lib/dashboard-data.ts`. Navigasi sidebar mengganti tampilan di halaman yang sama. Pencarian, filter status, reset filter, dan dialog detail dapat digunakan. Tautan di header berpindah antar-preview admin/seller. Tidak ada perubahan data atau aksi finansial aktif.

Dashboard dapat dibuka langsung untuk keperluan pratinjau, tanpa sesi login atau pemeriksaan peran. Sebelum digunakan dengan data nyata, integrasikan sesi serta otorisasi backend. Statistik dan antrean merupakan snapshot contoh 20 Oktober 2026. Saldo tersedia, tertahan, dan payout diajukan adalah kelompok terpisah; tabel pendapatan hanya berisi sebagian riwayat contoh.

## Data dan integrasi berikutnya

`src/lib/demo-data.ts` berisi fixture presentasi, bukan seed database atau respons API aktual. ID fixture berupa identifier lokal. Harga disimpan sebagai string desimal sesuai model listing backend. Rupiah digunakan untuk contoh tampilan; konfigurasi mata uang produksi belum ditetapkan.

Katalog landing dan detail game mengambil API di Server Components melalui `gameService.getAll()` dan `getBySlug()`. Base URL memakai `NEXT_PUBLIC_API_URL` (contoh `http://localhost:8000/api/v1`). Route publik backend repository adalah **`/game` dan `/game/:slug/`**, bukan `/games`. Types bersama berada di `src/lib/types/`, dan envelope `{ success, data }` divalidasi sebelum diteruskan ke UI. HTTP errors tetap berupa `ApiError`; JSON tidak valid, envelope gagal, dan data null ditolak.

Artwork SVG tetap memakai komponen lama dengan mapping slug dan fallback di `src/lib/game-presentation.ts`. Listing, seller, region, dan server masih fixture. Metadata game untuk listing hanya digunakan sebagai label pratinjau; relasi ke game API dicocokkan lewat slug agar UUID asli tidak memutus filter atau dialog. `category_id` fixture adalah UUID; label kategori dipetakan terpisah. Fixture tidak dikirim ke backend.

Auth tetap memakai helper `api()` dengan `credentials: "include"`. Fetch game bersifat publik dan tidak meneruskan cookie browser dari server. Header akun tetap memanggil `/auth/me` di client seperti sebelumnya. Konfigurasi CORS dan cookie backend tetap diperlukan untuk autentikasi browser.

Backend saat ini mengembalikan HTTP 500 untuk slug game yang tidak ditemukan. Frontend menggunakan `notFound()` untuk HTTP 404, sedangkan HTTP 500 menampilkan error dengan tombol coba lagi. Perbaikan status missing-game memerlukan pekerjaan backend terpisah.

## Pemeriksaan

```bash
bun test tests/game-data.test.ts
bunx tsc --noEmit --incremental false
bun run lint
bun run build
```

Build default memerlukan lingkungan yang mengizinkan proses/port internal Turbopack. Game diambil saat request di bawah Suspense; backend tidak diperlukan saat prerender build.
