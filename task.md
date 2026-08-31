# makanangin.com — Task

Aturan: kerjakan urut milestone. Satu task = satu commit kalau bisa. `[ ]` belum, `[x]` selesai.
Definition of Done tiap task: jalan di mobile (375px) **dan** desktop (1440px), tidak ada error konsol.

---

## M0 — Fondasi

### Setup
- [x] `npx create-next-app@latest` — TypeScript, Tailwind, App Router, `src/` off, ESLint on
- [x] Set `output: 'export'` di `next.config.js`
- [x] Buat struktur folder: `app/`, `data/`, `lib/`, `components/`
- [x] `.gitignore`, `README.md` singkat, git init + commit awal
- [ ] Deploy kosong ke Vercel/Cloudflare Pages, pastikan pipeline hidup sejak hari pertama

### Token desain
- [x] `app/globals.css`: CSS variables warna (kunyit, sambal, pandan, gula aren, krem, tinta), radius, shadow
- [x] Blok `@media (prefers-color-scheme: dark)` untuk semua token warna
- [x] Pilih + pasang 2 font (display + sans) via `next/font`
- [x] ~~Extend `tailwind.config`~~ — skip, Tailwind v4 CSS-first: token didefinisikan langsung di `@theme inline` dalam `globals.css`
- [x] Cek kontras teks utama vs latar ≥ 4.5:1 di terang & gelap

### Layout shell
- [x] `components/BottomNav.tsx` — mobile only (`md:hidden`), 4 tab, ikon + label, tinggi ≥ 56px
- [x] `components/TopNav.tsx` — desktop only (`hidden md:flex`), logo, link, badge keranjang
- [x] `app/layout.tsx` — pasang kedua nav + `<main>` dengan padding bawah aman untuk bottom nav
- [x] `components/Footer.tsx` — disclaimer parodi + link tentang
- [x] Halaman `app/tentang/page.tsx` (statis, isi menyusul)

### Data awal
- [x] Tulis tipe `types.ts` sesuai skema di plan.md §2
- [x] `data/items.json` — 10 item contoh lengkap (termasuk resep + cerita), campur umum & tradisional
- [x] `lib/items.ts` — loader + helper `getItem(slug)`, `allItems()`, `byPulau()`
- [x] Validator build-time: script cek tiap item punya slug unik, resep, cerita, daerah — gagal build kalau tidak
- [x] Satu self-check runnable untuk validator (assert-based, tanpa framework)

### Katalog v0
- [x] `app/menu/page.tsx` — grid kartu; 1 kolom mobile, 3-4 kolom desktop
- [x] `components/ItemCard.tsx` — emoji, nama, daerah, harga, chip pedas
- [x] Buka di 375px dan 1440px, perbaiki yang jebol

**M0 selesai bila**: katalog 10 item tampil rapi di dua ukuran, sudah live di URL preview.

---

## M1 — Loop inti

### Filter & cari
- [x] `lib/filter.ts` — filter murni (kategori, pulau, halal) + pencarian teks (nama, daerah, tag) — skip filter `harga`/`pedas`, ga ada UI-nya dulu, tambah kalau kepake
- [x] Self-check `scripts/test-filter.ts` — assert hasil filter & pencarian
- [x] Chip filter kategori + search — dibangun jadi satu `app/menu/MenuBrowser.tsx`, bukan `FilterBar.tsx` terpisah (belum butuh dipisah, cuma 1 dimensi filter)
- [ ] `components/FilterSidebar.tsx` — skip, cuma 4 kategori, chip yang sama udah cukup di desktop (wrap ke bawah)
- [ ] Sinkronkan filter ke query string — skip, tambah kalau share-filtered-menu jadi kebutuhan nyata
- [ ] Debounce pencarian — skip, 10 item lokal ga butuh debounce; revisit pas item ratusan

### Detail item
- [x] `app/menu/[slug]/page.tsx` + `generateStaticParams`
- [x] `components/OpsiPicker.tsx` — tombol toggle (radio-behavior untuk tunggal, multi-select untuk checkbox)
- [x] Hitung harga dinamis dari opsi terpilih
- [x] Tombol "Tambah ke keranjang" sticky di bawah (mobile)
- [ ] Desktop: dialog modal di atas katalog — skip, dipakai halaman penuh 2 kolom biasa; modal nambah kompleksitas routing (intercepting routes) buat manfaat kecil di v1
- [x] Blok cerita asal daerah + link ke `/daerah/[pulau]` — link ada, halaman `/daerah/[pulau]` belum dibuat (masuk M2)
- [x] Metadata + OpenGraph per item

