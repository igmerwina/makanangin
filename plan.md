# makanangin.com — Plan

> "Makan angin" = pesan makanan, makanan tidak pernah datang. Situs dopamine gratis, tanpa transaksi.
> Referensi konsep: foodnevercomes.com. Pembeda: 100% makanan Indonesia (umum + tradisional per provinsi).

## 1. Produk

### Premis
User memesan makanan Indonesia lewat UI mirip aplikasi delivery. Bayar pakai kartu demo. Kurir animasi jalan. Di akhir kurir menelepon: makanan tidak akan datang. Sebagai gantinya user dapat resep aslinya, gratis.

### Kenapa ada
- Hiburan / novelty, shareable.
- Sebenarnya berguna: tiap item punya resep + asal daerah + cerita singkat. Jadi katalog kuliner Nusantara terselubung.

### Non-goals (jangan dibangun)
- Tidak ada pembayaran nyata, akun, backend order, notifikasi push, native app.
- Tidak ada login. Semua state di `localStorage`.
- Tidak ada CMS. Data = file JSON di repo.
- Tidak ada i18n framework. Bahasa Indonesia dulu; EN menyusul kalau ada trafik.

## 2. Konten (pembeda utama)

### Struktur data item
```jsonc
{
  "slug": "rendang-padang",
  "nama": "Rendang",
  "kategori": "makanan",          // makanan | minuman | jajanan | kudapan
  "tipe": "tradisional",           // umum | tradisional
  "daerah": "Sumatera Barat",
  "pulau": "Sumatera",
  "harga": 45000,                  // rupiah, fiktif
  "emoji": "🍛",
  "deskripsi": "…1-2 kalimat",
  "cerita": "…asal-usul 2-4 kalimat, kenapa ada, kapan disajikan",
  "pedas": 3,                      // 0-5
  "halal": true,
  "tags": ["berkuah", "daging", "lebaran"],
  "opsi": [
    { "nama": "Porsi", "pilihan": ["Kecil", "Sedang", "Jumbo (+10k)"] },
    { "nama": "Level pedas", "pilihan": ["Ga pedas", "Sedang", "Kematian"] },
    { "nama": "Tambahan", "pilihan": ["Kerupuk", "Telur", "Sambal ijo"], "multi": true }
  ],
  "resep": {
    "porsi": 4, "waktu": "3 jam", "sulit": "sedang",
    "bahan": ["…"], "langkah": ["…"], "tips": "…"
  }
}
```

### Target katalog
- Fase 1 (rilis): 80 item — 50 makanan, 15 minuman, 15 jajanan. Wajib mencakup 34 provinsi minimal 1 item.
- Fase 2: 200+ item.

### Kelompok konten
| Kelompok | Contoh |
|---|---|
| Umum / sehari-hari | nasi goreng, mie ayam, ayam geprek, bakso, soto ayam, gado-gado, martabak |
| Tradisional daerah | rendang, papeda, coto makassar, gudeg, rawon, pempek, ayam betutu, se'i sapi, tinutuan |
| Jajanan pasar | klepon, getuk, serabi, onde-onde, cenil, kue putu |
| Minuman | es cendol, es teler, bandrek, bajigur, wedang uwuh, es doger, kopi tubruk, teh talua |
| Warung fiktif (grup penjual) | Warteg Bahari, Padang Sederhana Sekali, Angkringan Pak Kumis, Bakso Malang Cak Gilang |

## 3. Alur utama (dopamine loop)

```
Beranda → Browse/Kategori → Detail item (opsi) → Keranjang
        → Checkout (kartu demo prefilled) → Animasi kurir jalan
        → Panggilan masuk full-screen: "Maaf, makanan tidak akan datang"
        → Layar konsolasi: resep gratis + cerita daerah + tombol share + pesan lagi
```

Rata-rata sesi target: < 90 detik sampai panggilan. Loop harus cepat, jangan ada form panjang.

## 4. Fitur

### Wajib (v1)
1. Katalog + filter: kategori, pulau/provinsi, level pedas, harga, halal.
2. Pencarian klien-side (nama, daerah, tag).
3. Detail item: opsi kustom, harga dinamis, tombol tambah keranjang.
4. Keranjang + ongkir fiktif + biaya layanan absurd ("biaya rindu kampung Rp 2.000").
5. Checkout palsu: kartu demo prefilled, tidak bisa diisi data asli (input readonly/disabled).
6. Animasi kurir: peta gaya doodle, kurir ojol fiktif (Bang Ojol Halu, Becak Turbo, Bemo Sakti), ETA mundur.
7. Panggilan masuk full-screen + alasan acak lucu ("ban bocor di Puncak", "kurir mampir warkop").
8. Layar resep gratis + cerita asal daerah.
9. Riwayat pesanan (localStorage) + total "uang hemat".
10. Share link hasil pesanan (state di-encode ke URL, tanpa server).
11. Halaman resep terpisah (SEO utama).
12. Mobile-first responsive; desktop layout beda (lihat §6).

### Nanti (jangan dulu)
- Nyoba Peruntungan / random order ("Bingung? Pesan Angin").
- Promo kilat berputar tiap 60-90 detik.
- Streak & badge ("7 hari gagal makan berturut-turut").
- Tray patungan multi-user.
- Suara kurir (rekaman/TTS).
- Blog.

## 5. Arsitektur

**Stack**: Next.js (App Router) + TypeScript + Tailwind, static export. Deploy Vercel/Cloudflare Pages. Tanpa database, tanpa API route.

