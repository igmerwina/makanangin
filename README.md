# Makan Angin 🍛

Situs parodi pesan-makanan Indonesia. Kamu pesan, bayar demo, kurir jalan — terus dia telepon bilang makanannya **ga bakal dateng**. Yang beneran kamu dapet cuma resep asli dan cerita asal daerahnya.

80 hidangan dari 34 provinsi. Ga ada pembayaran asli, ga ada data kartu yang diminta atau disimpan, di mana pun.

## Screenshot

> Taruh file PNG di `docs/screenshots/` lalu isi tabel di bawah — belum ada gambar tersimpan di repo.

| Beranda | Menu | Detail item |
|---|---|---|
| `docs/screenshots/beranda.png` | `docs/screenshots/menu.png` | `docs/screenshots/detail.png` |

| Keranjang | Kurir & panggilan | Resep |
|---|---|---|
| `docs/screenshots/keranjang.png` | `docs/screenshots/kurir.png` | `docs/screenshots/resep.png` |

## Alur

Beranda → Menu → Detail item (pilih opsi) → Keranjang → Checkout (kartu demo, disabled) → Kurir jalan → Panggilan masuk ("maaf, ga bisa dianter") → Layar konsolasi + resep asli

## Fitur

- Katalog 80 item — makanan, minuman, jajanan, kudapan — dari 34 provinsi
- Foto asli tiap item (Wikimedia Commons, dikompres ke thumbnail kecil)
- Filter kategori + pencarian
- Keranjang, opsi/varian per item, harga dinamis
- Checkout dengan kartu demo (input `disabled`, ga pernah nerima data kartu asli)
- Animasi kurir + panggilan masuk gaya telepon HP, alasan gagal antar acak
- Resep lengkap tiap item (bahan, langkah, tips) + `Recipe` JSON-LD buat SEO
- Riwayat pesanan + total "uang hemat", tersimpan di `localStorage`
- Mobile-first, bottom nav di HP, top nav di desktop
- Motion pakai `@react-spring/web` — otomatis mati kalau `prefers-reduced-motion`

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript, static export (`output: 'export'`)
- Tailwind CSS v4 (token warna di `app/globals.css`)
- `@react-spring/web` buat animasi
- Data konten di `data/items.json` (JSON statis, bukan database)
- Package manager: **pnpm** (bun cuma dipakai buat jalanin script TS `scripts/validate-items.ts` — pnpm ga bisa eksekusi `.ts` langsung tanpa loader tambahan)

## Jalanin lokal

```bash
pnpm install
pnpm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

```bash
pnpm run build   # validasi data + build statis ke out/
```

## Struktur

```
app/            rute (App Router)
components/     komponen UI
lib/            logic murni — cart, filter, harga, gambar, warung
data/           items.json (80 item), warung.json, kurir.json, alasan.json, gambar.json
scripts/        validator data + self-check (jalan otomatis sebelum build)
```

## Legal

Situs parodi. Ga ada makanan asli, ga ada pembayaran asli, ga ada data kartu yang disimpan. Lihat halaman [Tentang](app/tentang/page.tsx) di situs untuk disclaimer lengkap.