### Keranjang
- [x] `lib/cart.ts` — add / remove / ubah qty / total; fungsi murni
- [x] Self-check `scripts/test-cart.ts` — assert total, item dengan opsi berbeda dihitung terpisah
- [x] `lib/storage.ts` — baca/tulis `localStorage` aman (try/catch, SSR guard)
- [x] `CartProvider` context + hook `useCart()`
- [x] `app/keranjang/page.tsx` — satu halaman responsif (mobile penuh, desktop 2-kolom ringkasan)
- [ ] `components/CartDrawer.tsx` — skip, halaman keranjang biasa udah cukup cepat diakses lewat nav; drawer nambah state overlay buat manfaat kecil
- [x] Rincian biaya: subtotal, ongkir fiktif, biaya rindu kampung
- [x] State kosong keranjang + CTA balik ke menu

### Checkout palsu
- [x] `app/checkout/page.tsx`
- [x] Form kartu demo: semua input `disabled`, nilai prefilled, badge "KARTU DEMO"
- [x] Alamat pengantaran prefilled lucu, boleh diganti (teks bebas, tidak disimpan ke mana pun)
- [x] Disclaimer besar di atas tombol bayar
- [x] Tombol "Bayar" → simpan order ke localStorage → redirect `/kurir`
- [x] Layout dua kolom desktop, satu kolom mobile

### Kurir & panggilan
- [x] `data/kurir.json` — nama, emoji (skip kolom "kecepatan"/kalimat khas, belum kepake di UI)
- [x] `data/alasan.json` — 26 alasan gagal antar
- [x] `app/kurir/page.tsx` — kurir jalan sepanjang garis putus-putus, ETA mundur (bukan peta SVG penuh — garis dashed lebih murah, efeknya sama)
- [x] Durasi animasi 22 detik, tombol "Lewati"
- [x] `prefers-reduced-motion`: lewati animasi, langsung ke panggilan
- [x] `components/PanggilanMasuk.tsx` — full-screen mirip panggilan HP, avatar, tombol terima/tolak
- [x] Alasan acak + tombol "Ya udah" → layar konsolasi
- [ ] Desktop: kartu panggilan terpusat — skip, full-screen dipakai di semua ukuran; kontras dramatisnya justru bagian dari efek leluconnya

### Konsolasi + resep
- [x] `app/pesanan-selesai/page.tsx` (bukan `components/LayarKonsolasi.tsx` — halaman langsung, ga perlu component terpisah untuk 1 pemakaian) — "Makanannya ga dateng. Tapi resepnya buat kamu."
- [x] Tampilkan resep tiap item di keranjang + total uang yang "dihemat"
- [x] Tombol: Pesan lagi / Riwayat — skip tombol "Bagikan" (butuh lib/share.ts, itu task M3)
- [x] `app/resep/[slug]/page.tsx` — bahan, langkah, tips, waktu, porsi + Recipe JSON-LD (diambil maju dari M3, murah sekalian nulis halamannya)
- [x] `app/resep/page.tsx` — index resep (belum ada search box sendiri, ikut nanti kalau daftarnya panjang)
- [ ] Resep: akordeon di mobile — skip, daftar linear udah pendek & scroll biasa cukup; dua kolom sticky-bahan di desktop udah jalan

**M1 selesai bila**: dari beranda sampai layar resep bisa dijalani tanpa jalan buntu, di mobile dan desktop.

---

## M2 — Konten