Alasan: konten statis + SEO resep butuh SSG. State user cukup `localStorage` + URL. Menambah DB = biaya nol manfaat.

```
/app
  page.tsx                 beranda
  menu/page.tsx            katalog + filter
  menu/[slug]/page.tsx     detail item
  keranjang/page.tsx
  checkout/page.tsx
  kurir/page.tsx           animasi + panggilan
  resep/page.tsx           index resep
  resep/[slug]/page.tsx    resep (SEO)
  daerah/[pulau]/page.tsx  jelajah per pulau (SEO)
  riwayat/page.tsx
  tentang/page.tsx
/data
  items.json  warung.json  kurir.json  alasan.json
/lib
  cart.ts  storage.ts  share.ts  harga.ts  filter.ts
/components  …
```

State: satu React context untuk keranjang, disimpan ke `localStorage` (debounce). Tanpa Redux/Zustand.

Gambar: emoji + ilustrasi SVG/CSS dulu. Foto makanan = beban lisensi + berat; tunda sampai perlu.

## 6. Mobile vs Desktop

Satu codebase, layout bercabang lewat Tailwind breakpoints. Bukan dua situs.

| Bagian | Mobile (< 768px) | Desktop (≥ 1024px) |
|---|---|---|
| Nav | Bottom tab bar 4 ikon (Menu, Cari, Keranjang, Riwayat) | Top nav + logo kiri, keranjang kanan |
| Katalog | 1 kolom kartu, chip filter horizontal scroll | Grid 3-4 kolom + sidebar filter menetap |
| Detail item | Full-page, tombol tambah sticky bawah | Modal/dialog di atas grid, dua kolom (gambar kiri, opsi kanan) |
| Keranjang | Halaman penuh | Drawer geser kanan, persisten |
| Checkout | Satu kolom, 1 layar | Dua kolom: form kiri, ringkasan kanan |
| Animasi kurir | Peta full-bleed vertikal | Panel tengah maks 900px, latar peta melebar |
| Panggilan | Full-screen mirip panggilan HP asli (avatar besar, tombol hijau/merah) | Kartu panggilan tengah, latar gelap |
| Resep | Akordeon bahan/langkah | Dua kolom: bahan sticky kiri, langkah kanan |

Aturan: mobile-first CSS. Interaksi wajib jalan dengan sentuh; hover hanya sebagai bonus. Target area sentuh ≥ 44px.

## 7. Desain

- Nada: hangat, jenaka, "warung digital". Bukan startup steril.
- Warna: kuning kunyit / merah sambal / hijau pandan / cokelat gula aren, latar krem kertas nasi.
- Tipografi: satu display font berkarakter untuk judul + satu sans netral untuk body. Maksimal 2 font.
- Motif: garis batik/anyaman tipis sebagai border, jangan latar penuh (ganggu keterbacaan).
- Dark mode: ikut `prefers-color-scheme`. Token warna di CSS variables sejak awal.
- Aksesibilitas: kontras AA, fokus terlihat, `prefers-reduced-motion` mematikan animasi kurir (ganti ringkasan teks + skip).

## 8. Performa & SEO

- Static export, tanpa JS berat. Target LCP < 2s di 4G, bundle rute utama < 150KB JS.
- `items.json` dipecah: index ringan untuk katalog, resep dimuat per halaman.
- Halaman SEO: `/resep/[slug]` (kata kunci "resep rendang"), `/daerah/[pulau]`, `/menu`.
- Metadata + OpenGraph per item. Schema.org `Recipe` JSON-LD di halaman resep — ini sumber trafik utama.
- Sitemap + robots dibuat saat build.

## 9. Legal & etika

- Disclaimer jelas di checkout dan footer: situs parodi, tidak ada makanan, tidak ada pembayaran.
- Field kartu demo **disabled** — jangan pernah terima input kartu asli, meski cuma disimpan lokal. Ini batas kepercayaan, bukan tempat berhemat.
- Tanpa analytics pelacak pihak ketiga di v1; kalau perlu, pakai yang tanpa cookie.
- Resep: tulis ulang sendiri, jangan salin dari situs lain.

## 10. Milestone

| Fase | Isi | Selesai bila |
|---|---|---|
| M0 Fondasi | Setup, token desain, layout shell, 10 item contoh | Katalog tampil di mobile + desktop |
| M1 Loop inti | Detail, keranjang, checkout, kurir, panggilan, resep | Loop penuh jalan ujung ke ujung |
| M2 Konten | 80 item, 34 provinsi, semua resep ditulis | Tidak ada item tanpa resep/cerita |
| M3 Poles | Riwayat, share, SEO, a11y, dark mode, performa | Lighthouse ≥ 90 semua kategori |
| M4 Rilis | Domain, sitemap, OG image, disclaimer | Live di makanangin.com |
| M5 Nanti | Random order, promo kilat, streak, blog | — |

## 11. Risiko

| Risiko | Mitigasi |
|---|---|
| Konten 80 resep = pekerjaan terbesar, bukan koding | Kerjakan paralel sejak M0; template resep tetap; jangan tunggu fitur selesai |
| Lelucon habis dalam 1 kunjungan | Variasi acak: alasan kurir, kurir, biaya absurd. Nilai balik = resep, bukan lelucon |
| Aset foto berat / bermasalah lisensi | Emoji + SVG dulu; foto hanya kalau punya hak |
| Dikira aplikasi delivery asli | Disclaimer ganda + kartu disabled + nama domain sudah jujur |