- [x] Template penulisan item — pola dari 10 item M0 dipakai konsisten: deskripsi 1 kalimat, cerita 2-4 kalimat asal-usul, resep 4-6 bahan + 3-6 langkah + tips
- [x] Daftar 80 item + provinsi asal, cek 34 provinsi terwakili — 34/34 provinsi ada minimal 1 item
- [x] Tulis 50 makanan (umum + tradisional)
- [x] Tulis 15 minuman
- [x] Tulis 15 jajanan/kudapan
- [x] Uji tiap resep secara logika — dibaca manual saat ditulis (bahan match langkah, satuan jelas); belum ada linter otomatis buat ini, kalau nanti nambah ratusan item baru dipertimbangkan
- [x] `data/warung.json` — 10 warung fiktif, dipetakan ke item lewat kecocokan `pulau` (`lib/warung.ts`), bukan field per-item — lebih murah, ga perlu isi 80x field warung manual
- [x] Halaman `app/daerah/[pulau]/page.tsx` — daftar item per pulau + narasi singkat
- [x] Jalankan validator konten; nol pelanggaran

**M2 selesai bila**: `items.json` 80 item, tidak ada field wajib kosong, validator lolos.

---

## M3 — Poles

### Riwayat & share
- [x] `app/riwayat/page.tsx` — daftar order lalu, total hemat, tombol hapus riwayat (+ foto per item, redesign)
- [ ] `lib/share.ts` — encode isi keranjang ke URL (base64/compact), decode di load
- [ ] Halaman share: buka URL → keranjang terisi, banner "Ini pesanan dari temanmu"
- [ ] Batasi panjang URL; kalau kepanjangan, potong + beri tahu

### SEO
- [x] Metadata default + per-rute — `metadataBase` di layout, tiap rute item override title/description/OG sendiri
- [x] JSON-LD `Recipe` di tiap halaman resep
- [x] `sitemap.xml` + `robots.txt` di build — `app/sitemap.ts`/`app/robots.ts`, 172 URL
- [x] OG image (statis dulu, satu desain; per-item kalau sempat) — `app/opengraph-image.tsx` default + per-item udah ada duluan di menu/resep

### Aksesibilitas
- [ ] Navigasi keyboard penuh: katalog, opsi, keranjang, panggilan — belum diuji sistematis
- [x] Focus ring terlihat di semua kontrol — kunyit, kontras jauh lebih baik di atas tombol merah
- [x] `aria-label` pada tombol ikon; `aria-live` untuk perubahan keranjang — aria-live di `CartProvider`, aria-label sudah ada di titik yang butuh (yang punya teks visible ga perlu duplikat)
- [ ] Dialog/drawer: focus trap + tutup pakai Esc — `PanggilanMasuk` full-screen belum ada focus trap
- [ ] Cek dengan screen reader sekali, perbaiki yang kacau

### Performa
- [x] Pecah data: index katalog ringan, resep dimuat per rute — `ItemIndex`, `out/menu.html` 196KB→112KB (43%)
- [ ] Audit bundle; buang dependency yang tidak terpakai
- [ ] Lighthouse mobile & desktop ≥ 90 semua kategori
- [ ] Uji di jaringan lambat (throttle 4G)

### Uji lintas perangkat
- [ ] Safari iOS, Chrome Android, Chrome/Safari/Firefox desktop — cuma Chromium browser-pane
- [x] Cek safe-area iPhone (bottom nav vs home indicator) — `env(safe-area-inset-bottom)` di nav + main + sticky CTA
- [x] Cek 320px (layar tersempit) tidak jebol — ketemu 1 bug nyata (qty stepper kepotong di keranjang), udah difix

**M3 selesai bila**: Lighthouse ≥ 90, keyboard-only bisa selesaikan loop.

---

## M4 — Rilis

- [x] Isi halaman Tentang: premis, disclaimer, kredit, kontak — skip "kredit/kontak" formal, situs ga punya tim/kontak resmi buat ditampilin
- [ ] Review teks legal: tidak ada klaim menyesatkan
- [ ] Pasang domain makanangin.com + HTTPS
- [ ] Cek 404 punya halaman sendiri
- [ ] Uji akhir loop penuh di production
- [ ] Umumkan

---

## M5 — Nanti (jangan sentuh sebelum M4 live)

- [ ] "Pesan Angin" — order acak satu klik
- [ ] Promo kilat berputar 60-90 detik
- [ ] Streak & badge
- [ ] Tray patungan (butuh backend — pertimbangkan ulang)
- [ ] Suara kurir (TTS/rekaman)
- [ ] Blog / artikel kuliner daerah
- [ ] Versi bahasa Inggris
- [ ] Katalog 200+ item
